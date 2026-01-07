import { Search, ScanBarcode } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onBarcodeClick?: () => void;
  onBarcodeSubmit?: (barcode: string) => void;
}

const SearchBar = ({ value, onChange, onBarcodeClick, onBarcodeSubmit }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus for barcode scanner support
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Re-focus when value is cleared (after successful scan)
  useEffect(() => {
    if (value === '') {
      inputRef.current?.focus();
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() && onBarcodeSubmit) {
      e.preventDefault();
      onBarcodeSubmit(value.trim());
    }
  };

  return (
    <div className="relative flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Штрих-код сканерлеңиз..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 h-12 bg-card border-border text-base"
          autoFocus
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
