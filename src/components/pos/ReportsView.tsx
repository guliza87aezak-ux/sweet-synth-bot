import { Sale } from '@/types/pos';
import { TrendingUp, ShoppingBag, CreditCard, Banknote, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportsViewProps {
  sales: Sale[];
}

const ReportsView = ({ sales }: ReportsViewProps) => {
  // Calculate stats
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const cashSales = sales.filter((s) => s.paymentMethod === 'cash');
  const cardSales = sales.filter((s) => s.paymentMethod === 'card');
  const cashTotal = cashSales.reduce((sum, s) => sum + s.total, 0);
  const cardTotal = cardSales.reduce((sum, s) => sum + s.total, 0);

  // Group sales by hour for chart
  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 9; // 9 AM to 8 PM
    const hourSales = sales.filter((s) => new Date(s.timestamp).getHours() === hour);
    return {
      hour: `${hour}:00`,
      revenue: hourSales.reduce((sum, s) => sum + s.total, 0),
      transactions: hourSales.length,
    };
  });

  // Top products with profit calculation
  const productSales: Record<string, { name: string; quantity: number; revenue: number; cost: number; profit: number }> = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, quantity: 0, revenue: 0, cost: 0, profit: 0 };
      }
      productSales[item.id].quantity += item.quantity;
      productSales[item.id].revenue += item.price * item.quantity;
      productSales[item.id].cost += (item.cost || 0) * item.quantity;
      productSales[item.id].profit += (item.price - (item.cost || 0)) * item.quantity;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate total profit
  const totalCost = sales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + (item.cost || 0) * item.quantity, 0), 0
  );
  const totalProfit = totalRevenue - totalCost;

  const paymentData = [
    { name: 'Наличные', value: cashTotal, color: 'hsl(152, 60%, 45%)' },
    { name: 'Карта', value: cardTotal, color: 'hsl(222, 47%, 20%)' },
  ];

  const stats = [
    { label: 'Общая выручка', value: `${totalRevenue.toLocaleString()} сом`, icon: TrendingUp, color: 'text-accent' },
    { label: 'Прибыль', value: `${totalProfit.toLocaleString()} сом`, icon: TrendingUp, color: 'text-success' },
    { label: 'Всего продаж', value: sales.length.toString(), icon: ShoppingBag, color: 'text-primary' },
    { label: 'Наличные', value: `${cashTotal.toLocaleString()} сом`, icon: Banknote, color: 'text-muted-foreground' },
    { label: 'Карта', value: `${cardTotal.toLocaleString()} сом`, icon: CreditCard, color: 'text-warning' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Отчёты</h2>
          <p className="text-muted-foreground">Статистика продаж за сегодня</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hourly Sales Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-4">Продажи по часам</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} сом`, 'Выручка']}
                />
                <Bar dataKey="revenue" fill="hsl(152, 60%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Pie */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-4">Способы оплаты</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} сом`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {paymentData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-4">Топ продуктов</h3>
        <div className="space-y-3">
          {topProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Нет данных о продажах</p>
          ) : (
            topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.quantity} шт продано</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{product.revenue.toLocaleString()} сом</p>
                  <p className="text-sm text-success">+{product.profit.toLocaleString()} сом прибыль</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
