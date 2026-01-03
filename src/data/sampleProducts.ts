import { Product, Category } from '@/types/pos';

export const categories: Category[] = [
  { id: 'all', name: 'Все', icon: 'LayoutGrid' },
  { id: 'hygiene', name: 'Личная гигиена', icon: 'Droplets' },
  { id: 'home', name: 'Товары для дома', icon: 'Home' },
  { id: 'oral', name: 'Продукты для рта', icon: 'Smile' },
  { id: 'skincare', name: 'Уходовая косметика', icon: 'Sparkles' },
  { id: 'makeup', name: 'Декоративная косметика', icon: 'Palette' },
  { id: 'perfume', name: 'Парфюм', icon: 'Wind' },
];

export const products: Product[] = [
  // Личная гигиена
  { id: '1', name: 'Шампунь Head & Shoulders 400мл', price: 1850, cost: 1200, category: 'hygiene', stock: 30, barcode: '5000174855753' },
  { id: '2', name: 'Гель для душа Dove 250мл', price: 950, cost: 600, category: 'hygiene', stock: 45, barcode: '8717163623459' },
  { id: '3', name: 'Мыло Safeguard', price: 350, cost: 200, category: 'hygiene', stock: 100, barcode: '4015400929208' },
  { id: '4', name: 'Дезодорант Nivea 150мл', price: 1200, cost: 750, category: 'hygiene', stock: 40, barcode: '4005808729920' },
  { id: '5', name: 'Влажные салфетки Huggies', price: 650, cost: 400, category: 'hygiene', stock: 55, barcode: '5029053534654' },
  
  // Товары для дома
  { id: '6', name: 'Средство для мытья посуды Fairy', price: 750, cost: 450, category: 'home', stock: 35, barcode: '8001090622129' },
  { id: '7', name: 'Стиральный порошок Ariel 3кг', price: 3500, cost: 2200, category: 'home', stock: 20, barcode: '8001090950338' },
  { id: '8', name: 'Освежитель воздуха Glade', price: 890, cost: 550, category: 'home', stock: 28, barcode: '5000204757958' },
  { id: '9', name: 'Губки для посуды 5шт', price: 280, cost: 150, category: 'home', stock: 60, barcode: 'HOME001' },
  
  // Продукты для рта
  { id: '10', name: 'Зубная паста Colgate 100мл', price: 680, cost: 400, category: 'oral', stock: 50, barcode: '8714789733296' },
  { id: '11', name: 'Зубная щётка Oral-B', price: 450, cost: 250, category: 'oral', stock: 40, barcode: '4210201175643' },
  { id: '12', name: 'Ополаскиватель Listerine 250мл', price: 1350, cost: 850, category: 'oral', stock: 25, barcode: '3574661253855' },
  { id: '13', name: 'Зубная нить Oral-B', price: 580, cost: 350, category: 'oral', stock: 35, barcode: '4210201381808' },
  
  // Уходовая косметика
  { id: '14', name: 'Крем для лица Nivea 50мл', price: 1450, cost: 900, category: 'skincare', stock: 30, barcode: '4005808178315' },
  { id: '15', name: 'Маска для лица Garnier', price: 890, cost: 550, category: 'skincare', stock: 25, barcode: '3600542032537' },
  { id: '16', name: 'Сыворотка для лица L\'Oreal', price: 2800, cost: 1800, category: 'skincare', stock: 15, barcode: '3600523354061' },
  { id: '17', name: 'Крем для рук Dove 75мл', price: 650, cost: 400, category: 'skincare', stock: 40, barcode: '8717163624463' },
  
  // Декоративная косметика
  { id: '18', name: 'Тушь для ресниц Maybelline', price: 2200, cost: 1400, category: 'makeup', stock: 20, barcode: '3600530588046' },
  { id: '19', name: 'Помада L\'Oreal Paris', price: 1850, cost: 1150, category: 'makeup', stock: 25, barcode: '3600523465804' },
  { id: '20', name: 'Пудра Maybelline Fit Me', price: 1650, cost: 1000, category: 'makeup', stock: 18, barcode: '3600530910458' },
  { id: '21', name: 'Тональный крем L\'Oreal', price: 2400, cost: 1500, category: 'makeup', stock: 22, barcode: '3600523497584' },
  
  // Парфюм
  { id: '22', name: 'Туалетная вода Hugo Boss 50мл', price: 12500, cost: 8000, category: 'perfume', stock: 8, barcode: '737052351223' },
  { id: '23', name: 'Парфюм Chanel Coco 30мл', price: 18900, cost: 12000, category: 'perfume', stock: 5, barcode: '3145891135305' },
  { id: '24', name: 'Духи Dior Sauvage 60мл', price: 15800, cost: 10000, category: 'perfume', stock: 6, barcode: '3348901250252' },
  { id: '25', name: 'Туалетная вода Versace 50мл', price: 9500, cost: 6000, category: 'perfume', stock: 10, barcode: '8011003816705' },
];
