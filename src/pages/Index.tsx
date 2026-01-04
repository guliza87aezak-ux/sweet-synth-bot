import { useState, useMemo } from 'react';
import { Product, CartItem, Sale } from '@/types/pos';
import { products as initialProducts, categories } from '@/data/sampleProducts';
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
import { toast } from 'sonner';

const Index = () => {
  const [currentView, setCurrentView] = useState<'pos' | 'reports' | 'products' | 'debts'>('pos');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; method: 'cash' | 'card' | 'debt' }>({
    isOpen: false,
    method: 'cash',
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode?.includes(searchQuery);
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
  const handleCheckout = (method: 'cash' | 'card' | 'debt') => {
    setPaymentModal({ isOpen: true, method });
  };

  // Confirm payment
  const handlePaymentConfirm = (cashReceived?: number, customerName?: string, customerPhone?: string) => {
    const sale: Sale = {
      id: Date.now().toString(),
      items: [...cart],
      total: cartTotal,
      paymentMethod: paymentModal.method,
      timestamp: new Date(),
      cashReceived,
      change: cashReceived ? cashReceived - cartTotal : undefined,
      customerName,
      customerPhone,
      isPaid: paymentModal.method !== 'debt',
    };

    setSales((prev) => [...prev, sale]);
    setCart([]);
    setPaymentModal({ isOpen: false, method: 'cash' });
    toast.success(paymentModal.method === 'debt' ? 'Продажа в долг оформлена!' : 'Продажа завершена!');
  };

  // Pay debt
  const handlePayDebt = (saleId: string) => {
    setSales((prev) =>
      prev.map((sale) =>
        sale.id === saleId ? { ...sale, isPaid: true } : sale
      )
    );
    toast.success('Долг погашен!');
  };

  // Product management
  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleEditProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    toast.success('Товар обновлён');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Товар удалён');
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      {currentView === 'pos' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Products Panel */}
          <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
            {/* Stats */}
            <SalesStats sales={sales} />

            {/* Search & Categories */}
            <div className="mt-4 space-y-4">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
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

          {/* Cart Panel */}
          <div className="w-80 lg:w-96 flex-shrink-0 border-l border-border">
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
