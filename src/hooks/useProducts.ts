import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/pos';
import { toast } from 'sonner';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      const mappedProducts: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        cost: Number(p.cost),
        category: p.category,
        stock: p.stock,
        barcode: p.barcode || undefined,
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Товарларды жүктөөдө ката кетти');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add product
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          price: product.price,
          cost: product.cost,
          category: product.category,
          stock: product.stock,
          barcode: product.barcode || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        cost: Number(data.cost),
        category: data.category,
        stock: data.stock,
        barcode: data.barcode || undefined,
      };

      setProducts((prev) => [...prev, newProduct]);
      toast.success('Товар кошулду!');
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Товар кошууда ката кетти');
      throw error;
    }
  };

  // Edit product
  const editProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          price: product.price,
          cost: product.cost,
          category: product.category,
          stock: product.stock,
          barcode: product.barcode || null,
        })
        .eq('id', product.id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      toast.success('Товар жаңыртылды!');
    } catch (error) {
      console.error('Error editing product:', error);
      toast.error('Товар жаңыртууда ката кетти');
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Товар өчүрүлдү!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Товар өчүрүүдө ката кетти');
      throw error;
    }
  };

  return {
    products,
    loading,
    addProduct,
    editProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}
