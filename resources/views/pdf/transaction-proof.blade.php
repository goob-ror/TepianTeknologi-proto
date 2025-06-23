<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bukti Transaksi - Order #{{ $order->id }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            color: #1a202c;
            line-height: 1.6;
            background-color: #f7fafc;
        }

        .receipt-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }

        .header {
            background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%);
            color: white;
            padding: 50px 40px;
            position: relative;
            text-align: center;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.05);
            opacity: 1;
        }

        .header-content {
            position: relative;
            z-index: 2;
        }

        .company-logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: 900;
            border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .company-name {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .document-title {
            font-size: 20px;
            font-weight: 400;
            opacity: 0.95;
            margin-bottom: 25px;
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        .transaction-ids {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 20px;
        }

        .transaction-id {
            background: rgba(255, 255, 255, 0.2);
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
        }

        .transaction-id-label {
            font-size: 11px;
            opacity: 0.8;
            display: block;
            margin-bottom: 2px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .transaction-id-value {
            font-size: 16px;
            font-weight: 700;
        }

        .content {
            padding: 45px;
        }

        .summary-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 40px;
        }

        .summary-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            padding: 25px;
            border: 1px solid #cbd5e0;
            position: relative;
            overflow: hidden;
        }

        .summary-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #2563eb, #1d4ed8);
        }

        .summary-card-title {
            font-size: 14px;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .summary-card-value {
            font-size: 24px;
            font-weight: 800;
            color: #1a202c;
            margin-bottom: 5px;
        }

        .summary-card-subtitle {
            font-size: 12px;
            color: #718096;
        }

        .info-section {
            margin-bottom: 35px;
            background: #ffffff;
            border-radius: 12px;
            padding: 30px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .info-title {
            font-size: 20px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
        }

        .info-title::before {
            content: '';
            width: 6px;
            height: 24px;
            background: linear-gradient(180deg, #2563eb, #1d4ed8);
            margin-right: 15px;
            border-radius: 3px;
        }

        .info-grid {
            display: grid;
            gap: 15px;
        }

        .info-row {
            display: grid;
            grid-template-columns: 220px 1fr;
            align-items: start;
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-weight: 600;
            color: #4a5568;
            font-size: 14px;
        }

        .info-value {
            color: #1a202c;
            font-size: 14px;
            word-break: break-word;
            font-weight: 500;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-badge::before {
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 6px;
        }

        .status-menunggu {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-menunggu::before { background-color: #f59e0b; }

        .status-dibayar {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-dibayar::before { background-color: #10b981; }

        .status-dikirim {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .status-dikirim::before { background-color: #3b82f6; }

        .status-selesai {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-selesai::before { background-color: #22c55e; }

        .status-dibatalkan {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .status-dibatalkan::before { background-color: #ef4444; }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .items-table th,
        .items-table td {
            padding: 16px 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        .items-table th {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
            font-weight: 700;
            color: white;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .items-table tbody tr:nth-child(even) {
            background-color: #f8fafc;
        }

        .items-table tbody tr:nth-child(odd) {
            background-color: #ffffff;
        }

        .items-table .text-right {
            text-align: right;
        }

        .items-table .text-center {
            text-align: center;
        }

        .total-section {
            margin-top: 35px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px;
            border-radius: 12px;
            border: 2px solid #cbd5e0;
            position: relative;
        }

        .total-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #2563eb, #1d4ed8);
            border-radius: 12px 12px 0 0;
        }

        .subtotal-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 16px;
            color: #4a5568;
        }

        .grand-total {
            font-size: 24px;
            font-weight: 800;
            color: #1a202c;
            padding: 20px 0;
            border-top: 3px solid #2563eb;
            margin-top: 15px;
            text-align: right;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .grand-total-label {
            font-size: 18px;
            font-weight: 600;
            color: #2563eb;
        }

        .payment-proof-section {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 2px solid #2563eb;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
        }

        .payment-proof-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(37, 99, 235, 0.03);
        }

        .payment-proof-title {
            font-weight: 600;
            color: #2563eb;
            margin-bottom: 25px;
            font-size: 18px;
            text-align: center;
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .payment-proof-title::before,
        .payment-proof-title::after {
            content: '';
            flex: 1;
            height: 2px;
            background: #2563eb;
            margin: 0 20px;
        }

        .payment-proof-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .payment-proof-image {
            width: 100%;
            max-width: 500px;
            margin: 20px 0;
            position: relative;
        }

        .payment-proof-img {
            width: 100%;
            height: auto;
            max-height: 400px;
            object-fit: contain;
            border: 3px solid #2563eb;
            border-radius: 12px;
            background: white;
            padding: 10px;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
            transition: transform 0.3s ease;
        }



        .payment-proof-caption {
            text-align: center;
            margin-top: 15px;
            font-size: 14px;
            color: #4a5568;
            font-weight: 500;
        }

        .payment-proof-meta {
            text-align: center;
            margin-top: 8px;
            font-size: 11px;
            color: #718096;
            background: rgba(255, 255, 255, 0.7);
            padding: 8px 12px;
            border-radius: 6px;
            backdrop-filter: blur(5px);
        }

        .error-section {
            border: 2px solid #ef4444;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            color: #dc2626;
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            margin: 20px 0;
            position: relative;
        }

        .error-section::before {
            content: '⚠️';
            font-size: 48px;
            display: block;
            margin-bottom: 15px;
        }

        .error-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .error-details {
            font-size: 12px;
            color: #7f1d1d;
            background: rgba(255, 255, 255, 0.5);
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
        }

        .footer {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
            color: white;
            padding: 40px;
            text-align: center;
            font-size: 13px;
            position: relative;
        }

        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.05);
        }

        .footer-content {
            position: relative;
            z-index: 1;
        }

        .footer p {
            margin-bottom: 10px;
            font-weight: 500;
        }

        .footer-company {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 15px;
        }

        .generated-date {
            margin-top: 20px;
            font-style: italic;
            opacity: 0.8;
            font-size: 11px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 15px;
        }

        .footer-note {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 10px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            body {
                padding: 15px;
            }

            .content {
                padding: 25px;
            }

            .summary-cards {
                grid-template-columns: 1fr;
                gap: 15px;
            }

            .transaction-ids {
                flex-direction: column;
                gap: 15px;
            }

            .info-row {
                grid-template-columns: 1fr;
                gap: 4px;
            }

            .info-label {
                font-weight: 600;
                color: #2563eb;
            }

            .company-name {
                font-size: 28px;
            }

            .items-table {
                font-size: 11px;
            }

            .items-table th,
            .items-table td {
                padding: 10px 8px;
            }

            .grand-total {
                font-size: 20px;
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .receipt-container {
                box-shadow: none;
                border-radius: 0;
            }


        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <div class="header-content">
                <div class="company-logo">TT</div>
                <div class="company-name">Tepian Teknologi</div>
                <div class="document-title">Bukti Transaksi</div>

                <div class="transaction-ids">
                    <div class="transaction-id">
                        <span class="transaction-id-label">Order ID</span>
                        <span class="transaction-id-value">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</span>
                    </div>

                    @if($order->payment)
                    <div class="transaction-id">
                        <span class="transaction-id-label">Payment ID</span>
                        <span class="transaction-id-value">#{{ str_pad($order->payment->id, 6, '0', STR_PAD_LEFT) }}</span>
                    </div>
                    @endif

                    @if($order->shipping && $order->shipping->nomor_resi)
                    <div class="transaction-id">
                        <span class="transaction-id-label">Tracking ID</span>
                        <span class="transaction-id-value">{{ $order->shipping->nomor_resi }}</span>
                    </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="content">
            <!-- Summary Cards -->
            <div class="summary-cards">
                <div class="summary-card">
                    <div class="summary-card-title">Total Pembayaran</div>
                    <div class="summary-card-value">Rp {{ number_format($order->total_harga, 0, ',', '.') }}</div>
                    <div class="summary-card-subtitle">{{ $order->details->count() }} item(s)</div>
                </div>

                <div class="summary-card">
                    <div class="summary-card-title">Status Pesanan</div>
                    <div class="summary-card-value">
                        @switch($order->status)
                            @case('menunggu')
                                Menunggu Pembayaran
                                @break
                            @case('dibayar')
                                Sudah Dibayar
                                @break
                            @case('dikirim')
                                Sedang Dikirim
                                @break
                            @case('selesai')
                                Pesanan Selesai
                                @break
                            @case('dibatalkan')
                                Dibatalkan
                                @break
                            @default
                                {{ ucfirst($order->status) }}
                        @endswitch
                    </div>
                    <div class="summary-card-subtitle">{{ $order->created_at->format('d M Y') }}</div>
                </div>
            </div>

            <!-- Transaction IDs Section -->
            <div class="info-section">
                <div class="info-title">Identitas Transaksi</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Order ID:</div>
                        <div class="info-value">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</div>
                    </div>
                    @if($order->payment)
                    <div class="info-row">
                        <div class="info-label">Payment ID:</div>
                        <div class="info-value">#{{ str_pad($order->payment->id, 6, '0', STR_PAD_LEFT) }}</div>
                    </div>
                    @endif
                    @if($order->shipping && $order->shipping->id)
                    <div class="info-row">
                        <div class="info-label">Shipping ID:</div>
                        <div class="info-value">#{{ str_pad($order->shipping->id, 6, '0', STR_PAD_LEFT) }}</div>
                    </div>
                    @endif
                    @if($order->shipping && $order->shipping->nomor_resi)
                    <div class="info-row">
                        <div class="info-label">Nomor Resi:</div>
                        <div class="info-value">{{ $order->shipping->nomor_resi }}</div>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Order Information -->
            <div class="info-section">
                <div class="info-title">Informasi Pesanan</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Tanggal Pesanan:</div>
                        <div class="info-value">{{ $order->created_at->format('d F Y, H:i') }} WIB</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Status Pesanan:</div>
                        <div class="info-value">
                            <span class="status-badge status-{{ $order->status }}">
                                {{ ucfirst($order->status) }}
                            </span>
                        </div>
                    </div>
                    @if($order->updated_at != $order->created_at)
                    <div class="info-row">
                        <div class="info-label">Terakhir Diperbarui:</div>
                        <div class="info-value">{{ $order->updated_at->format('d F Y, H:i') }} WIB</div>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Customer Information -->
            <div class="info-section">
                <div class="info-title">Informasi Pelanggan</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Nama Pelanggan:</div>
                        <div class="info-value">{{ $order->user->nama_lengkap ?? $order->user->name }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ $order->user->email }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Nama Penerima:</div>
                        <div class="info-value">{{ $order->nama_penerima }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">No. HP Penerima:</div>
                        <div class="info-value">{{ $order->no_hp_penerima ?? '-' }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Alamat Pengiriman:</div>
                        <div class="info-value">{{ $order->alamat }}</div>
                    </div>
                    @if($order->catatan)
                    <div class="info-row">
                        <div class="info-label">Catatan:</div>
                        <div class="info-value">{{ $order->catatan }}</div>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Payment Information -->
            @if($order->payment)
            <div class="info-section">
                <div class="info-title">Informasi Pembayaran</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Metode Pembayaran:</div>
                        <div class="info-value">{{ $order->payment->metode }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Jumlah Pembayaran:</div>
                        <div class="info-value" style="font-weight: 600; color: #2563eb; font-size: 16px;">Rp {{ number_format($order->payment->jumlah_bayar, 0, ',', '.') }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Status Pembayaran:</div>
                        <div class="info-value">
                            @switch($order->payment->status)
                                @case('menunggu_validasi')
                                    <span class="status-badge status-menunggu">Menunggu Validasi</span>
                                    @break
                                @case('valid')
                                    <span class="status-badge status-dibayar">Valid</span>
                                    @break
                                @case('tidak_valid')
                                    <span class="status-badge status-dibatalkan">Tidak Valid</span>
                                    @break
                                @default
                                    <span class="status-badge status-menunggu">{{ ucfirst($order->payment->status) }}</span>
                            @endswitch
                        </div>
                    </div>
                    @if($order->payment->tanggal_bayar)
                    <div class="info-row">
                        <div class="info-label">Tanggal Pembayaran:</div>
                        <div class="info-value">{{ $order->payment->tanggal_bayar->format('d F Y, H:i') }} WIB</div>
                    </div>
                    @endif
                </div>

                @if($order->payment->bukti_pembayaran)
                <div class="payment-proof-section">
                    <div class="payment-proof-title">BUKTI PEMBAYARAN</div>

                    @php
                        $imagePath = public_path('storage/' . $order->payment->bukti_pembayaran);
                        $imageExists = file_exists($imagePath);
                        $imageBase64 = null;
                        $imageMimeType = null;

                        if ($imageExists) {
                            try {
                                $imageData = file_get_contents($imagePath);
                                $imageInfo = getimagesize($imagePath);

                                if ($imageData && $imageInfo && isset($imageInfo['mime'])) {
                                    $imageMimeType = $imageInfo['mime'];
                                    $supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                                    if (in_array($imageMimeType, $supportedTypes)) {
                                        $imageBase64 = 'data:' . $imageMimeType . ';base64,' . base64_encode($imageData);
                                    } else {
                                        $imageExists = false;
                                    }
                                } else {
                                    $imageExists = false;
                                }
                            } catch (Exception $e) {
                                $imageExists = false;
                            }
                        }
                    @endphp

                    @if($imageExists && $imageBase64)
                        <div class="payment-proof-container">
                            <div class="payment-proof-image">
                                <img src="{{ $imageBase64 }}"
                                     alt="Bukti Pembayaran Order #{{ $order->id }}"
                                     class="payment-proof-img">
                            </div>
                            <div class="payment-proof-caption">
                                Bukti pembayaran untuk Order #{{ $order->id }}
                            </div>
                            <div class="payment-proof-meta">
                                {{ basename($order->payment->bukti_pembayaran) }} | {{ $imageMimeType ?? 'Unknown' }} | {{ isset($imageInfo) ? $imageInfo[0] . '×' . $imageInfo[1] : 'Unknown' }}px
                            </div>
                        </div>
                    @else
                        <div class="error-section">
                            <div class="error-title">Bukti Pembayaran Tidak Dapat Ditampilkan</div>

                            @php
                                $fullPath = public_path('storage/' . $order->payment->bukti_pembayaran);
                                $fileExists = file_exists($fullPath);
                                $fileSize = $fileExists ? filesize($fullPath) : 0;
                                $fileExtension = pathinfo($order->payment->bukti_pembayaran, PATHINFO_EXTENSION);
                            @endphp

                            @if(!$fileExists)
                                <p>File tidak ditemukan di server</p>
                            @elseif($fileSize == 0)
                                <p>File kosong (0 bytes)</p>
                            @elseif(!in_array(strtolower($fileExtension), ['jpg', 'jpeg', 'png', 'gif', 'webp']))
                                <p>Format file tidak didukung (.{{ $fileExtension }})</p>
                            @else
                                <p>File tidak dapat diproses</p>
                            @endif

                            <div class="error-details">
                                <strong>File:</strong> {{ basename($order->payment->bukti_pembayaran) }}<br>
                                <strong>Size:</strong> {{ $fileExists ? number_format($fileSize) . ' bytes' : 'N/A' }}<br>
                                <strong>Path:</strong> {{ $order->payment->bukti_pembayaran }}
                            </div>
                        </div>
                    @endif
                </div>
                @endif
            </div>
            @endif

            <!-- Shipping Information -->
            @if($order->shipping)
            <div class="info-section">
                <div class="info-title">Informasi Pengiriman</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Jasa Pengiriman:</div>
                        <div class="info-value">{{ $order->shipping->jasa_kirim ?? '-' }}</div>
                    </div>
                    @if($order->shipping->nomor_resi)
                    <div class="info-row">
                        <div class="info-label">Nomor Resi:</div>
                        <div class="info-value">{{ $order->shipping->nomor_resi }}</div>
                    </div>
                    @endif
                    <div class="info-row">
                        <div class="info-label">Status Pengiriman:</div>
                        <div class="info-value">
                            @switch($order->shipping->status_kirim)
                                @case('belum_dikirim')
                                    <span class="status-badge status-menunggu">Belum Dikirim</span>
                                    @break
                                @case('dikirim')
                                    <span class="status-badge status-dikirim">Dikirim</span>
                                    @break
                                @case('dalam_perjalanan')
                                    <span class="status-badge status-dikirim">Dalam Perjalanan</span>
                                    @break
                                @case('sampai')
                                    <span class="status-badge status-selesai">Sudah Sampai</span>
                                    @break
                                @default
                                    <span class="status-badge status-menunggu">{{ ucfirst($order->shipping->status_kirim) }}</span>
                            @endswitch
                        </div>
                    </div>
                    @if($order->shipping->tanggal_kirim)
                    <div class="info-row">
                        <div class="info-label">Tanggal Pengiriman:</div>
                        <div class="info-value">{{ $order->shipping->tanggal_kirim->format('d F Y, H:i') }} WIB</div>
                    </div>
                    @endif
                </div>
            </div>
            @endif

            <!-- Order Items -->
            <div class="info-section">
                <div class="info-title">Detail Pesanan</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Produk</th>
                            <th>Kategori</th>
                            <th>Brand</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Harga Satuan</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->details as $index => $detail)
                        <tr>
                            <td class="text-center">{{ $index + 1 }}</td>
                            <td>{{ $detail->product->nama_produk }}</td>
                            <td>{{ $detail->product->category->nama_kategori ?? '-' }}</td>
                            <td>{{ $detail->product->brand->nama_brand ?? '-' }}</td>
                            <td class="text-center">{{ $detail->jumlah }}</td>
                            <td class="text-right">Rp {{ number_format($detail->harga_satuan, 0, ',', '.') }}</td>
                            <td class="text-right">Rp {{ number_format($detail->subtotal, 0, ',', '.') }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>

                <div class="total-section">
                    @php
                        $subtotal = $order->details->sum('subtotal');
                        $tax = 0; // No tax for now
                        $shipping_cost = $order->shipping->biaya_kirim ?? 0;
                    @endphp

                    @if($subtotal != $order->total_harga)
                    <div class="subtotal-row">
                        <span>Subtotal:</span>
                        <span>Rp {{ number_format($subtotal, 0, ',', '.') }}</span>
                    </div>
                    @endif

                    @if($shipping_cost > 0)
                    <div class="subtotal-row">
                        <span>Biaya Pengiriman:</span>
                        <span>Rp {{ number_format($shipping_cost, 0, ',', '.') }}</span>
                    </div>
                    @endif

                    <div class="grand-total">
                        <span class="grand-total-label">TOTAL PEMBAYARAN:</span>
                        <span>Rp {{ number_format($order->total_harga, 0, ',', '.') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="footer-content">
                <div class="footer-company">Tepian Teknologi</div>
                <p>Dokumen ini dibuat secara otomatis oleh sistem dan sah sebagai bukti transaksi.</p>
                <p>Untuk pertanyaan lebih lanjut, silakan hubungi customer service kami.</p>

                <div class="footer-note">
                    Simpan dokumen ini sebagai bukti pembayaran yang sah.
                </div>

                <div class="generated-date">
                    Dicetak pada: {{ now()->format('d F Y, H:i') }} WIB
                </div>
            </div>
        </div>
    </div>
</body>
</html>