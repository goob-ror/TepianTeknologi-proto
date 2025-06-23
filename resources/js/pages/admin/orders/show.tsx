import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, User, Package, CreditCard, Truck, Clock, CheckCircle, XCircle, Upload, FileText, Eye } from 'lucide-react';

interface OrderDetail {
    id: number;
    produk_id: number;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
    product: {
        id: number;
        nama_produk: string;
        gambar_produk?: string;
        category?: {
            nama_kategori: string;
        };
        brand?: {
            nama_brand: string;
        };
    };
}

interface Order {
    id: number;
    user: {
        id: number;
        nama_lengkap?: string;
        name?: string;
        email: string;
    };
    nama_penerima: string;
    alamat: string;
    no_hp_penerima?: string;
    catatan?: string;
    status: 'menunggu' | 'dibayar' | 'dikirim' | 'selesai' | 'dibatalkan';
    total_harga: number;
    created_at: string;
    updated_at: string;
    details: OrderDetail[];
    payment?: {
        id: number;
        metode: string;
        bukti_pembayaran?: string;
        status: string;
        jumlah_bayar: number;
        tanggal_bayar?: string;
        validated_at?: string;
        catatan_validasi?: string;
    };
    shipping?: {
        id: number;
        nomor_resi?: string;
        jasa_kirim?: string;
        status_kirim: string;
        tanggal_kirim?: string;
        tanggal_sampai?: string;
    };
}

interface Props {
    order: Order;
}

const statusConfig = {
    menunggu: { label: 'Pending', color: 'border-yellow-500 text-yellow-300 bg-yellow-500/10', icon: Clock },
    dibayar: { label: 'Paid', color: 'border-blue-500 text-blue-300 bg-blue-500/10', icon: CheckCircle },
    dikirim: { label: 'Shipped', color: 'border-purple-500 text-purple-300 bg-purple-500/10', icon: Truck },
    selesai: { label: 'Completed', color: 'border-green-500 text-green-300 bg-green-500/10', icon: Package },
    dibatalkan: { label: 'Cancelled', color: 'border-red-500 text-red-300 bg-red-500/10', icon: XCircle },
};

export default function ShowOrder({ order }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Orders',
            href: '/admin/orders',
        },
        {
            title: `Order #${order.id}`,
            href: `/admin/orders/${order.id}`,
        },
    ];

    const { data, setData, patch, processing } = useForm({
        status: order.status,
        catatan: '',
        shipping_info: {
            nomor_resi: order.shipping?.nomor_resi || '',
            jasa_kirim: order.shipping?.jasa_kirim || '',
        },
    });

    // Payment proof upload form
    const { data: paymentData, setData: setPaymentData, post: postPayment, processing: paymentProcessing, errors: paymentErrors } = useForm({
        bukti_pembayaran: null as File | null,
        metode: order.payment?.metode || 'WhatsApp Transfer',
        jumlah_bayar: order.total_harga,
        catatan_validasi: '',
    });

    // Payment validation form
    const { data: validationData, setData: setValidationData, patch: patchValidation, processing: validationProcessing } = useForm({
        status: order.payment?.status || 'menunggu_validasi',
        catatan_validasi: order.payment?.catatan_validasi || '',
    });

    const handleUpdateStatus = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/orders/${order.id}/status`);
    };

    const handleUploadPaymentProof = (e: React.FormEvent) => {
        e.preventDefault();
        postPayment(`/admin/orders/${order.id}/upload-payment-proof`, {
            forceFormData: true,
        });
    };

    const handleValidatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        patchValidation(`/admin/orders/${order.id}/validate-payment`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setPaymentData('bukti_pembayaran', file);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const StatusIcon = statusConfig[order.status].icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Order Details</h1>
                        <p className="text-gray-400">Order #{order.id}</p>
                    </div>
                    <Link href="/admin/orders">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-blue-300 flex items-center gap-2">
                                    <StatusIcon className="h-5 w-5" />
                                    Order Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 mb-4">
                                    <Badge variant="outline" className={`${statusConfig[order.status].color} px-4 py-2`}>
                                        <StatusIcon className="h-4 w-4 mr-2" />
                                        {statusConfig[order.status].label}
                                    </Badge>
                                    <div className="text-sm text-gray-400">
                                        Last updated: {new Date(order.updated_at).toLocaleString('id-ID')}
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateStatus} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="status">Update Status</Label>
                                            <Select value={data.status} onValueChange={(value) => setData('status', value as 'menunggu' | 'dibayar' | 'dikirim' | 'selesai' | 'dibatalkan')}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="menunggu">Pending</SelectItem>
                                                    <SelectItem value="dibayar">Paid</SelectItem>
                                                    <SelectItem value="dikirim">Shipped</SelectItem>
                                                    <SelectItem value="selesai">Completed</SelectItem>
                                                    <SelectItem value="dibatalkan">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {data.status === 'dikirim' && (
                                            <>
                                                <div>
                                                    <Label htmlFor="jasa_kirim">Shipping Service</Label>
                                                    <Input
                                                        id="jasa_kirim"
                                                        value={data.shipping_info.jasa_kirim}
                                                        onChange={(e) => setData('shipping_info', {
                                                            ...data.shipping_info,
                                                            jasa_kirim: e.target.value
                                                        })}
                                                        placeholder="e.g., JNE, J&T, SiCepat"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label htmlFor="nomor_resi">Tracking Number</Label>
                                                    <Input
                                                        id="nomor_resi"
                                                        value={data.shipping_info.nomor_resi}
                                                        onChange={(e) => setData('shipping_info', {
                                                            ...data.shipping_info,
                                                            nomor_resi: e.target.value
                                                        })}
                                                        placeholder="Enter tracking number"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="catatan">Notes (Optional)</Label>
                                        <Textarea
                                            id="catatan"
                                            value={data.catatan}
                                            onChange={(e) => setData('catatan', e.target.value)}
                                            placeholder="Add notes about status update..."
                                            rows={3}
                                        />
                                    </div>

                                    <Button type="submit" disabled={processing} className="admin-bg-blue">
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update Status'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-300 flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items ({order.details.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.details.map((detail) => (
                                        <div key={detail.id} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                                            <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                                                {detail.product.gambar_produk ? (
                                                    <img
                                                        src={`/storage/${detail.product.gambar_produk}`}
                                                        alt={detail.product.nama_produk}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <Package className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{detail.product.nama_produk}</h4>
                                                <div className="text-sm text-gray-400 space-y-1">
                                                    {detail.product.category && (
                                                        <p>Category: {detail.product.category.nama_kategori}</p>
                                                    )}
                                                    {detail.product.brand && (
                                                        <p>Brand: {detail.product.brand.nama_brand}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(detail.harga_satuan)} × {detail.jumlah}</p>
                                                <p className="text-lg font-bold text-green-400">{formatCurrency(detail.subtotal)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span>Total Order:</span>
                                        <span className="text-green-400">{formatCurrency(order.total_harga)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-purple-300 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-400">Customer</label>
                                    <p className="font-medium">{order.user.nama_lengkap || order.user.name}</p>
                                    <p className="text-sm text-gray-400">{order.user.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-400">Recipient</label>
                                    <p className="font-medium">{order.nama_penerima}</p>
                                </div>
                                {order.no_hp_penerima && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Phone</label>
                                        <p className="font-medium">{order.no_hp_penerima}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-400">Delivery Address</label>
                                    <p className="font-medium">{order.alamat}</p>
                                </div>
                                {order.catatan && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Notes</label>
                                        <p className="font-medium">{order.catatan}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-yellow-300 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {order.payment ? (
                                    <>
                                        {/* Existing Payment Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-400">Payment Method</label>
                                                <p className="font-medium">{order.payment.metode}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-400">Amount Paid</label>
                                                <p className="font-medium">{formatCurrency(order.payment.jumlah_bayar)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-400">Payment Status</label>
                                                <p className="font-medium">{order.payment.status}</p>
                                            </div>
                                            {order.payment.tanggal_bayar && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-400">Payment Date</label>
                                                    <p className="font-medium">
                                                        {new Date(order.payment.tanggal_bayar).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Payment Proof Display */}
                                        {order.payment.bukti_pembayaran && (
                                            <div className="border-t pt-4">
                                                <label className="text-sm font-medium text-gray-400 mb-2 block">Bukti Pembayaran</label>
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={`/storage/${order.payment.bukti_pembayaran}`}
                                                        alt="Bukti Pembayaran"
                                                        className="w-32 h-32 object-cover rounded-lg border"
                                                    />
                                                    <div className="flex flex-col gap-2">
                                                        <a
                                                            href={`/storage/${order.payment.bukti_pembayaran}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View Full Image
                                                        </a>
                                                        <a
                                                            href={`/admin/orders/${order.id}/transaction-proof`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-green-400 hover:text-green-300"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            Download Transaction Proof
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Payment Validation */}
                                        {order.payment.status === 'menunggu_validasi' && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-medium mb-3">Validate Payment</h4>
                                                <form onSubmit={handleValidatePayment} className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="validation_status">Validation Status</Label>
                                                        <Select
                                                            value={validationData.status}
                                                            onValueChange={(value) => setValidationData('status', value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select validation status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="valid">Valid</SelectItem>
                                                                <SelectItem value="tidak_valid">Invalid</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="validation_notes">Validation Notes</Label>
                                                        <Textarea
                                                            id="validation_notes"
                                                            value={validationData.catatan_validasi}
                                                            onChange={(e) => setValidationData('catatan_validasi', e.target.value)}
                                                            placeholder="Add validation notes..."
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <Button type="submit" disabled={validationProcessing}>
                                                        {validationProcessing ? 'Validating...' : 'Validate Payment'}
                                                    </Button>
                                                </form>
                                            </div>
                                        )}

                                        {/* Validation Info */}
                                        {order.payment.validated_at && (
                                            <div className="border-t pt-4">
                                                <label className="text-sm font-medium text-gray-400">Validated At</label>
                                                <p className="font-medium">
                                                    {new Date(order.payment.validated_at).toLocaleString('id-ID')}
                                                </p>
                                                {order.payment.catatan_validasi && (
                                                    <div className="mt-2">
                                                        <label className="text-sm font-medium text-gray-400">Validation Notes</label>
                                                        <p className="font-medium">{order.payment.catatan_validasi}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Upload Payment Proof Form */}
                                        <div>
                                            <h4 className="font-medium mb-3">Upload Payment Proof</h4>
                                            <form onSubmit={handleUploadPaymentProof} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="payment_method">Payment Method</Label>
                                                    <Input
                                                        id="payment_method"
                                                        value={paymentData.metode}
                                                        onChange={(e) => setPaymentData('metode', e.target.value)}
                                                        placeholder="e.g., WhatsApp Transfer, Bank Transfer"
                                                    />
                                                    {paymentErrors.metode && (
                                                        <p className="text-red-400 text-sm mt-1">{paymentErrors.metode}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="payment_amount">Payment Amount</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Rp</span>
                                                        <Input
                                                            id="payment_amount"
                                                            type="text"
                                                            value={paymentData.jumlah_bayar.toLocaleString('id-ID')}
                                                            readOnly
                                                            className="pl-8 bg-gray-100 cursor-not-allowed"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Amount: {formatCurrency(paymentData.jumlah_bayar)}
                                                    </p>
                                                    {paymentErrors.jumlah_bayar && (
                                                        <p className="text-red-400 text-sm mt-1">{paymentErrors.jumlah_bayar}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="payment_proof">Payment Proof Image</Label>
                                                    <div className="relative">
                                                        <input
                                                            id="payment_proof"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        />
                                                        <div className="flex items-center">
                                                            <button
                                                                type="button"
                                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                            >
                                                                Choose File
                                                            </button>
                                                            <span className="ml-3 text-gray-400 text-sm">
                                                                {paymentData.bukti_pembayaran ? paymentData.bukti_pembayaran.name : 'No file chosen'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {paymentErrors.bukti_pembayaran && (
                                                        <p className="text-red-400 text-sm mt-1">{paymentErrors.bukti_pembayaran}</p>
                                                    )}
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        Upload screenshot of payment proof (max 5MB)
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label htmlFor="payment_notes">Notes</Label>
                                                    <Textarea
                                                        id="payment_notes"
                                                        value={paymentData.catatan_validasi}
                                                        onChange={(e) => setPaymentData('catatan_validasi', e.target.value)}
                                                        placeholder="Add any notes about the payment..."
                                                        rows={3}
                                                    />
                                                </div>
                                                <Button type="submit" disabled={paymentProcessing} className="flex items-center gap-2">
                                                    <Upload className="h-4 w-4" />
                                                    {paymentProcessing ? 'Uploading...' : 'Upload Payment Proof'}
                                                </Button>
                                            </form>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Shipping Information */}
                        {order.shipping && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-cyan-300 flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Shipping Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {order.shipping.jasa_kirim && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-400">Shipping Service</label>
                                            <p className="font-medium">{order.shipping.jasa_kirim}</p>
                                        </div>
                                    )}
                                    {order.shipping.nomor_resi && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-400">Tracking Number</label>
                                            <p className="font-medium">{order.shipping.nomor_resi}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Shipping Status</label>
                                        <p className="font-medium">{order.shipping.status_kirim}</p>
                                    </div>
                                    {order.shipping.tanggal_kirim && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-400">Ship Date</label>
                                            <p className="font-medium">
                                                {new Date(order.shipping.tanggal_kirim).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Order Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-orange-300">Order Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium">Order Created</p>
                                        <p className="text-sm text-gray-400">
                                            {new Date(order.created_at).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                                {order.payment?.tanggal_bayar && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium">Payment Received</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(order.payment.tanggal_bayar).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {order.shipping?.tanggal_kirim && (
                                    <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium">Order Shipped</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(order.shipping.tanggal_kirim).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
