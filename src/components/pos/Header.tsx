import { Store, BarChart3, Package, Settings, User, Clock } from 'lucide-react';

interface HeaderProps {
  currentView: 'pos' | 'reports' | 'products' | 'debts';
  onViewChange: (view: 'pos' | 'reports' | 'products' | 'debts') => void;
}

const Header = ({ currentView, onViewChange }: HeaderProps) => {
  const navItems = [
    { id: 'pos' as const, label: 'Касса', icon: Store },
    { id: 'products' as const, label: 'Товары', icon: Package },
    { id: 'debts' as const, label: 'Долги', icon: Clock },
    { id: 'reports' as const, label: 'Отчёты', icon: BarChart3 },
  ];

  return (
    <header className="h-16 bg-card border-b border-border px-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Store className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-foreground">WebKassa</h1>
          <p className="text-xs text-muted-foreground">Точка продаж</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1 bg-muted p-1 rounded-xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-200
              ${currentView === item.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Menu */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
