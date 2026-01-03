import { Search, ScanBarcode } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onBarcodeClick?: () => void;
}

const SearchBar = ({ value, onChange, onBarcodeClick }: SearchBarProps) => {
  return (
    <div className="relative flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Поиск товара или штрих-код..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 h-12 bg-card border-border text-base"
        />
      </div>
      <button
        onClick={onBarcodeClick}
        className="h-12 px-4 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-center gap-2"
      >
        <ScanBarcode className="w-5 h-5" />
        <span className="hidden sm:inline">Сканер</span>
      </button>
    </div>
  );
};

export default SearchBar;
