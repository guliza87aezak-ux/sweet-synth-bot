import { Sale } from '@/types/pos';
import { Clock, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DebtsViewProps {
  sales: Sale[];
  onPayDebt: (saleId: string) => void;
}

const DebtsView = ({ sales, onPayDebt }: DebtsViewProps) => {
  const debts = sales.filter((s) => s.paymentMethod === 'debt');
  const unpaidDebts = debts.filter((s) => !s.isPaid);
  const paidDebts = debts.filter((s) => s.isPaid);
  const totalUnpaidDebt = unpaidDebts.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Долги</h2>
          <p className="text-muted-foreground">Список должников магазина</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 border border-warning/30">
          <AlertCircle className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium text-warning">
            Общий долг: {totalUnpaidDebt.toLocaleString()} сом
          </span>
        </div>
      </div>

      {/* Unpaid Debts */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-warning" />
          Непогашенные долги ({unpaidDebts.length})
        </h3>
        
        {unpaidDebts.length === 0 ? (
          <div className="p-8 rounded-xl bg-card border border-border text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" />
            <p className="text-muted-foreground">Нет непогашенных долгов</p>
          </div>
        ) : (
          <div className="space-y-3">
            {unpaidDebts.map((debt) => (
              <div
                key={debt.id}
                className="p-4 rounded-xl bg-card border border-warning/30 hover:border-warning/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">
                        {debt.customerName || 'Неизвестный клиент'}
                      </span>
                    </div>
                    {debt.customerPhone && (
                      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{debt.customerPhone}</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(debt.timestamp).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {debt.items.length} товар(ов)
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-warning">
                      {debt.total.toLocaleString()} сом
                    </p>
                    <Button
                      size="sm"
                      onClick={() => onPayDebt(debt.id)}
                      className="mt-2 bg-success hover:bg-success/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Погасить
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paid Debts */}
      {paidDebts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Погашенные долги ({paidDebts.length})
          </h3>
          <div className="space-y-3">
            {paidDebts.map((debt) => (
              <div
                key={debt.id}
                className="p-4 rounded-xl bg-card border border-border opacity-60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground line-through">
                        {debt.customerName || 'Неизвестный клиент'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(debt.timestamp).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success line-through">
                      {debt.total.toLocaleString()} сом
                    </p>
                    <span className="text-xs text-success">Оплачено</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtsView;
