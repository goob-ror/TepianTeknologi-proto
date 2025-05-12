import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/admin-app-layout';
import { PlusCircle, Trash2, Pencil, Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import { type BreadcrumbItem } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id: number;
  nama_produk: string;
  brand_produk: string;
  nama_kategori: string;
  harga_produk: string;
  stock_produk: number;
  created_at?: string;
  updated_at?: string;
}

interface Kategori {
  id: number;
  jenis_kategori: string;
  deskripsi?: string;
}

interface SortConfig {
  key: keyof Product | null;
  direction: 'asc' | 'desc';
}

interface FilterState {
  search: string;
  brand: string;
  kategori: string;
  minStock: string;
  maxStock: string;
  minPrice: string;
  maxPrice: string;
}

const initialFilters: FilterState = {
  search: '',
  brand: '',
  kategori: '',
  minStock: '',
  maxStock: '',
  minPrice: '',
  maxPrice: '',
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
  },
  {
    title: 'Products',
    href: '/admin/products',
  },
];

interface Props {
  products: Product[];
  kategoris: Kategori[];
}

const ProductIndex = ({ products: initialProducts, kategoris  }: Props) => {
  // We don't need setProducts anymore since we're using the router for API calls
  const [products] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Unique brands for filter dropdown
  const uniqueBrands = Array.from(new Set(products.map(product => product.brand_produk)));

  // We already have the kategoris from the backend, no need to extract them from products

  // Handle sorting
  const requestSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorting indicator
  const getSortIndicator = (key: keyof Product) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(product =>
        product.nama_produk.toLowerCase().includes(searchLower) ||
        product.brand_produk.toLowerCase().includes(searchLower)
      );
    }

    // Apply brand filter
    if (filters.brand) {
      result = result.filter(product => product.brand_produk === filters.brand);
    }

    // Apply category filter
    if (filters.kategori) {
      result = result.filter(product => product.nama_kategori === filters.kategori);
    }

    // Apply stock filters
    if (filters.minStock) {
      result = result.filter(product => product.stock_produk >= parseInt(filters.minStock));
    }
    if (filters.maxStock) {
      result = result.filter(product => product.stock_produk <= parseInt(filters.maxStock));
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(product => parseInt(product.harga_produk) >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(product => parseInt(product.harga_produk) <= parseInt(filters.maxPrice));
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valueA = a[sortConfig.key as keyof Product];
        const valueB = b[sortConfig.key as keyof Product];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortConfig.direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          // Handle numeric values
          const numA = typeof valueA === 'number' ? valueA : Number(valueA);
          const numB = typeof valueB === 'number' ? valueB : Number(valueB);
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        }
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, sortConfig, products]);

  // Calculate paginated products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Delete handler with confirmation
  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the API endpoint to delete the product
        router.delete(`/admin/products/${id}`, {
          onSuccess: () => {
            // Show success message
            Swal.fire(
              'Deleted!',
              'Product has been deleted.',
              'success'
            );
          },
          onError: () => {
            // Show error message
            Swal.fire(
              'Error!',
              'There was a problem deleting the product.',
              'error'
            );
          }
        });
      }
    });
  };

  // Stock status renderer with color coding
  const renderStockStatus = (stock: number) => {
    if (stock <= 0) {
      return <span className="px-2 py-1 rounded bg-destructive/10 text-destructive">Out of stock</span>;
    } else if (stock < 10) {
      return <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">Low stock ({stock})</span>;
    } else {
      return <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">In stock ({stock})</span>;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Products" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Button asChild>
            <Link href="/admin/products/add">
              <PlusCircle className="w-5 h-5" /> Add Product
            </Link>
          </Button>
        </div>

        {/* Search and filter bar */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardContent>

          {/* Advanced filters */}
          {showFilters && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Brand</label>
                  <select
                    name="brand"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    className="w-full rounded border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    <option value="">All Brands</option>
                    {uniqueBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select
                    name="kategori"
                    value={filters.kategori}
                    onChange={handleFilterChange}
                    className="w-full rounded border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    <option value="">All Categories</option>
                    {kategoris.map(kategori => (
                      <option key={kategori.id} value={kategori.jenis_kategori}>{kategori.jenis_kategori}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Range</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="minStock"
                      value={filters.minStock}
                      onChange={handleFilterChange}
                      placeholder="Min"
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      name="maxStock"
                      value={filters.maxStock}
                      onChange={handleFilterChange}
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range (Rp)</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Results summary */}
        <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
          <div>
            Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div>
            {Object.values(filters).some(val => val !== '') && (
              <Button
                onClick={resetFilters}
                variant="link"
                size="sm"
                className="h-auto p-0"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Products table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('nama_produk')}
                  >
                    <div className="flex items-center gap-1">
                      Product Name {getSortIndicator('nama_produk')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('brand_produk')}
                  >
                    <div className="flex items-center gap-1">
                      Brand {getSortIndicator('brand_produk')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('nama_kategori')}
                  >
                    <div className="flex items-center gap-1">
                      Kategori {getSortIndicator('nama_kategori')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('harga_produk')}
                  >
                    <div className="flex items-center gap-1">
                      Price {getSortIndicator('harga_produk')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('stock_produk')}
                  >
                    <div className="flex items-center gap-1">
                      Stock {getSortIndicator('stock_produk')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{product.nama_produk}</div>
                        <div className="text-xs text-muted-foreground">ID: #{product.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{product.brand_produk}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{product.nama_kategori}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">Rp {parseInt(product.harga_produk).toLocaleString('id-ID')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStockStatus(product.stock_produk)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-primary"
                          >
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center gap-1"
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No products found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-border">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of{' '}
                    <span className="font-medium">{filteredProducts.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="rounded-l-md rounded-r-none"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="rounded-none"
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="rounded-r-md rounded-l-none"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 -rotate-90" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProductIndex;