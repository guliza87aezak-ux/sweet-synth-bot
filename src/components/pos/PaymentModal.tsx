import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Banknote, CreditCard, Printer, Receipt, Clock, Blend } from 'lucide-react';
import { CartItem } from '@/types/pos';
import { Label } from '@/components/ui/label';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  method: 'cash' | 'card' | 'debt' | 'mixed';
  items: CartItem[];
  onConfirm: (cashReceived?: number, customerName?: string, customerPhone?: string, cashAmount?: number, cardAmount?: number) => void;
}

const PaymentModal = ({ isOpen, onClose, total, method, items, onConfirm }: PaymentModalProps) => {
  const [cashReceived, setCashReceived] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  
  // Mixed payment state
  const [mixedCash, setMixedCash] = useState<string>('');
  const [mixedCard, setMixedCard] = useState<string>('');

  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount - total;
  const canConfirm = method === 'card' || method === 'debt' || method === 'mixed' || (method === 'cash' && cashAmount >= total);
  const canConfirmDebt = method !== 'debt' || (customerName.trim() !== '');
  
  // Mixed payment validation
  const mixedCashNum = parseFloat(mixedCash) || 0;
  const mixedCardNum = parseFloat(mixedCard) || 0;
  const mixedTotal = mixedCashNum + mixedCardNum;
  const canConfirmMixed = method !== 'mixed' || mixedTotal >= total;

  const currentDate = new Date();

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleShowReceipt = () => {
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    onConfirm(
      method === 'cash' ? cashAmount : undefined,
      method === 'debt' ? customerName : undefined,
      method === 'debt' ? customerPhone : undefined,
      method === 'mixed' ? mixedCashNum : undefined,
      method === 'mixed' ? mixedCardNum : undefined
    );
    setShowReceipt(false);
    setIsComplete(false);
    setCashReceived('');
    setCustomerName('');
    setCustomerPhone('');
    setMixedCash('');
    setMixedCard('');
  };

  const handleClose = () => {
    if (!isProcessing && !showReceipt) {
      onClose();
      setIsComplete(false);
      setCashReceived('');
      setCustomerName('');
      setCustomerPhone('');
      setMixedCash('');
      setMixedCard('');
    }
  };

  // Auto-calculate remaining for mixed payment
  useEffect(() => {
    if (method === 'mixed' && mixedCash) {
      const remaining = total - mixedCashNum;
      if (remaining > 0) {
        setMixedCard(remaining.toString());
      }
    }
  }, [mixedCash, total, method, mixedCashNum]);

  const quickAmounts = [
    Math.ceil(total / 1000) * 1000,
    Math.ceil(total / 5000) * 5000,
    Math.ceil(total / 10000) * 10000,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= total);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={showReceipt ? "sm:max-w-sm p-0" : "sm:max-w-md"}>
        {showReceipt ? (
          <div className="bg-white text-black font-mono text-sm">
            {/* Receipt Header */}
            <div className="p-4 text-center border-b border-dashed border-gray-300">
              <h2 className="text-lg font-bold">Гринлиф Эко</h2>
              <p className="text-xs text-gray-600 mt-1">Кыргызстан</p>
              <p className="text-xs text-gray-600">Тел: +7 777 123 45 67</p>
            </div>

            {/* Receipt Info */}
            <div className="px-4 py-2 border-b border-dashed border-gray-300">
              <div className="flex justify-between text-xs">
                <span>Чек №{Date.now().toString().slice(-6)}</span>
                <span>{currentDate.toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Кассир: Admin</span>
                <span>{currentDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Items */}
            <div className="px-4 py-3 border-b border-dashed border-gray-300 max-h-48 overflow-y-auto">
              {items.map((item, index) => (
                <div key={item.id} className="mb-2">
                  <div className="flex justify-between">
                    <span className="truncate flex-1">{index + 1}. {item.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 pl-3">
                    <span>{item.quantity} x {item.price.toLocaleString()} сом</span>
                    <span className="font-medium text-black">{(item.quantity * item.price).toLocaleString()} сом</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-4 py-3 border-b border-dashed border-gray-300 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Подитог:</span>
                <span>{total.toLocaleString()} сом</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>НДС (0%):</span>
                <span>0 сом</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>ИТОГО:</span>
                <span>{total.toLocaleString()} сом</span>
              </div>
            </div>

            <div className="px-4 py-2 border-b border-dashed border-gray-300">
              <div className="flex justify-between text-xs">
                <span>Способ оплаты:</span>
                <span>{method === 'cash' ? 'Наличные' : method === 'card' ? 'Карта' : method === 'mixed' ? 'Смешанная' : 'В долг'}</span>
              </div>
              {method === 'debt' && customerName && (
                <div className="flex justify-between text-xs mt-1">
                  <span>Клиент:</span>
                  <span>{customerName}</span>
                </div>
              )}
              {method === 'cash' && cashAmount > 0 && (
                <>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Получено:</span>
                    <span>{cashAmount.toLocaleString()} сом</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1 font-medium">
                    <span>Сдача:</span>
                    <span>{change.toLocaleString()} сом</span>
                  </div>
                </>
              )}
              {method === 'mixed' && (
                <>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Наличные:</span>
                    <span>{mixedCashNum.toLocaleString()} сом</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Карта:</span>
                    <span>{mixedCardNum.toLocaleString()} сом</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
              <p className="text-xs text-gray-600">Спасибо за покупку!</p>
              <p className="text-xs text-gray-400 mt-1">Товар обмену и возврату подлежит</p>
              <div className="mt-3 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-black border-gray-300"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Печать
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-accent hover:bg-accent/90"
                  onClick={handleCloseReceipt}
                >
                  Готово
                </Button>
              </div>
            </div>
          </div>
        ) : isComplete ? (
          <div className="py-8 flex flex-col items-center justify-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4 animate-pulse-success">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Оплата успешна!</h3>
            {method === 'cash' && change > 0 && (
              <p className="text-muted-foreground">
                Сдача: <span className="font-bold text-accent">{change.toLocaleString()} сом</span>
              </p>
            )}
            <Button variant="outline" className="mt-4" onClick={handleShowReceipt}>
              <Receipt className="w-4 h-4 mr-2" />
              Показать чек
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {method === 'cash' ? (
                  <>
                    <Banknote className="w-5 h-5 text-accent" />
                    Оплата наличными
                  </>
                ) : method === 'card' ? (
                  <>
                    <CreditCard className="w-5 h-5 text-accent" />
                    Оплата картой
                  </>
                ) : method === 'mixed' ? (
                  <>
                    <Blend className="w-5 h-5 text-purple-500" />
                    Смешанная оплата
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-warning" />
                    Продажа в долг
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Total */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">К оплате</p>
                <p className="text-4xl font-bold text-foreground">
                  {total.toLocaleString()} <span className="text-2xl">сом</span>
                </p>
              </div>

              {/* Cash input */}
              {method === 'cash' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Получено от клиента</p>
                  <Input
                    type="number"
                    placeholder="0"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="h-14 text-2xl text-center font-bold"
                    autoFocus
                  />
                  
                  {/* Quick amounts */}
                  <div className="flex gap-2">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCashReceived(amount.toString())}
                        className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                      >
                        {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Change */}
                  {cashAmount >= total && (
                    <div className="p-4 rounded-xl bg-success/10 text-center">
                      <p className="text-sm text-muted-foreground">Сдача</p>
                      <p className="text-2xl font-bold text-success">
                        {change.toLocaleString()} сом
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Card payment instructions */}
              {method === 'card' && (
                <div className="p-4 rounded-xl bg-muted text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Приложите или вставьте карту в терминал
                  </p>
                </div>
              )}

              {/* Mixed payment form */}
              {method === 'mixed' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-purple-500/10 text-center mb-4">
                    <Blend className="w-12 h-12 mx-auto mb-3 text-purple-500" />
                    <p className="text-muted-foreground">Разделить оплату</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mixedCash" className="flex items-center gap-2">
                      <Banknote className="w-4 h-4" /> Наличные
                    </Label>
                    <Input
                      id="mixedCash"
                      type="number"
                      value={mixedCash}
                      onChange={(e) => setMixedCash(e.target.value)}
                      placeholder="0"
                      className="h-12 text-lg font-semibold"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mixedCard" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Карта
                    </Label>
                    <Input
                      id="mixedCard"
                      type="number"
                      value={mixedCard}
                      onChange={(e) => setMixedCard(e.target.value)}
                      placeholder="0"
                      className="h-12 text-lg font-semibold"
                    />
                  </div>
                  
                  {/* Mixed total status */}
                  <div className={`p-4 rounded-xl text-center ${mixedTotal >= total ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    <p className="text-sm text-muted-foreground">Итого введено</p>
                    <p className={`text-2xl font-bold ${mixedTotal >= total ? 'text-success' : 'text-destructive'}`}>
                      {mixedTotal.toLocaleString()} / {total.toLocaleString()} сом
                    </p>
                    {mixedTotal < total && (
                      <p className="text-sm text-destructive mt-1">
                        Осталось: {(total - mixedTotal).toLocaleString()} сом
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Debt form */}
              {method === 'debt' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-warning/10 text-center mb-4">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-warning" />
                    <p className="text-muted-foreground">Продажа в долг</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Имя клиента *</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Введите имя клиента"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Телефон</Label>
                    <Input
                      id="customerPhone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+996 XXX XXX XXX"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1" disabled={isProcessing}>
                Отмена
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!canConfirm || !canConfirmDebt || !canConfirmMixed || isProcessing}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isProcessing ? 'Обработка...' : 'Подтвердить'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
