import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useState } from 'react';

// Helper function to format number as IDR
const formatIDR = (value: string): string => {
    // Remove all non-digits
    const numericValue = value.replace(/\D/g, '');

    // Format with thousand separators
    if (numericValue === '') return '';

    return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
};

// Helper function to parse IDR formatted string to number
const parseIDR = (value: string): string => {
    return value.replace(/\D/g, '');
};
import { ImageCropper } from '@/components/ui/image-cropper';

interface Category {
    id: number;
    nama_kategori: string;
}

interface Brand {
    id: number;
    nama_brand: string;
}

interface Product {
    id: number;
    nama_produk: string;
    deskripsi: string;
    harga: string;
    stok: number;
    gambar: string;
    is_active: boolean;
    is_diskon?: boolean;
    harga_diskon?: string;
    diskon_persen?: number;
    kategori_id: number;
    brand_id: number;
    category: Category;
    brand: Brand;
}

interface Props {
    product: Product;
    categories: Category[];
    brands: Brand[];
}

export default function EditProduct({ product, categories, brands }: Props) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        product.gambar ? `/storage/${product.gambar}` : null
    );
    const [showCropper, setShowCropper] = useState(false);
    const [originalFile, setOriginalFile] = useState<File | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Products',
            href: '/admin/products',
        },
        {
            title: 'Edit',
            href: `/admin/products/${product.id}/edit`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        nama_produk: product.nama_produk,
        deskripsi: product.deskripsi || '',
        harga: parseFloat(product.harga).toString(),
        stok: product.stok.toString(),
        kategori_id: product.kategori_id.toString(),
        brand_id: product.brand_id.toString(),
        gambar: null as File | null,
        is_active: product.is_active,
        is_diskon: product.is_diskon || false,
        discount_type: (product.diskon_persen && product.diskon_persen > 0) ? 'percentage' : 'price',
        harga_diskon: product.harga_diskon ? parseFloat(product.harga_diskon).toString() : '',
        diskon_persen: product.diskon_persen || '',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            setOriginalFile(file);
            setShowCropper(true);
        }
    };

    const handleCropComplete = (croppedFile: File) => {
        setData('gambar', croppedFile);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(croppedFile);

        setShowCropper(false);
        setOriginalFile(null);
    };

    const removeImage = () => {
        setData('gambar', null);
        setImagePreview(product.gambar ? `/storage/${product.gambar}` : null);
        setOriginalFile(null);
        // Reset file input
        const fileInput = document.getElementById('gambar') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Product - ${product.nama_produk}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Product</h1>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <Label htmlFor="nama_produk">Product Name *</Label>
                                <Input
                                    id="nama_produk"
                                    type="text"
                                    value={data.nama_produk}
                                    onChange={(e) => setData('nama_produk', e.target.value)}
                                    placeholder="Enter product name"
                                    className={errors.nama_produk ? 'border-red-500' : ''}
                                />
                                {errors.nama_produk && (
                                    <p className="text-sm text-red-500 mt-1">{errors.nama_produk}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <Label htmlFor="deskripsi">Description</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    placeholder="Enter product description"
                                    rows={4}
                                    className={errors.deskripsi ? 'border-red-500' : ''}
                                />
                                {errors.deskripsi && (
                                    <p className="text-sm text-red-500 mt-1">{errors.deskripsi}</p>
                                )}
                            </div>

                            {/* Category and Brand */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="kategori_id">Category *</Label>
                                    <Select value={data.kategori_id} onValueChange={(value) => setData('kategori_id', value)}>
                                        <SelectTrigger className={errors.kategori_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.nama_kategori}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori_id && (
                                        <p className="text-sm text-red-500 mt-1">{errors.kategori_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="brand_id">Brand *</Label>
                                    <Select value={data.brand_id} onValueChange={(value) => setData('brand_id', value)}>
                                        <SelectTrigger className={errors.brand_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                                    {brand.nama_brand}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.brand_id && (
                                        <p className="text-sm text-red-500 mt-1">{errors.brand_id}</p>
                                    )}
                                </div>
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="harga">Price (IDR) *</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                            Rp
                                        </span>
                                        <Input
                                            id="harga"
                                            type="text"
                                            value={formatIDR(data.harga)}
                                            onChange={(e) => {
                                                const numericValue = parseIDR(e.target.value);
                                                setData('harga', numericValue);
                                            }}
                                            placeholder="0"
                                            className={`pl-8 ${errors.harga ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.harga && (
                                        <p className="text-sm text-red-500 mt-1">{errors.harga}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="stok">Stock *</Label>
                                    <Input
                                        id="stok"
                                        type="number"
                                        min="0"
                                        value={data.stok}
                                        onChange={(e) => setData('stok', e.target.value)}
                                        placeholder="0"
                                        className={errors.stok ? 'border-red-500' : ''}
                                    />
                                    {errors.stok && (
                                        <p className="text-sm text-red-500 mt-1">{errors.stok}</p>
                                    )}
                                </div>
                            </div>

                            {/* Discount Section */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_diskon"
                                        checked={data.is_diskon}
                                        onCheckedChange={(checked) => {
                                            setData('is_diskon', checked);
                                            if (!checked) {
                                                setData('harga_diskon', '');
                                                setData('diskon_persen', '');
                                                setData('discount_type', 'price');
                                            }
                                        }}
                                    />
                                    <Label htmlFor="is_diskon" className="font-medium">Enable Discount</Label>
                                </div>

                                {data.is_diskon && (
                                    <div className="space-y-4">
                                        {/* Discount Type Selection */}
                                        <div>
                                            <Label className="font-medium">Discount Method</Label>
                                            <div className="flex space-x-4 mt-2">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="discount_price"
                                                        name="discount_type"
                                                        value="price"
                                                        checked={data.discount_type === 'price'}
                                                        onChange={(e) => {
                                                            setData('discount_type', e.target.value as 'price' | 'percentage');
                                                            setData('diskon_persen', '');
                                                        }}
                                                    />
                                                    <Label htmlFor="discount_price">Manual Discount Price</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="discount_percentage"
                                                        name="discount_type"
                                                        value="percentage"
                                                        checked={data.discount_type === 'percentage'}
                                                        onChange={(e) => {
                                                            setData('discount_type', e.target.value as 'price' | 'percentage');
                                                            setData('harga_diskon', '');
                                                        }}
                                                    />
                                                    <Label htmlFor="discount_percentage">Percentage Discount</Label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Discount Input Fields */}
                                        {data.discount_type === 'price' ? (
                                            <div>
                                                <Label htmlFor="harga_diskon">Discount Price (IDR) *</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                                        Rp
                                                    </span>
                                                    <Input
                                                        id="harga_diskon"
                                                        type="text"
                                                        value={formatIDR(data.harga_diskon)}
                                                        onChange={(e) => {
                                                            const numericValue = parseIDR(e.target.value);
                                                            setData('harga_diskon', numericValue);
                                                        }}
                                                        placeholder="0"
                                                        className={`pl-8 ${errors.harga_diskon ? 'border-red-500' : ''}`}
                                                    />
                                                </div>
                                                {errors.harga_diskon && (
                                                    <p className="text-sm text-red-500 mt-1">{errors.harga_diskon}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Enter the final discounted price (must be less than original price)
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <Label htmlFor="diskon_persen">Discount Percentage *</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="diskon_persen"
                                                        type="number"
                                                        min="1"
                                                        max="99"
                                                        value={data.diskon_persen}
                                                        onChange={(e) => setData('diskon_persen', e.target.value)}
                                                        placeholder="0"
                                                        className={`pr-8 ${errors.diskon_persen ? 'border-red-500' : ''}`}
                                                    />
                                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                                        %
                                                    </span>
                                                </div>
                                                {errors.diskon_persen && (
                                                    <p className="text-sm text-red-500 mt-1">{errors.diskon_persen}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Enter discount percentage (1-99%). The discounted price will be calculated automatically.
                                                </p>
                                                {data.diskon_persen && data.harga && (
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        Discounted price: Rp {formatIDR((parseFloat(data.harga) * (100 - parseFloat(data.diskon_persen)) / 100).toString())}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <Label htmlFor="gambar">Product Image</Label>
                                <div className="mt-2">
                                    {imagePreview ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-lg border"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                onClick={removeImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-2">
                                                <Label htmlFor="gambar" className="cursor-pointer">
                                                    <span className="text-blue-600 hover:text-blue-500">Upload an image</span>
                                                    <span className="text-gray-500"> or drag and drop</span>
                                                </Label>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG, GIF, WebP up to 5MB
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Images will be cropped to 1:1 ratio and converted to WebP
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <Input
                                        id="gambar"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    {errors.gambar && (
                                        <p className="text-sm text-red-500 mt-1">{errors.gambar}</p>
                                    )}
                                </div>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">Active Product</Label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Product'}
                                </Button>
                                <Link href="/admin/products">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Image Cropper Modal */}
            <ImageCropper
                isOpen={showCropper}
                onClose={() => {
                    setShowCropper(false);
                    setOriginalFile(null);
                }}
                onCropComplete={handleCropComplete}
                originalFile={originalFile}
            />
        </AppLayout>
    );
}
