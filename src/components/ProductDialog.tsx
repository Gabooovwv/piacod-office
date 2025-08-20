'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, categories } from '@/lib/mock-data';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => void;
}

export default function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: number; name: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  useEffect(() => {
    if (product && categories.length > 0) {
      // Find the category ID for the product's category name
      const selectedCategory = categories.find(cat => cat.name === product.category);
      const categoryId = selectedCategory ? selectedCategory.id.toString() : '';
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: categoryId, // Store the ID for the select
        subcategory: product.subcategory || '',
        stock: product.stock.toString(),
        imageUrl: product.imageUrl
      });
      
      // Load subcategories for existing product
      if (selectedCategory) {
        fetchSubcategories(selectedCategory.id.toString());
      }
    } else if (!product) {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        stock: '',
        imageUrl: ''
      });
      setSubcategories([]);
    }
    setError('');
  }, [product, open, categories]);

  // Fetch categories from MySQL
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetch('/api/categories-live');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    setSubcategoriesLoading(true);
    try {
      console.log('Fetching subcategories for categoryId:', categoryId);
      const res = await fetch(`/api/subcategories-live?categoryId=${categoryId}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Subcategories received:', data);
        setSubcategories(data);
      } else {
        console.log('Failed to fetch subcategories');
        setSubcategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: (() => {
            const selectedCategory = categories.find(cat => cat.id.toString() === formData.category);
            return selectedCategory ? selectedCategory.name : formData.category;
          })(),
          subcategory: formData.subcategory,
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl
        }),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        onSave(savedProduct);
        onOpenChange(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save product');
      }
    } catch (error) {
      setError('An error occurred while saving the product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // If category changes, fetch subcategories and reset subcategory
    if (field === 'category') {
      console.log('Category changed to:', value);
      const selectedCategory = categories.find(cat => cat.id.toString() === value);
      console.log('Selected category:', selectedCategory);
      if (selectedCategory) {
        fetchSubcategories(selectedCategory.id.toString());
        setFormData(prev => ({
          ...prev,
          [field]: value,
          subcategory: '' // Reset subcategory when category changes
        }));
      } else {
        setSubcategories([]);
        setFormData(prev => ({
          ...prev,
          [field]: value,
          subcategory: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product ? 'Update the product information below.' : 'Fill in the product information below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) => handleInputChange('category', value)}
                required
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={categoriesLoading ? 'Loading...' : 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

                     <div className="grid grid-cols-10 gap-4">
             <div className="col-span-7 space-y-2">
               <Label htmlFor="subcategory">Subcategory</Label>
               <Select
                 value={formData.subcategory}
                 onValueChange={(value: string) => handleInputChange('subcategory', value)}
                 disabled={subcategoriesLoading || !formData.category || subcategories.length === 0}
               >
                 <SelectTrigger>
                   <SelectValue placeholder={
                     !formData.category ? 'Select category first' :
                     subcategoriesLoading ? 'Loading...' :
                     subcategories.length === 0 ? 'No subcategories' :
                     'Select subcategory'
                   } />
                 </SelectTrigger>
                 <SelectContent>
                   {subcategories.map((subcat) => (
                     <SelectItem key={subcat.id} value={subcat.name}>
                       {subcat.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="col-span-3 space-y-2">
               <Label htmlFor="stock">Stock *</Label>
               <Input
                 id="stock"
                 type="number"
                 min="0"
                 value={formData.stock}
                 onChange={(e) => handleInputChange('stock', e.target.value)}
                 placeholder="0"
                 required
               />
             </div>
           </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
                          <Textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={3}
                required
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500">
              Leave empty to use a default image
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 