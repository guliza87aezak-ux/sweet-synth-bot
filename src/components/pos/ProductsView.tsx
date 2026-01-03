import { useState } from 'react';
import { Product } from '@/types/pos';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductsView = ({ products, onAddProduct, onEditProduct, onDeleteProduct }: ProductsViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Управление товарами</h2>
          <p className="text-muted-foreground">{products.length} товаров в каталоге</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Добавить товар
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card"
        />
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Товар</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Категория</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Цена</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Остаток</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.barcode}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground capitalize">{product.category}</td>
                <td className="p-4 text-right font-medium text-foreground">
                  {product.price.toLocaleString()} ₸
                </td>
                <td className="p-4 text-right">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${product.stock <= 5 
                      ? 'bg-destructive/10 text-destructive' 
                      : product.stock <= 20 
                        ? 'bg-warning/10 text-warning'
                        : 'bg-success/10 text-success'
                    }
                  `}>
                    {product.stock} шт
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsView;
