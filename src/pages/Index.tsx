import { useState, useMemo } from 'react';
import { Product, CartItem } from '@/types/pos';
import { categories } from '@/data/sampleProducts';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/pos/Header';
import SearchBar from '@/components/pos/SearchBar';
import CategoryTabs from '@/components/pos/CategoryTabs';
import ProductCard from '@/components/pos/ProductCard';
import CartPanel from '@/components/pos/CartPanel';
import SalesStats from '@/components/pos/SalesStats';
import PaymentModal from '@/components/pos/PaymentModal';
import ProductsView from '@/components/pos/ProductsView';
import ReportsView from '@/components/pos/ReportsView';
import DebtsView from '@/components/pos/DebtsView';
import PinLock from '@/components/pos/PinLock';
import { toast } from 'sonner';

const Index = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentView, setCurrentView] = useState<'pos' | 'reports' | 'products' | 'debts'>('pos');
  const { products, loading, addProduct, editProduct, deleteProduct, refetch: refetchProducts } = useProducts();
  const { sales, addSale, payDebt } = useSales();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; method: 'cash' | 'card' | 'debt' | 'mixed' }>({
    isOpen: false,
    method: 'cash',
  });

  // Handle barcode submit on Enter key - search in Supabase
  const handleBarcodeSubmit = async (barcode: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .maybeSingle();

    if (error) {
      toast.error('Издөөдө ката');
      return;
    }

    if (data) {
      const product: Product = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        cost: Number(data.cost),
        category: data.category,
        stock: data.stock,
        barcode: data.barcode || undefined,
      };
      handleAddToCart(product);
      setSearchQuery('');
      toast.success(`${product.name} кошулду`);
    } else {
      toast.error('Товар табылган жок');
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  // Cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Add to cart
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} добавлен в корзину`);
  };

  // Update quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  // Remove item
  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Open payment modal
  const handleCheckout = (method: 'cash' | 'card' | 'debt' | 'mixed') => {
    setPaymentModal({ isOpen: true, method });
  };

  // Confirm payment - save to Supabase
  const handlePaymentConfirm = async (cashReceived?: number, customerName?: string, customerPhone?: string, cashAmount?: number, cardAmount?: number, debtAmount?: number) => {
    const result = await addSale(
      [...cart],
      cartTotal,
      paymentModal.method,
      cashReceived,
      customerName,
      customerPhone,
      cashAmount,
      cardAmount,
      debtAmount
    );

    if (result) {
      setCart([]);
      setPaymentModal({ isOpen: false, method: 'cash' });
      
      // Refresh products to get updated stock
      await refetchProducts();
      
      if (paymentModal.method === 'mixed' && debtAmount && debtAmount > 0) {
        toast.success('Смешанная оплата оформлена (есть долг)!');
      } else if (paymentModal.method === 'debt') {
        toast.success('Продажа в долг оформлена!');
      } else {
        toast.success('Продажа завершена!');
      }
    }
  };

  // Pay debt - update in Supabase
  const handlePayDebt = async (saleId: string) => {
    await payDebt(saleId);
  };

  // Product management - now using Supabase hooks
  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    await addProduct(product);
  };

  const handleEditProduct = async (product: Product) => {
    await editProduct(product);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
  };

  // Show PIN lock if not unlocked
  if (!isUnlocked) {
    return <PinLock onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'pos' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Products Panel - 1/4 of screen */}
          <div className="w-1/4 flex-shrink-0 flex flex-col p-4 overflow-hidden">
            {/* Stats */}
            <SalesStats sales={sales} />

            {/* Search & Categories */}
            <div className="mt-4 space-y-4">
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                onBarcodeSubmit={handleBarcodeSubmit}
              />
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1 mt-4 overflow-y-auto pos-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                  />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Товары не найдены</p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Panel - 3/4 of screen */}
          <div className="w-3/4 flex-shrink-0 border-l border-border">
            <CartPanel
              items={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
              onClearCart={handleClearCart}
            />
          </div>
        </div>
      )}

      {currentView === 'products' && (
        <div className="flex-1 overflow-y-auto">
          <ProductsView
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </div>
      )}

      {currentView === 'debts' && (
        <div className="flex-1 overflow-y-auto">
          <DebtsView sales={sales} onPayDebt={handlePayDebt} />
        </div>
      )}

      {currentView === 'reports' && (
        <div className="flex-1 overflow-hidden">
          <ReportsView sales={sales} products={products} />
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, method: 'cash' })}
        total={cartTotal}
        method={paymentModal.method}
        items={cart}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
};

export default Index;
