import { useEffect, useRef, useState } from 'react';
import { CartItem } from '@/types/pos';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Clock, Blend, ScanBarcode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartPanelProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (method: 'cash' | 'card' | 'debt' | 'mixed') => void;
  onClearCart: () => void;
  onBarcodeSubmit?: (barcode: string) => void;
}

const CartPanel = ({ items, onUpdateQuantity, onRemoveItem, onCheckout, onClearCart, onBarcodeSubmit }: CartPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevItemsLengthRef = useRef(items.length);
  const [showScanner, setShowScanner] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new item is added
  useEffect(() => {
    if (items.length > prevItemsLengthRef.current && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    prevItemsLengthRef.current = items.length;
  }, [items.length]);

  // Auto-focus barcode input when scanner is shown
  useEffect(() => {
    if (showScanner && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [showScanner]);

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeInput.trim() && onBarcodeSubmit) {
      e.preventDefault();
      onBarcodeSubmit(barcodeInput.trim());
      setBarcodeInput('');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0; // No tax for this demo
  const total = subtotal + tax;

  return (
    <div className="h-full flex flex-col bg-pos-cart-bg text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="font-semibold text-lg">Корзина</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScanner(!showScanner)}
              className={`p-2 rounded-lg transition-colors ${showScanner ? 'bg-accent text-accent-foreground' : 'text-white/50 hover:text-white/80 hover:bg-white/10'}`}
            >
              <ScanBarcode className="w-5 h-5" />
            </button>
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                Очистить
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-white/50 mt-1">
          {items.length} {items.length === 1 ? 'товар' : items.length > 1 && items.length < 5 ? 'товара' : 'товаров'}
        </p>
        
        {/* Barcode Scanner Input */}
        {showScanner && (
          <div className="mt-3">
            <Input
              ref={barcodeInputRef}
              type="text"
              placeholder="Штрих-код сканерлеңиз..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 pos-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/30">
            <ShoppingCart className="w-12 h-12 mb-3" />
            <p className="text-sm">Корзина пуста</p>
            <p className="text-xs mt-1">Добавьте товары для продажи</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-pos-cart-item animate-slide-in-right border border-white/5"
            >
              {/* Item number badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base truncate">{item.name}</h4>
                    <p className="text-accent text-lg font-bold mt-1">
                      {item.price.toLocaleString()} сом
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-white/40 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 bg-pos-quantity-bg rounded-xl p-1.5">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="font-bold text-xl">
                  {(item.price * item.quantity).toLocaleString()} сом
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary & Checkout */}
      <div className="p-4 border-t border-white/10 space-y-4">
        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Подитог</span>
            <span>{subtotal.toLocaleString()} сом</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Итого</span>
            <span className="text-accent">{total.toLocaleString()} сом</span>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onCheckout('cash')}
            disabled={items.length === 0}
            className="h-12 bg-white/10 hover:bg-white/20 text-white border-0 disabled:opacity-30"
          >
            <Banknote className="w-4 h-4 mr-1" />
            <span className="text-xs">Наличные</span>
          </Button>
          <Button
            onClick={() => onCheckout('card')}
            disabled={items.length === 0}
            className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-30"
          >
            <CreditCard className="w-4 h-4 mr-1" />
            <span className="text-xs">Карта</span>
          </Button>
          <Button
            onClick={() => onCheckout('mixed')}
            disabled={items.length === 0}
            className="h-12 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-30"
          >
            <Blend className="w-4 h-4 mr-1" />
            <span className="text-xs">Смешанная</span>
          </Button>
          <Button
            onClick={() => onCheckout('debt')}
            disabled={items.length === 0}
            className="h-12 bg-warning/80 hover:bg-warning text-warning-foreground disabled:opacity-30"
          >
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-xs">В долг</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
