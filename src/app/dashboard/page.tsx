'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, LogOut, Package, DollarSign, TrendingUp, Users, ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';
import ProductDialog from '@/components/ProductDialog';
import { Product } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('Dashboard useEffect - loading:', loading, 'user:', user);
    if (loading) return; // Várjuk meg, amíg betölt!
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }
    console.log('User found, fetching products');
    fetchProducts();
  }, [user, loading, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products-live');
      if (response.ok) {
        const data = await response.json();
        // Map MySQL fields to dashboard product fields
        const mapped = data.map((item: any) => ({
          id: item.id?.toString() ?? '',
          name: item.name ?? '',
          description: item.description ?? '',
          price: item.price ?? 0,
          category: item.main_category_name || 'Egyéb',
          subcategory: item.main_subcategory_name || '',
          stock: 1, // Ha nincs készlet mező, 1-nek vesszük
          imageUrl: Array.isArray(item.images) ? (item.images[0] ? `/images/${item.images[0]}` : '') : (item.main_image ? `/images/${item.main_image}` : ''),
          createdAt: item.created_at ?? '',
          updatedAt: item.modified_at ?? '',
          is_active: item.is_active ?? true, // Add is_active field
          is_enabled: item.is_enabled ?? true, // Add is_enabled field
          parent_id: item.parent_id ?? 0, // Add parent_id field
        }));
        setProducts(mapped);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError('An error occurred while fetching products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      setError('An error occurred while deleting the product');
    }
  };

  const handleProductSaved = (product: Product) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      setProducts([...products, product]);
    }
    setIsDialogOpen(false);
  };

  const handleToggleActive = async (productId: string, current: boolean) => {
    try {
      const response = await fetch(`/api/products-live/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !current }),
      });
      if (response.ok) {
        setProducts(products => products.map(p => p.id === productId ? { ...p, is_active: !current } : p));
      } else {
        setError('Failed to update status');
      }
    } catch (error) {
      setError('An error occurred while updating status');
    }
  };

  const handleToggleEnabled = async (productId: string, current: boolean) => {
    try {
      const response = await fetch(`/api/products-live/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: !current }),
      });
      if (response.ok) {
        setProducts(products => products.map(p => p.id === productId ? { ...p, is_enabled: !current } : p));
      } else {
        setError('Failed to update enabled status');
      }
    } catch (error) {
      setError('An error occurred while updating enabled status');
    }
  };

  // Calculate totals only for current (latest) versions
  const currentProducts = buildProductTree(products);
  const totalValue = currentProducts.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalProducts = currentProducts.length;
  const lowStockProducts = currentProducts.filter(p => p.stock < 10).length;
  const totalCategories = new Set(currentProducts.map(p => p.category)).size;

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      const term = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      if (sortBy === 'price') cmp = a.price - b.price;
      if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  // Group products by parent_id
  const groupedProducts = filteredProducts.reduce((acc: Record<string, any>, product) => {
    if (product.parent_id === 0) {
      acc[product.id] = { ...product, children: [] };
    } else if (product.parent_id && acc[product.parent_id]) {
      acc[product.parent_id].children.push(product);
    } else {
      // orphaned copy, treat as main
      acc[product.id] = { ...product, children: [] };
    }
    return acc;
  }, {});
  const mainProducts = Object.values(groupedProducts);

  // Helper: build tree from flat product list (robust for any order)
  function buildProductTree(products: any[]): any[] {
    const map = new Map<string, any>();
    products.forEach((p) => {
      map.set(`${p.id}`, { ...p, children: [] });
    });
    products.forEach((p) => {
      const pid = `${p.parent_id}`;
      const id = `${p.id}`;
      if (p.parent_id && p.parent_id !== 0 && map.has(pid)) {
        map.get(pid).children.push(map.get(id));
      }
    });
    // Only root nodes (parent_id = 0)
    const roots = products.filter((p) => p.parent_id === 0).map((p) => map.get(`${p.id}`));
    
    // For each root, if it has children, replace it with the latest version and add main product to children
    return roots.map((root) => {
      if (root.children && root.children.length > 0) {
        // Sort children by id (assuming higher id = newer version)
        root.children.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
        const latestVersion = root.children[0];
        // Add main product to children (at the end)
        root.children.push({ ...root, isMainProduct: true });
        // Return the latest version as the main display
        return { ...latestVersion, children: root.children, originalMain: root };
      }
      return root;
    });
  }

  const productTree = buildProductTree(filteredProducts);

  // Helper to format SQL datetime to 'YYYY.MM.DD HH:mm'
  function formatDateTime(dt?: string) {
    if (!dt || dt === '0000-00-00 00:00:00') return '';
    const d = new Date(dt.replace(' ', 'T'));
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Recursive row renderer
  function renderProductRow(product: any, level = 0, isLastSibling = false) {
    const isVersion = level > 0;
    const isMainProduct = product.isMainProduct;
    // Show Edit and Delete buttons for all products (simplified logic)
    const showActions = true;
    const hasChildren = product.children && product.children.length > 0;
    const isAccordionOpen = openAccordions[product.id];
    const handleAccordionToggle = () => {
      setOpenAccordions((prev) => ({ ...prev, [product.id]: !prev[product.id] }));
    };
    return (
      <>
        <TableRow key={product.id} className={isVersion ? 'bg-blue-50' : 'bg-white'}>
          <TableCell onClick={!isVersion && hasChildren ? handleAccordionToggle : undefined} style={{ cursor: !isVersion && hasChildren ? 'pointer' : 'default' }}>
            <div className={`flex items-center ${isVersion ? `pl-${level * 6} border-l-4 border-blue-300` : ''}`}>
              {!isVersion && hasChildren && (
                <span className="mr-1">
                  {isAccordionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`rounded-lg object-cover mr-2 ${isVersion ? 'w-7 h-7' : 'w-10 h-10'}`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className={isVersion ? 'font-medium text-blue-700 text-sm' : 'font-bold text-gray-900 text-base'}>{product.name}</p>
                  {isVersion && !isMainProduct && <Badge variant="outline" className="text-xs border-blue-400 text-blue-700">Verzió</Badge>}
                  {!isVersion && <Badge variant="default" className="text-xs bg-blue-600 text-white">Aktuális</Badge>}
                  {isMainProduct && <Badge variant="secondary" className="text-xs bg-gray-500 text-white">Főtermék</Badge>}
                </div>
                <p className={`truncate max-w-xs ${isVersion ? 'text-xs text-blue-600' : 'text-sm text-gray-500'}`}>{product.description}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex flex-col gap-1">
              <Badge variant={isVersion ? 'secondary' : 'default'}>{product.category}</Badge>
              {product.subcategory && (
                <Badge variant="outline" className="text-xs">{product.subcategory}</Badge>
              )}
            </div>
          </TableCell>
          <TableCell className={isVersion ? 'font-normal text-blue-700' : 'font-medium'}>{product.price.toLocaleString()} Ft</TableCell>
          <TableCell className={isVersion ? 'text-blue-600' : ''}>{product.stock}</TableCell>
          <TableCell>
            <div className="flex flex-col gap-1">
              {product.createdAt && product.createdAt !== '0000-00-00 00:00:00' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-gray-400 cursor-help">
                        {formatDateTime(product.createdAt)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Létrehozás dátuma</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {product.updatedAt && product.updatedAt !== '0000-00-00 00:00:00' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-gray-400 cursor-help">
                        {formatDateTime(product.updatedAt)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Módosítás dátuma</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Switch
                checked={!!product.is_active}
                onCheckedChange={() => handleToggleActive(product.id, !!product.is_active)}
              />
              <Switch
                checked={!!product.is_enabled}
                onCheckedChange={() => handleToggleEnabled(product.id, !!product.is_enabled)}
              />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditProduct(product)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {hasChildren && (!isVersion && isAccordionOpen) && product.children.map((child: any, i: number, arr: any[]) => renderProductRow(child, level + 1, i === arr.length - 1))}
      </>
    );
  }

  if (productsLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
                             <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{totalValue.toLocaleString()} Ft</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCategories}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search bar */}
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </div>
              <Button onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => {
                      setSortBy('name');
                      setSortDir(sortBy === 'name' && sortDir === 'asc' ? 'desc' : 'asc');
                    }}>
                      Product
                      <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => {
                      setSortBy('category');
                      setSortDir(sortBy === 'category' && sortDir === 'asc' ? 'desc' : 'asc');
                    }}>
                      Category
                      <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" />
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => {
                      setSortBy('price');
                      setSortDir(sortBy === 'price' && sortDir === 'asc' ? 'desc' : 'asc');
                    }}>
                      Price
                      <ArrowUpDown className="inline w-4 h-4 ml-1 align-text-bottom" />
                    </TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTree.map((product: any, i: number, arr: any[]) => renderProductRow(product, 0, i === arr.length - 1))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct}
        onSave={handleProductSaved}
      />
    </div>
  );
} 