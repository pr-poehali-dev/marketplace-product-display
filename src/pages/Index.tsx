import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  marketplace: 'ozon' | 'wb' | 'yandex';
  url: string;
  imageUrl: string;
  isFavorite: boolean;
}

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Беспроводные наушники TWS',
    description: 'Качественный звук, до 24 часов работы, быстрая зарядка USB-C',
    price: '2 490 ₽',
    marketplace: 'ozon',
    url: 'https://ozon.ru',
    imageUrl: 'https://images.unsplash.com/photo-1590658165737-15a047b7a0b5?w=400&h=400&fit=crop',
    isFavorite: false
  },
  {
    id: 2,
    title: 'Умная колонка с Алисой',
    description: 'Голосовой помощник, управление умным домом, отличный звук',
    price: '3 990 ₽',
    marketplace: 'yandex',
    url: 'https://market.yandex.ru',
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop',
    isFavorite: false
  },
  {
    id: 3,
    title: 'Фитнес-браслет Mi Band 8',
    description: 'Мониторинг здоровья, 120+ спортивных режимов, AMOLED дисплей',
    price: '1 790 ₽',
    marketplace: 'wb',
    url: 'https://wildberries.ru',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
    isFavorite: false
  },
  {
    id: 4,
    title: 'Механическая клавиатура RGB',
    description: 'Переключатели Blue, RGB подсветка, отсоединяемый кабель',
    price: '4 290 ₽',
    marketplace: 'ozon',
    url: 'https://ozon.ru',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop',
    isFavorite: false
  },
  {
    id: 5,
    title: 'Беспроводная мышь MX Master 3',
    description: 'Эргономичный дизайн, до 70 дней работы, быстрая прокрутка',
    price: '6 990 ₽',
    marketplace: 'yandex',
    url: 'https://market.yandex.ru',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    isFavorite: false
  },
  {
    id: 6,
    title: 'Портативная колонка JBL',
    description: 'Водонепроницаемая IPX7, 12 часов работы, мощный бас',
    price: '3 490 ₽',
    marketplace: 'wb',
    url: 'https://wildberries.ru',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    isFavorite: false
  }
];

const Index = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    marketplace: 'ozon' as 'ozon' | 'wb' | 'yandex',
    url: '',
    imageUrl: ''
  });

  const toggleFavorite = (id: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  const addProduct = () => {
    if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.url) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    const product: Product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      ...newProduct,
      imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      isFavorite: false
    };

    setProducts([product, ...products]);
    setNewProduct({
      title: '',
      description: '',
      price: '',
      marketplace: 'ozon',
      url: '',
      imageUrl: ''
    });
    setIsDialogOpen(false);
    toast({
      title: 'Успешно!',
      description: 'Товар добавлен в каталог'
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'favorites' && product.isFavorite);
    return matchesSearch && matchesTab;
  });

  const marketplaceColors = {
    ozon: 'bg-blue-500',
    wb: 'bg-purple-500',
    yandex: 'bg-orange-500'
  };

  const marketplaceNames = {
    ozon: 'Ozon',
    wb: 'Wildberries',
    yandex: 'Яндекс Маркет'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Icon name="ShoppingBag" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              МойМаркет
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
            <a href="#posts" className="text-sm font-medium hover:text-primary transition-colors">Посты</a>
            <a href="#favorites" className="text-sm font-medium hover:text-primary transition-colors">Избранное</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icon name="Menu" size={24} />
          </Button>
        </div>
      </header>

      <section id="home" className="py-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold font-heading bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Все товары в одном месте
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Находите лучшие предложения с Ozon, Wildberries и Яндекс.Маркет. 
              Сравнивайте цены и выбирайте то, что нужно именно вам.
            </p>
            <div className="flex items-center gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск товаров по названию или описанию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Найти
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Icon name="Package" size={16} className="mr-2" />
                1000+ товаров
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Icon name="Store" size={16} className="mr-2" />
                3 маркетплейса
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Icon name="Zap" size={16} className="mr-2" />
                Быстрый поиск
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section id="posts" className="py-16 px-4 bg-white/50">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-3xl font-bold font-heading mb-2">Товары</h3>
                <p className="text-muted-foreground">Найдено товаров: {filteredProducts.length}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить товар
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-heading">Добавить новый товар</DialogTitle>
                      <DialogDescription>
                        Заполните информацию о товаре с маркетплейса
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Название товара *</Label>
                        <Input
                          id="title"
                          placeholder="Например: Беспроводные наушники"
                          value={newProduct.title}
                          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Описание *</Label>
                        <Textarea
                          id="description"
                          placeholder="Краткое описание товара, его особенности..."
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Цена *</Label>
                          <Input
                            id="price"
                            placeholder="2 490 ₽"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="marketplace">Маркетплейс *</Label>
                          <Select
                            value={newProduct.marketplace}
                            onValueChange={(value: 'ozon' | 'wb' | 'yandex') => 
                              setNewProduct({ ...newProduct, marketplace: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ozon">Ozon</SelectItem>
                              <SelectItem value="wb">Wildberries</SelectItem>
                              <SelectItem value="yandex">Яндекс Маркет</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">Ссылка на товар *</Label>
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://ozon.ru/product/..."
                          value={newProduct.url}
                          onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Ссылка на изображение (опционально)</Label>
                        <Input
                          id="imageUrl"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={newProduct.imageUrl}
                          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Если не указать, будет использовано изображение по умолчанию
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={addProduct} className="bg-gradient-to-r from-primary to-secondary">
                        <Icon name="Check" size={16} className="mr-2" />
                        Добавить товар
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <TabsList className="grid w-full sm:w-auto grid-cols-2 h-auto">
                  <TabsTrigger value="all" className="gap-2">
                    <Icon name="Grid3x3" size={16} />
                    Все товары
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="gap-2">
                    <Icon name="Heart" size={16} />
                    Избранное ({products.filter(p => p.isFavorite).length})
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <Card 
                    key={product.id} 
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-primary/20"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 bg-white/90 backdrop-blur hover:bg-white ${
                          product.isFavorite ? 'text-red-500' : 'text-gray-400'
                        }`}
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Icon name="Heart" size={20} fill={product.isFavorite ? 'currentColor' : 'none'} />
                      </Button>
                      <Badge className={`absolute top-2 left-2 ${marketplaceColors[product.marketplace]} text-white border-0`}>
                        {marketplaceNames[product.marketplace]}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold font-heading text-primary">
                        {product.price}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                        variant="outline"
                        asChild
                      >
                        <a href={product.url} target="_blank" rel="noopener noreferrer">
                          <Icon name="ExternalLink" size={16} className="mr-2" />
                          Перейти на маркетплейс
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
                  <p className="text-muted-foreground">Попробуйте изменить поисковый запрос</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="contact" className="py-16 px-4">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold font-heading mb-4">Свяжитесь с нами</h3>
            <p className="text-muted-foreground">Есть вопросы или предложения? Напишите нам!</p>
          </div>
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Форма обратной связи</CardTitle>
              <CardDescription>Мы ответим в течение 24 часов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя</label>
                <Input placeholder="Ваше имя" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Сообщение</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Расскажите, чем мы можем помочь..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                <Icon name="Send" size={16} className="mr-2" />
                Отправить сообщение
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <footer className="border-t bg-muted/30 py-8 px-4">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <Icon name="ShoppingBag" className="text-white" size={16} />
              </div>
              <span className="font-semibold">МойМаркет © 2024</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Агрегатор товаров с популярных маркетплейсов
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="Mail" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="MessageCircle" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;