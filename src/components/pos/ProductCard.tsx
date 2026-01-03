import { Product } from '@/types/pos';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(product)}
      disabled={isOutOfStock}
      className={`
        group relative flex flex-col p-4 rounded-xl bg-card border border-border
        transition-all duration-200 text-left w-full
        ${isOutOfStock 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:border-accent hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-0.5 active:scale-[0.98]'
        }
      `}
    >
      {/* Product Image Placeholder */}
      <div className="w-full aspect-square rounded-lg bg-muted mb-3 flex items-center justify-center overflow-hidden">
        <span className="text-3xl text-muted-foreground/50">📦</span>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-foreground truncate mb-1">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-accent">
          {product.price.toLocaleString()} ₸
        </p>
      </div>

      {/* Stock Badge */}
      {isLowStock && !isOutOfStock && (
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full bg-warning/10 text-warning">
          Мало: {product.stock}
        </span>
      )}
      {isOutOfStock && (
        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
          Нет в наличии
        </span>
      )}

      {/* Add Button Overlay */}
      {!isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-accent/0 group-hover:bg-accent/5 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all shadow-lg">
            <Plus className="w-5 h-5 text-accent-foreground" />
          </div>
        </div>
      )}
    </button>
  );
};

export default ProductCard;
