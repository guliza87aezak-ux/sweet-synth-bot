import { Sale } from '@/types/pos';
import { TrendingUp, Receipt, DollarSign, Clock } from 'lucide-react';

interface SalesStatsProps {
  sales: Sale[];
}

const SalesStats = ({ sales }: SalesStatsProps) => {
  const todaySales = sales.filter(
    (sale) => new Date(sale.timestamp).toDateString() === new Date().toDateString()
  );
  
  const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const averageTicket = todaySales.length > 0 ? totalRevenue / todaySales.length : 0;
  const lastSale = todaySales[todaySales.length - 1];

  const stats = [
    {
      label: 'Выручка сегодня',
      value: `${totalRevenue.toLocaleString()} сом`,
      icon: DollarSign,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Продаж',
      value: todaySales.length.toString(),
      icon: Receipt,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Средний чек',
      value: `${Math.round(averageTicket).toLocaleString()} сом`,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Последняя продажа',
      value: lastSale 
        ? new Date(lastSale.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        : '—',
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesStats;
