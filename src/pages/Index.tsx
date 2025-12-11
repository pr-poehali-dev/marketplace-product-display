import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/AuthDialog';
import AdminSettings from '@/components/AdminSettings';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductsSection from '@/components/ProductsSection';
import ComparisonPostsSection from '@/components/ComparisonPostsSection';
import ProductComparisonSection from '@/components/ProductComparisonSection';
import ArticlesSection from '@/components/ArticlesSection';
import PromocodesSection from '@/components/PromocodesSection';
import ContactSection from '@/components/ContactSection';
import ContactsSection from '@/components/ContactsSection';
import Footer from '@/components/Footer';
import { Product } from '@/components/ProductCard';
import Icon from '@/components/ui/icon';

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
  const [mainTab, setMainTab] = useState('catalog');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  
  const trackView = (section: string) => {
    const key = `${section}_views`;
    const currentViews = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (currentViews + 1).toString());
  };
  
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

    if (isEditMode && editingProductId) {
      setProducts(products.map(p => 
        p.id === editingProductId 
          ? { 
              ...p, 
              ...newProduct, 
              imageUrl: newProduct.imageUrl || p.imageUrl 
            } 
          : p
      ));
      toast({
        title: 'Успешно!',
        description: 'Товар обновлён'
      });
    } else {
      const product: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...newProduct,
        imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        isFavorite: false
      };
      setProducts([product, ...products]);
      toast({
        title: 'Успешно!',
        description: 'Товар добавлен в каталог'
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setNewProduct({
      title: '',
      description: '',
      price: '',
      marketplace: 'ozon',
      url: '',
      imageUrl: ''
    });
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingProductId(null);
  };

  const openEditDialog = (product: Product) => {
    setNewProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      marketplace: product.marketplace,
      url: product.url,
      imageUrl: product.imageUrl
    });
    setEditingProductId(product.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const deleteProduct = () => {
    if (deleteProductId) {
      setProducts(products.filter(p => p.id !== deleteProductId));
      toast({
        title: 'Удалено',
        description: 'Товар удалён из каталога'
      });
      setDeleteProductId(null);
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'favorites' && product.isFavorite);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AuthDialog isOpen={isLoginDialogOpen} onClose={() => setIsLoginDialogOpen(false)} />
      <AdminSettings isOpen={isAdminSettingsOpen} onClose={() => setIsAdminSettingsOpen(false)} />
      <Header />
      {!isAuthenticated && (
        <div className="fixed top-20 right-4 z-50">
          <Button onClick={() => setIsLoginDialogOpen(true)} size="sm" variant="outline" className="gap-2">
            <Icon name="User" size={16} />
            Войти
          </Button>
        </div>
      )}
      {isAuthenticated && (
        <div className="fixed top-20 right-4 z-50 flex gap-2 items-center">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-md text-sm">
            <Icon name={isAdmin ? "Shield" : "User"} size={16} />
            <span className="font-medium">{user?.email}</span>
            {isAdmin && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Админ</span>}
          </div>
          {isAdmin && (
            <Button onClick={() => setIsAdminSettingsOpen(true)} size="sm" variant="outline" className="gap-2">
              <Icon name="Settings" size={16} />
              <span className="hidden sm:inline">Настройки</span>
            </Button>
          )}
          <Button onClick={logout} size="sm" variant="outline" className="gap-2">
            <Icon name="LogOut" size={16} />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        </div>
      )}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <section className="py-8 px-4">
        <div className="container">
          <Tabs value={mainTab} onValueChange={(value) => {
            setMainTab(value);
            if (value === 'catalog') trackView('catalog');
            if (value === 'articles') trackView('articles');
            if (value === 'promocodes') trackView('promocodes');
            if (value === 'comparison-posts') trackView('comparisons');
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-6 max-w-5xl mx-auto h-auto">
              <TabsTrigger value="catalog" className="gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Icon name="ShoppingBag" size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Каталог</span>
                </div>
                {isAdmin && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Eye" size={10} className="sm:w-3 sm:h-3" />
                    {localStorage.getItem('catalog_views') || '0'}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="articles" className="gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Icon name="Newspaper" size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Статьи</span>
                </div>
                {isAdmin && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Eye" size={10} className="sm:w-3 sm:h-3" />
                    {localStorage.getItem('articles_views') || '0'}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="promocodes" className="gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Icon name="Tag" size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Промокоды</span>
                </div>
                {isAdmin && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Eye" size={10} className="sm:w-3 sm:h-3" />
                    {localStorage.getItem('promocodes_views') || '0'}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="comparison-posts" className="gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm flex flex-col sm:flex-row items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Icon name="FileText" size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Сравнения</span>
                </div>
                {isAdmin && (
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Eye" size={10} className="sm:w-3 sm:h-3" />
                    {localStorage.getItem('comparisons_views') || '0'}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="comparison" className="gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <Icon name="Scale" size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Сравнить</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <Icon name="MessageCircle" size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Контакты</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="mt-0">
              <ProductsSection
                products={products}
                filteredProducts={filteredProducts}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                isEditMode={isEditMode}
                deleteProductId={deleteProductId}
                setDeleteProductId={setDeleteProductId}
                newProduct={newProduct}
                setNewProduct={setNewProduct}
                toggleFavorite={toggleFavorite}
                openEditDialog={openEditDialog}
                addProduct={addProduct}
                deleteProduct={deleteProduct}
                resetForm={resetForm}
                openAddDialog={openAddDialog}
              />
            </TabsContent>

            <TabsContent value="articles" className="mt-0">
              <ArticlesSection />
            </TabsContent>

            <TabsContent value="promocodes" className="mt-0">
              <PromocodesSection />
            </TabsContent>

            <TabsContent value="comparison-posts" className="mt-0">
              <ComparisonPostsSection />
            </TabsContent>

            <TabsContent value="comparison" className="mt-0">
              <ProductComparisonSection products={products} />
            </TabsContent>

            <TabsContent value="contacts" className="mt-0">
              <ContactsSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;