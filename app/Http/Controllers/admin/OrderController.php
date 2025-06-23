<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pesanan;
use App\Models\Pembayaran;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $query = Pesanan::with(['user', 'details.product', 'payment', 'shipping']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_penerima', 'like', "%{$search}%")
                  ->orWhere('no_hp_penerima', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('nama_lengkap', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Apply status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply date filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Sort by specified column or default to ID (ascending order)
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'asc');

        $allowedSortColumns = ['id', 'nama_penerima', 'status', 'total_harga', 'created_at'];
        if (in_array($sortBy, $allowedSortColumns)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('id', 'asc');
        }

        // Check if timeline view is requested (load all orders for timeline)
        $viewMode = $request->get('view_mode', 'table');
        if ($viewMode === 'hierarchical') {
            // For timeline view, get all orders without pagination
            $orders = $query->get();
            $ordersData = [
                'data' => $orders,
                'total' => $orders->count(),
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => $orders->count(),
            ];
        } else {
            // For table view, use pagination
            $orders = $query->paginate(10)->withQueryString();
            $ordersData = $orders;
        }

        return Inertia::render('admin/orders/index', [
            'orders' => $ordersData,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'view_mode' => $viewMode,
            ],
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Pesanan $order)
    {
        $order->load([
            'user',
            'details.product.category',
            'details.product.brand',
            'payment',
            'shipping'
        ]);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * Update the order status.
     */
    public function updateStatus(Request $request, Pesanan $order)
    {
        $request->validate([
            'status' => 'required|in:menunggu,dibayar,dikirim,selesai,dibatalkan',
            'catatan' => 'nullable|string|max:500',
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        // If status is changed to 'dikirim', update shipping info
        if ($request->status === 'dikirim' && $request->filled('shipping_info')) {
            $order->shipping()->updateOrCreate(
                ['pesanan_id' => $order->id],
                [
                    'nomor_resi' => $request->shipping_info['nomor_resi'] ?? null,
                    'jasa_kirim' => $request->shipping_info['jasa_kirim'] ?? null,
                    'status_kirim' => 'dikirim',
                    'tanggal_kirim' => now(),
                ]
            );
        }

        return redirect()->route('admin.orders.show', $order)
            ->with('success', 'Order status updated successfully.');
    }

    /**
     * Display pending orders.
     */
    public function pending(Request $request)
    {
        $query = Pesanan::with(['user', 'details.product', 'payment'])
            ->where('status', 'menunggu');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_penerima', 'like', "%{$search}%")
                  ->orWhere('no_hp_penerima', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('nama_lengkap', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/orders/pending', [
            'orders' => $orders,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Get order statistics for dashboard.
     */
    public function statistics()
    {
        $stats = [
            'total_orders' => Pesanan::count(),
            'pending_orders' => Pesanan::where('status', 'menunggu')->count(),
            'paid_orders' => Pesanan::where('status', 'dibayar')->count(),
            'shipped_orders' => Pesanan::where('status', 'dikirim')->count(),
            'completed_orders' => Pesanan::where('status', 'selesai')->count(),
            'cancelled_orders' => Pesanan::where('status', 'dibatalkan')->count(),
            'daily_sales' => Pesanan::whereIn('status', ['dibayar', 'dikirim', 'selesai'])
                ->whereDate('created_at', today())
                ->sum('total_harga'),
            'monthly_revenue' => Pesanan::whereIn('status', ['dibayar', 'dikirim', 'selesai'])
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total_harga'),
        ];

        return response()->json($stats);
    }

    /**
     * Bulk update order status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'exists:pesanan,id',
            'status' => 'required|in:menunggu,dibayar,dikirim,selesai,dibatalkan',
        ]);

        Pesanan::whereIn('id', $request->order_ids)
            ->update(['status' => $request->status]);

        return redirect()->back()
            ->with('success', 'Selected orders updated successfully.');
    }

    /**
     * Export orders to CSV/Excel.
     */
    public function export(Request $request)
    {
        $query = Pesanan::with(['user', 'details.product', 'payment', 'shipping']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_penerima', 'like', "%{$search}%")
                  ->orWhere('no_hp_penerima', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('nama_lengkap', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Apply same filters as index
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        // Determine export format
        $format = $request->get('format', 'csv'); // csv or excel
        $extension = $format === 'excel' ? 'xlsx' : 'csv';
        $filename = 'orders_export_' . now()->format('Y-m-d_H-i-s') . '.' . $extension;

        if ($format === 'excel') {
            return $this->exportToExcel($orders, $filename);
        } else {
            return $this->exportToCsv($orders, $filename);
        }
    }

    /**
     * Export orders to enhanced CSV format with professional styling.
     */
    private function exportToCsv($orders, $filename)
    {
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        $callback = function() use ($orders, $filename) {
            $file = fopen('php://output', 'w');

            // Add BOM for UTF-8 support in Excel
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Professional header section
            fputcsv($file, ['LAPORAN PESANAN - TEPIAN TEKNOLOGI'], ';');
            fputcsv($file, ['==========================================='], ';');
            fputcsv($file, ['Tanggal Export', now()->format('d F Y, H:i:s')], ';');
            fputcsv($file, ['Total Pesanan', $orders->count() . ' pesanan'], ';');
            fputcsv($file, ['File', $filename], ';');
            fputcsv($file, [], ';'); // Empty row

            // Summary statistics
            $statusCounts = $orders->groupBy('status')->map->count();
            $totalRevenue = $orders->where('status', '!=', 'dibatalkan')->sum('total_harga');

            fputcsv($file, ['RINGKASAN PESANAN'], ';');
            fputcsv($file, ['-------------------'], ';');
            foreach ($statusCounts as $status => $count) {
                $statusLabel = match($status) {
                    'menunggu' => 'Menunggu Pembayaran',
                    'dibayar' => 'Sudah Dibayar',
                    'dikirim' => 'Sedang Dikirim',
                    'selesai' => 'Selesai',
                    'dibatalkan' => 'Dibatalkan',
                    default => ucfirst($status)
                };
                fputcsv($file, [$statusLabel, $count . ' pesanan'], ';');
            }
            fputcsv($file, ['Total Pendapatan', 'Rp ' . number_format($totalRevenue, 0, ',', '.')], ';');
            fputcsv($file, [], ';'); // Empty row

            // Main data headers with enhanced formatting
            fputcsv($file, [
                'ID',
                'Tanggal & Waktu',
                'Umur Pesanan',
                'Status Pesanan',
                'Nama Customer',
                'Email Customer',
                'Nama Penerima',
                'No. HP Penerima',
                'Alamat Lengkap',
                'Total Harga (Rp)',
                'Jumlah Item',
                'Metode Pembayaran',
                'Status Pembayaran',
                'Jasa Pengiriman',
                'Nomor Resi',
                'Terakhir Diupdate',
                'Catatan Khusus'
            ], ';');

            foreach ($orders as $order) {
                // Calculate order age
                $orderAge = $this->calculateOrderAge($order->created_at);

                // Enhanced status labels
                $statusLabel = match($order->status) {
                    'menunggu' => '🟡 Menunggu Pembayaran',
                    'dibayar' => '🔵 Sudah Dibayar',
                    'dikirim' => '🟣 Sedang Dikirim',
                    'selesai' => '🟢 Selesai',
                    'dibatalkan' => '🔴 Dibatalkan',
                    default => ucfirst($order->status)
                };

                $paymentStatusLabel = match($order->payment->status ?? '') {
                    'menunggu_validasi' => '⏳ Menunggu Validasi',
                    'valid' => '✅ Valid',
                    'tidak_valid' => '❌ Tidak Valid',
                    'pending' => '⏸️ Pending',
                    'completed' => '✅ Selesai',
                    default => $order->payment->status ?? '➖ Belum Ada'
                };

                // Enhanced data cleaning
                $cleanAddress = $this->cleanTextForCsv($order->alamat);
                $cleanNotes = $this->cleanTextForCsv($order->catatan ?? '');

                // Professional formatting
                $formattedPrice = number_format($order->total_harga, 0, ',', '.');
                $formattedDate = $order->created_at->format('d/m/Y H:i');
                $formattedUpdate = $order->updated_at->format('d/m/Y H:i');

                fputcsv($file, [
                    sprintf('#%05d', $order->id),
                    $formattedDate,
                    $orderAge,
                    $statusLabel,
                    $order->user->nama_lengkap ?? $order->user->name ?? '➖ Tidak Diketahui',
                    $order->user->email ?? '➖ Tidak Ada',
                    $order->nama_penerima,
                    $order->no_hp_penerima ?? '➖ Tidak Ada',
                    $cleanAddress,
                    $formattedPrice,
                    $order->details->count() . ' item',
                    $order->payment->metode ?? '➖ Belum Dipilih',
                    $paymentStatusLabel,
                    $order->shipping->jasa_kirim ?? '➖ Belum Dipilih',
                    $order->shipping->nomor_resi ?? '➖ Belum Ada',
                    $formattedUpdate,
                    $cleanNotes ?: '➖ Tidak Ada'
                ], ';');
            }

            // Add detailed product breakdown
            fputcsv($file, [], ';'); // Empty row
            fputcsv($file, ['DETAIL PRODUK PESANAN'], ';');
            fputcsv($file, ['========================'], ';');
            fputcsv($file, [], ';'); // Empty row

            foreach ($orders as $order) {
                if ($order->details->count() > 0) {
                    fputcsv($file, ["Pesanan #{$order->id} - {$order->nama_penerima}"], ';');
                    fputcsv($file, ['Nama Produk', 'Kategori', 'Harga Satuan', 'Jumlah', 'Subtotal'], ';');

                    foreach ($order->details as $detail) {
                        fputcsv($file, [
                            $detail->product->nama_produk ?? 'Produk Tidak Ditemukan',
                            $detail->product->category->nama_kategori ?? 'Tidak Ada Kategori',
                            number_format($detail->harga_satuan, 0, ',', '.'),
                            $detail->jumlah . ' pcs',
                            number_format($detail->harga_satuan * $detail->jumlah, 0, ',', '.')
                        ], ';');
                    }
                    fputcsv($file, [], ';'); // Empty row between orders
                }
            }

            // Professional footer
            fputcsv($file, [], ';'); // Empty row
            fputcsv($file, ['=== AKHIR LAPORAN ==='], ';');
            fputcsv($file, ['Dibuat oleh: Tepian Teknologi Admin System'], ';');
            fputcsv($file, ['Waktu: ' . now()->format('d F Y, H:i:s')], ';');

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Clean text data for CSV export.
     */
    private function cleanTextForCsv($text)
    {
        if (empty($text)) return '➖ Tidak Ada';

        // Remove problematic characters and normalize whitespace
        $cleaned = preg_replace('/[\r\n\t]+/', ' ', trim($text));
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);

        // Remove any remaining problematic characters
        $cleaned = str_replace(['"', "'", ';', ','], ['', '', '', ''], $cleaned);

        return $cleaned ?: '➖ Tidak Ada';
    }

    /**
     * Export orders to Excel format with enhanced professional formatting.
     */
    private function exportToExcel($orders, $filename)
    {
        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        $callback = function() use ($orders, $filename) {
            echo chr(0xEF).chr(0xBB).chr(0xBF); // BOM for UTF-8

            // Professional header section
            echo "LAPORAN PESANAN - TEPIAN TEKNOLOGI\n";
            echo "===========================================\n";
            echo "Tanggal Export\t" . now()->format('d F Y, H:i:s') . "\n";
            echo "Total Pesanan\t" . $orders->count() . " pesanan\n";
            echo "File\t" . $filename . "\n";
            echo "\n"; // Empty row

            // Summary statistics
            $statusCounts = $orders->groupBy('status')->map->count();
            $totalRevenue = $orders->where('status', '!=', 'dibatalkan')->sum('total_harga');

            echo "RINGKASAN PESANAN\n";
            echo "-------------------\n";
            foreach ($statusCounts as $status => $count) {
                $statusLabel = match($status) {
                    'menunggu' => 'Menunggu Pembayaran',
                    'dibayar' => 'Sudah Dibayar',
                    'dikirim' => 'Sedang Dikirim',
                    'selesai' => 'Selesai',
                    'dibatalkan' => 'Dibatalkan',
                    default => ucfirst($status)
                };
                echo $statusLabel . "\t" . $count . " pesanan\n";
            }
            echo "Total Pendapatan\tRp " . number_format($totalRevenue, 0, ',', '.') . "\n";
            echo "\n"; // Empty row

            // Excel headers (tab-separated) with enhanced formatting
            echo implode("\t", [
                'ID',
                'Tanggal & Waktu',
                'Umur Pesanan',
                'Status Pesanan',
                'Nama Customer',
                'Email Customer',
                'Nama Penerima',
                'No. HP Penerima',
                'Alamat Lengkap',
                'Total Harga (Rp)',
                'Jumlah Item',
                'Metode Pembayaran',
                'Status Pembayaran',
                'Jasa Pengiriman',
                'Nomor Resi',
                'Terakhir Diupdate',
                'Catatan Khusus'
            ]) . "\n";

            foreach ($orders as $order) {
                // Calculate order age
                $orderAge = $this->calculateOrderAge($order->created_at);

                // Enhanced status labels (without emojis for Excel compatibility)
                $statusLabel = match($order->status) {
                    'menunggu' => 'Menunggu Pembayaran',
                    'dibayar' => 'Sudah Dibayar',
                    'dikirim' => 'Sedang Dikirim',
                    'selesai' => 'Selesai',
                    'dibatalkan' => 'Dibatalkan',
                    default => ucfirst($order->status)
                };

                $paymentStatusLabel = match($order->payment->status ?? '') {
                    'menunggu_validasi' => 'Menunggu Validasi',
                    'valid' => 'Valid',
                    'tidak_valid' => 'Tidak Valid',
                    'pending' => 'Pending',
                    'completed' => 'Selesai',
                    default => $order->payment->status ?? 'Belum Ada'
                };

                // Enhanced data cleaning
                $cleanAddress = $this->cleanTextForExcel($order->alamat);
                $cleanNotes = $this->cleanTextForExcel($order->catatan ?? '');

                // Professional formatting
                $formattedPrice = number_format($order->total_harga, 0, ',', '.');
                $formattedDate = $order->created_at->format('d/m/Y H:i');
                $formattedUpdate = $order->updated_at->format('d/m/Y H:i');

                echo implode("\t", [
                    sprintf('#%05d', $order->id),
                    $formattedDate,
                    $orderAge,
                    $statusLabel,
                    $order->user->nama_lengkap ?? $order->user->name ?? 'Tidak Diketahui',
                    $order->user->email ?? 'Tidak Ada',
                    $order->nama_penerima,
                    $order->no_hp_penerima ?? 'Tidak Ada',
                    $cleanAddress,
                    $formattedPrice,
                    $order->details->count() . ' item',
                    $order->payment->metode ?? 'Belum Dipilih',
                    $paymentStatusLabel,
                    $order->shipping->jasa_kirim ?? 'Belum Dipilih',
                    $order->shipping->nomor_resi ?? 'Belum Ada',
                    $formattedUpdate,
                    $cleanNotes ?: 'Tidak Ada'
                ]) . "\n";
            }

            // Add detailed product breakdown
            echo "\n"; // Empty row
            echo "DETAIL PRODUK PESANAN\n";
            echo "========================\n";
            echo "\n"; // Empty row

            foreach ($orders as $order) {
                if ($order->details->count() > 0) {
                    echo "Pesanan #{$order->id} - {$order->nama_penerima}\n";
                    echo implode("\t", ['Nama Produk', 'Kategori', 'Harga Satuan', 'Jumlah', 'Subtotal']) . "\n";

                    foreach ($order->details as $detail) {
                        echo implode("\t", [
                            $detail->product->nama_produk ?? 'Produk Tidak Ditemukan',
                            $detail->product->category->nama_kategori ?? 'Tidak Ada Kategori',
                            number_format($detail->harga_satuan, 0, ',', '.'),
                            $detail->jumlah . ' pcs',
                            number_format($detail->harga_satuan * $detail->jumlah, 0, ',', '.')
                        ]) . "\n";
                    }
                    echo "\n"; // Empty row between orders
                }
            }

            // Professional footer
            echo "\n"; // Empty row
            echo "=== AKHIR LAPORAN ===\n";
            echo "Dibuat oleh: Tepian Teknologi Admin System\n";
            echo "Waktu: " . now()->format('d F Y, H:i:s') . "\n";
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Clean text data for Excel export.
     */
    private function cleanTextForExcel($text)
    {
        if (empty($text)) return 'Tidak Ada';

        // Remove problematic characters and normalize whitespace
        $cleaned = preg_replace('/[\r\n\t]+/', ' ', trim($text));
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);

        // Remove any remaining problematic characters for Excel
        $cleaned = str_replace(['"', "'"], ['', ''], $cleaned);

        return $cleaned ?: 'Tidak Ada';
    }

    /**
     * Get pending orders count for dashboard indicators.
     */
    public function getPendingCount()
    {
        $count = Pesanan::where('status', 'menunggu')->count();

        return response()->json([
            'pending_count' => $count,
            'has_pending' => $count > 0,
            'message' => $count > 0 ? "$count Pending Orders" : "No Pending Orders"
        ]);
    }

    /**
     * Generate and download transaction proof PDF for an order.
     */
    public function downloadTransactionProof(Pesanan $order)
    {
        try {
            // Load all necessary relationships
            $order->load([
                'user',
                'details.product.category',
                'details.product.brand',
                'payment',
                'shipping'
            ]);

            // Ensure storage link exists
            if (!is_link(public_path('storage'))) {
                Log::warning('Storage link not found. Run: php artisan storage:link');
            }

            // Generate PDF with options
            $pdf = Pdf::loadView('pdf.transaction-proof', compact('order'));

            // Set paper size and orientation with DomPDF options
            $pdf->setPaper('A4', 'portrait')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isPhpEnabled' => true,
                    'isRemoteEnabled' => false,
                    'defaultFont' => 'DejaVu Sans',
                    'dpi' => 150,
                    'enable_font_subsetting' => false,
                    'chroot' => public_path(),
                ]);

            // Set options to handle images better
            $pdf->setOptions([
                'isRemoteEnabled' => true,
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'debugKeepTemp' => false,
                'debugCss' => false,
                'debugLayout' => false,
                'debugLayoutLines' => false,
                'debugLayoutBlocks' => false,
                'debugLayoutInline' => false,
                'debugLayoutPaddingBox' => false,
                'defaultMediaType' => 'print',
                'isFontSubsettingEnabled' => true,
                'defaultPaperSize' => 'A4',
                'defaultPaperOrientation' => 'portrait',
                'chroot' => public_path(),
                'logOutputFile' => storage_path('logs/dompdf.log'),
                'isJavascriptEnabled' => false,
                'isRemoteEnabled' => true,
            ]);

            // Generate filename
            $filename = 'transaction_proof_order_' . $order->id . '_' . now()->format('Y-m-d') . '.pdf';

            // Return PDF download
            return $pdf->download($filename);

        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('PDF Generation Error: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'trace' => $e->getTraceAsString()
            ]);

            // Return error response
            return redirect()->back()->with('error', 'Failed to generate PDF: ' . $e->getMessage());
        }
    }

    /**
     * Upload payment proof for an order.
     */
    public function uploadPaymentProof(Request $request, Pesanan $order)
    {
        $request->validate([
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'metode' => 'required|string|max:100',
            'jumlah_bayar' => 'required|numeric|min:0',
            'catatan_validasi' => 'nullable|string|max:1000',
        ]);

        try {
            // Handle file upload
            $file = $request->file('bukti_pembayaran');
            $filename = 'payment_proof_order_' . $order->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('payments', $filename, 'public');

            // Create or update payment record
            $payment = Pembayaran::updateOrCreate(
                ['pesanan_id' => $order->id],
                [
                    'metode' => $request->metode,
                    'bukti_pembayaran' => $path,
                    'status' => 'menunggu_validasi',
                    'jumlah_bayar' => $request->jumlah_bayar,
                    'tanggal_bayar' => now(),
                    'validated_by' => Auth::id(),
                    'catatan_validasi' => $request->catatan_validasi,
                ]
            );

            // Update order status if needed
            if ($order->status === 'menunggu') {
                $order->update(['status' => 'dibayar']);
            }

            return redirect()->back()->with('success', 'Bukti pembayaran berhasil diupload.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengupload bukti pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Validate payment proof.
     */
    public function validatePaymentProof(Request $request, Pesanan $order)
    {
        $request->validate([
            'status' => 'required|in:valid,tidak_valid',
            'catatan_validasi' => 'nullable|string|max:1000',
        ]);

        $payment = $order->payment;
        if (!$payment) {
            return redirect()->back()->with('error', 'Pembayaran tidak ditemukan.');
        }

        $payment->update([
            'status' => $request->status,
            'validated_at' => now(),
            'validated_by' => Auth::id(),
            'catatan_validasi' => $request->catatan_validasi,
        ]);

        // Update order status based on payment validation
        if ($request->status === 'valid') {
            $order->update(['status' => 'dibayar']);
        } elseif ($request->status === 'tidak_valid') {
            $order->update(['status' => 'menunggu']);
        }

        return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui.');
    }

    /**
     * Export orders for specific time period to CSV.
     */
    public function exportTimePeriod(Request $request)
    {
        $query = Pesanan::with(['user', 'details.product', 'payment', 'shipping']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_penerima', 'like', "%{$search}%")
                  ->orWhere('no_hp_penerima', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('nama_lengkap', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Apply status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply time period filters
        $periodType = $request->get('period_type'); // 'year', 'month', 'day'
        $year = $request->get('year');
        $month = $request->get('month');
        $day = $request->get('day');

        if ($periodType === 'year' && $year) {
            $query->whereYear('created_at', $year);
        } elseif ($periodType === 'month' && $year && $month) {
            $query->whereYear('created_at', $year)
                  ->whereMonth('created_at', date('m', strtotime($month . ' 1')));
        } elseif ($periodType === 'day' && $year && $month && $day) {
            $query->whereYear('created_at', $year)
                  ->whereMonth('created_at', date('m', strtotime($month . ' 1')))
                  ->whereDay('created_at', $day);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        // Generate filename based on period
        $periodLabel = match($periodType) {
            'year' => "tahun_{$year}",
            'month' => "bulan_{$month}_{$year}",
            'day' => "tanggal_{$day}_{$month}_{$year}",
            default => 'periode_khusus'
        };

        $filename = "orders_export_{$periodLabel}_" . now()->format('Y-m-d_H-i-s') . '.csv';

        return $this->exportToCsv($orders, $filename);
    }

    /**
     * Calculate human-readable order age.
     */
    private function calculateOrderAge($createdAt)
    {
        $now = now();
        $orderDate = $createdAt;
        $diffInSeconds = $now->diffInSeconds($orderDate);

        if ($diffInSeconds < 60) {
            return $diffInSeconds . ' detik yang lalu';
        } elseif ($diffInSeconds < 3600) {
            $minutes = floor($diffInSeconds / 60);
            return $minutes . ' menit yang lalu';
        } elseif ($diffInSeconds < 86400) {
            $hours = floor($diffInSeconds / 3600);
            return $hours . ' jam yang lalu';
        } elseif ($diffInSeconds < 2592000) {
            $days = floor($diffInSeconds / 86400);
            return $days . ' hari yang lalu';
        } elseif ($diffInSeconds < 31536000) {
            $months = floor($diffInSeconds / 2592000);
            return $months . ' bulan yang lalu';
        } else {
            $years = floor($diffInSeconds / 31536000);
            return $years . ' tahun yang lalu';
        }
    }
}
