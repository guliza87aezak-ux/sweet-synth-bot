import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Banknote, CreditCard, Printer } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  method: 'cash' | 'card';
  onConfirm: (cashReceived?: number) => void;
}

const PaymentModal = ({ isOpen, onClose, total, method, onConfirm }: PaymentModalProps) => {
  const [cashReceived, setCashReceived] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount - total;
  const canConfirm = method === 'card' || (method === 'cash' && cashAmount >= total);

  const quickAmounts = [
    Math.ceil(total / 1000) * 1000,
    Math.ceil(total / 5000) * 5000,
    Math.ceil(total / 10000) * 10000,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= total);

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setIsComplete(true);
    
    // Auto close after success
    setTimeout(() => {
      onConfirm(method === 'cash' ? cashAmount : undefined);
      setIsComplete(false);
      setCashReceived('');
    }, 2000);
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setIsComplete(false);
      setCashReceived('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isComplete ? (
          <div className="py-8 flex flex-col items-center justify-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4 animate-pulse-success">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Оплата успешна!</h3>
            {method === 'cash' && change > 0 && (
              <p className="text-muted-foreground">
                Сдача: <span className="font-bold text-accent">{change.toLocaleString()} ₸</span>
              </p>
            )}
            <Button variant="outline" className="mt-4" onClick={() => {}}>
              <Printer className="w-4 h-4 mr-2" />
              Печать чека
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
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-accent" />
                    Оплата картой
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Total */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">К оплате</p>
                <p className="text-4xl font-bold text-foreground">
                  {total.toLocaleString()} <span className="text-2xl">₸</span>
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
                        {change.toLocaleString()} ₸
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
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1" disabled={isProcessing}>
                Отмена
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!canConfirm || isProcessing}
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
