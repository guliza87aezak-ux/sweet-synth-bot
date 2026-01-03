import { Product, Category } from '@/types/pos';

export const categories: Category[] = [
  { id: 'all', name: 'Все', icon: 'LayoutGrid' },
  { id: 'drinks', name: 'Напитки', icon: 'Coffee' },
  { id: 'food', name: 'Еда', icon: 'UtensilsCrossed' },
  { id: 'snacks', name: 'Снеки', icon: 'Cookie' },
  { id: 'dairy', name: 'Молочные', icon: 'Milk' },
  { id: 'bakery', name: 'Выпечка', icon: 'Croissant' },
];

export const products: Product[] = [
  // Drinks
  { id: '1', name: 'Coca-Cola 0.5L', price: 250, category: 'drinks', stock: 50, barcode: '5449000000996' },
  { id: '2', name: 'Fanta Orange 0.5L', price: 250, category: 'drinks', stock: 45, barcode: '5449000131805' },
  { id: '3', name: 'Sprite 0.5L', price: 250, category: 'drinks', stock: 40, barcode: '5449000014535' },
  { id: '4', name: 'Вода Bonaqua 0.5L', price: 150, category: 'drinks', stock: 100, barcode: '5449000000003' },
  { id: '5', name: 'Сок Добрый 1L', price: 350, category: 'drinks', stock: 30, barcode: '4600494000019' },
  { id: '6', name: 'Чай Lipton 0.5L', price: 200, category: 'drinks', stock: 35, barcode: '8714100711293' },
  
  // Food
  { id: '7', name: 'Сэндвич с курицей', price: 450, category: 'food', stock: 15, barcode: 'FOOD001' },
  { id: '8', name: 'Сэндвич с ветчиной', price: 400, category: 'food', stock: 12, barcode: 'FOOD002' },
  { id: '9', name: 'Салат Цезарь', price: 550, category: 'food', stock: 8, barcode: 'FOOD003' },
  { id: '10', name: 'Хот-дог классический', price: 300, category: 'food', stock: 20, barcode: 'FOOD004' },
  
  // Snacks
  { id: '11', name: 'Lay\'s Классические', price: 180, category: 'snacks', stock: 60, barcode: '5010477348678' },
  { id: '12', name: 'Pringles Original', price: 350, category: 'snacks', stock: 25, barcode: '5053990127723' },
  { id: '13', name: 'Snickers', price: 120, category: 'snacks', stock: 80, barcode: '5000159461122' },
  { id: '14', name: 'KitKat', price: 100, category: 'snacks', stock: 75, barcode: '7613034626837' },
  { id: '15', name: 'M&M\'s', price: 150, category: 'snacks', stock: 55, barcode: '5000159461290' },
  
  // Dairy
  { id: '16', name: 'Молоко 1L', price: 120, category: 'dairy', stock: 40, barcode: 'DAIRY001' },
  { id: '17', name: 'Йогурт Danone', price: 90, category: 'dairy', stock: 45, barcode: 'DAIRY002' },
  { id: '18', name: 'Сыр Голландский 200г', price: 450, category: 'dairy', stock: 18, barcode: 'DAIRY003' },
  { id: '19', name: 'Творог 5% 200г', price: 180, category: 'dairy', stock: 22, barcode: 'DAIRY004' },
  
  // Bakery
  { id: '20', name: 'Круассан', price: 150, category: 'bakery', stock: 25, barcode: 'BAKERY001' },
  { id: '21', name: 'Пончик с глазурью', price: 100, category: 'bakery', stock: 30, barcode: 'BAKERY002' },
  { id: '22', name: 'Булочка с корицей', price: 120, category: 'bakery', stock: 28, barcode: 'BAKERY003' },
  { id: '23', name: 'Хлеб белый', price: 80, category: 'bakery', stock: 35, barcode: 'BAKERY004' },
];
