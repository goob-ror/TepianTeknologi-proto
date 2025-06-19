<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pesanan;
use Inertia\Inertia;

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

        $orders = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
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
            'total_revenue' => Pesanan::whereIn('status', ['dibayar', 'dikirim', 'selesai'])
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
     * Export orders to CSV format.
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

        $callback = function() use ($orders) {
            $file = fopen('php://output', 'w');

            // Add BOM for UTF-8 support in Excel
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // CSV headers
            fputcsv($file, [
                'Order ID',
                'Customer Name',
                'Customer Email',
                'Recipient Name',
                'Recipient Phone',
                'Delivery Address',
                'Order Status',
                'Total Amount (IDR)',
                'Payment Method',
                'Payment Status',
                'Shipping Service',
                'Tracking Number',
                'Order Date',
                'Last Updated',
                'Notes'
            ]);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->id,
                    $order->user->nama_lengkap ?? $order->user->name ?? 'N/A',
                    $order->user->email ?? 'N/A',
                    $order->nama_penerima,
                    $order->no_hp_penerima ?? 'N/A',
                    $order->alamat,
                    ucfirst($order->status),
                    number_format($order->total_harga, 0, ',', '.'),
                    $order->payment->metode ?? 'N/A',
                    $order->payment->status ?? 'N/A',
                    $order->shipping->jasa_kirim ?? 'N/A',
                    $order->shipping->nomor_resi ?? 'N/A',
                    $order->created_at->format('Y-m-d H:i:s'),
                    $order->updated_at->format('Y-m-d H:i:s'),
                    $order->catatan ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export orders to Excel format (basic implementation).
     */
    private function exportToExcel($orders, $filename)
    {
        // For now, we'll create a tab-separated file that Excel can open
        // In a production environment, you might want to use a library like PhpSpreadsheet

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        $callback = function() use ($orders) {
            echo chr(0xEF).chr(0xBB).chr(0xBF); // BOM for UTF-8

            // Excel headers (tab-separated)
            echo implode("\t", [
                'Order ID',
                'Customer Name',
                'Customer Email',
                'Recipient Name',
                'Recipient Phone',
                'Delivery Address',
                'Order Status',
                'Total Amount (IDR)',
                'Payment Method',
                'Payment Status',
                'Shipping Service',
                'Tracking Number',
                'Order Date',
                'Last Updated',
                'Notes'
            ]) . "\n";

            foreach ($orders as $order) {
                echo implode("\t", [
                    $order->id,
                    $order->user->nama_lengkap ?? $order->user->name ?? 'N/A',
                    $order->user->email ?? 'N/A',
                    $order->nama_penerima,
                    $order->no_hp_penerima ?? 'N/A',
                    str_replace(["\r", "\n", "\t"], ' ', $order->alamat), // Clean address
                    ucfirst($order->status),
                    number_format($order->total_harga, 0, ',', '.'),
                    $order->payment->metode ?? 'N/A',
                    $order->payment->status ?? 'N/A',
                    $order->shipping->jasa_kirim ?? 'N/A',
                    $order->shipping->nomor_resi ?? 'N/A',
                    $order->created_at->format('Y-m-d H:i:s'),
                    $order->updated_at->format('Y-m-d H:i:s'),
                    str_replace(["\r", "\n", "\t"], ' ', $order->catatan ?? 'N/A'),
                ]) . "\n";
            }
        };

        return response()->stream($callback, 200, $headers);
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
}
