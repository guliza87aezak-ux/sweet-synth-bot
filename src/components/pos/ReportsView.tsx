import { useState, useMemo } from 'react';
import { Sale, Product } from '@/types/pos';
import { TrendingUp, ShoppingBag, CreditCard, Banknote, Calendar, Package, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, format, eachDayOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ReportsViewProps {
  sales: Sale[];
  products: Product[];
}

type PeriodType = 'day' | 'week' | 'month';

const ReportsView = ({ sales, products }: ReportsViewProps) => {
  const [period, setPeriod] = useState<PeriodType>('day');

  // Get date range based on period
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (period) {
      case 'day':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  }, [period]);

  // Filter sales by period
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = new Date(sale.timestamp);
      return isWithinInterval(saleDate, { start: dateRange.start, end: dateRange.end });
    });
  }, [sales, dateRange]);

  // Calculate stats
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const cashSales = filteredSales.filter((s) => s.paymentMethod === 'cash');
  const cardSales = filteredSales.filter((s) => s.paymentMethod === 'card');
  const debtSales = filteredSales.filter((s) => s.paymentMethod === 'debt' && !s.isPaid);
  const cashTotal = cashSales.reduce((sum, s) => sum + s.total, 0);
  const cardTotal = cardSales.reduce((sum, s) => sum + s.total, 0);
  const debtTotal = debtSales.reduce((sum, s) => sum + s.total, 0);

  // Chart data based on period
  const chartData = useMemo(() => {
    if (period === 'day') {
      // Hourly data for today
      return Array.from({ length: 12 }, (_, i) => {
        const hour = i + 9; // 9 AM to 8 PM
        const hourSales = filteredSales.filter((s) => new Date(s.timestamp).getHours() === hour);
        return {
          label: `${hour}:00`,
          revenue: hourSales.reduce((sum, s) => sum + s.total, 0),
          transactions: hourSales.length,
        };
      });
    } else if (period === 'week') {
      // Daily data for the week
      const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
      return days.map((day) => {
        const daySales = filteredSales.filter((s) => {
          const saleDate = new Date(s.timestamp);
          return saleDate.toDateString() === day.toDateString();
        });
        return {
          label: format(day, 'EEE', { locale: ru }),
          revenue: daySales.reduce((sum, s) => sum + s.total, 0),
          transactions: daySales.length,
        };
      });
    } else {
      // Daily data for the month (grouped by week or day)
      const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
      return days.map((day) => {
        const daySales = filteredSales.filter((s) => {
          const saleDate = new Date(s.timestamp);
          return saleDate.toDateString() === day.toDateString();
        });
        return {
          label: format(day, 'd'),
          revenue: daySales.reduce((sum, s) => sum + s.total, 0),
          transactions: daySales.length,
        };
      });
    }
  }, [period, filteredSales, dateRange]);

  // Top products with profit calculation
  const productSales: Record<string, { name: string; barcode?: string; quantity: number; revenue: number; cost: number; profit: number }> = {};
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, barcode: item.barcode, quantity: 0, revenue: 0, cost: 0, profit: 0 };
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
  const totalCost = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + (item.cost || 0) * item.quantity, 0), 0
  );
  const totalProfit = totalRevenue - totalCost;

  // Calculate inventory value (stock * cost)
  const inventoryValue = products.reduce((sum, p) => sum + (p.cost || 0) * p.stock, 0);
  const inventoryRetailValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const paymentData = [
    { name: 'Накталай', value: cashTotal, color: 'hsl(152, 60%, 45%)' },
    { name: 'Карта', value: cardTotal, color: 'hsl(222, 47%, 20%)' },
    { name: 'Карыз', value: debtTotal, color: 'hsl(38, 92%, 50%)' },
  ];

  const stats = [
    { label: 'Жалпы түшүм', value: `${totalRevenue.toLocaleString()} сом`, icon: TrendingUp, color: 'text-accent' },
    { label: 'Пайда', value: `${totalProfit.toLocaleString()} сом`, icon: TrendingUp, color: 'text-success' },
    { label: 'Карыздар', value: `${debtTotal.toLocaleString()} сом`, icon: Clock, color: 'text-warning' },
    { label: 'Запас (өздүк наркы)', value: `${inventoryValue.toLocaleString()} сом`, icon: Package, color: 'text-primary' },
    { label: 'Запас (сатуу баасы)', value: `${inventoryRetailValue.toLocaleString()} сом`, icon: Package, color: 'text-muted-foreground' },
  ];

  const getPeriodLabel = () => {
    switch (period) {
      case 'day':
        return format(new Date(), 'd MMMM yyyy', { locale: ru });
      case 'week':
        return `${format(dateRange.start, 'd MMM', { locale: ru })} - ${format(dateRange.end, 'd MMM yyyy', { locale: ru })}`;
      case 'month':
        return format(new Date(), 'MMMM yyyy', { locale: ru });
    }
  };

  const getChartTitle = () => {
    switch (period) {
      case 'day':
        return 'Саат боюнча сатуулар';
      case 'week':
        return 'Күн боюнча сатуулар';
      case 'month':
        return 'Күн боюнча сатуулар';
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Отчёттор</h2>
          <p className="text-muted-foreground">Сатуу статистикасы: {getPeriodLabel()}</p>
        </div>
        
        {/* Period Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50">
          <button
            onClick={() => setPeriod('day')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === 'day'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Күндүк
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === 'week'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Жумалык
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              period === 'month'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Айлык
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
        {/* Sales Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-4">{getChartTitle()}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} сом`, 'Түшүм']}
                />
                <Bar dataKey="revenue" fill="hsl(152, 60%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Pie */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-4">Төлөө ыкмалары</h3>
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
        <h3 className="font-semibold text-foreground mb-4">Эң мыкты товарлар</h3>
        <div className="space-y-3">
          {topProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Сатуу маалыматы жок</p>
          ) : (
            topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{product.barcode || 'Кодсуз'}</p>
                  <p className="text-sm text-muted-foreground">{product.quantity} даана сатылды</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{product.revenue.toLocaleString()} сом</p>
                  <p className="text-sm text-success">+{product.profit.toLocaleString()} сом пайда</p>
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
