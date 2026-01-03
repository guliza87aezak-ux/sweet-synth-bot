import { Category } from '@/types/pos';
import { LayoutGrid, Coffee, UtensilsCrossed, Cookie, Milk, Croissant } from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Milk,
  Croissant,
};

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 pos-scrollbar">
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || LayoutGrid;
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap
              transition-all duration-200
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
