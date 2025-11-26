import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import ProductCard, { Product } from './ProductCard';

interface ProductsSectionProps {
  products: Product[];
  filteredProducts: Product[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isEditMode: boolean;
  deleteProductId: number | null;
  setDeleteProductId: (id: number | null) => void;
  newProduct: {
    title: string;
    description: string;
    price: string;
    marketplace: 'ozon' | 'wb' | 'yandex';
    url: string;
    imageUrl: string;
  };
  setNewProduct: (product: any) => void;
  toggleFavorite: (id: number) => void;
  openEditDialog: (product: Product) => void;
  addProduct: () => void;
  deleteProduct: () => void;
  resetForm: () => void;
  openAddDialog: () => void;
}

const ProductsSection = ({
  products,
  filteredProducts,
  activeTab,
  setActiveTab,
  isDialogOpen,
  setIsDialogOpen,
  isEditMode,
  deleteProductId,
  setDeleteProductId,
  newProduct,
  setNewProduct,
  toggleFavorite,
  openEditDialog,
  addProduct,
  deleteProduct,
  resetForm,
  openAddDialog
}: ProductsSectionProps) => {
  return (
    <section id="posts" className="py-16 px-4 bg-gray-50">
      <div className="container">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-3xl font-bold font-heading mb-2">Товары</h3>
              <p className="text-muted-foreground">Найдено товаров: {filteredProducts.length}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading">
                      {isEditMode ? 'Редактировать товар' : 'Добавить новый товар'}
                    </DialogTitle>
                    <DialogDescription>
                      {isEditMode ? 'Измените информацию о товаре' : 'Заполните информацию о товаре с маркетплейса'}
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
                    <Button variant="outline" onClick={resetForm}>
                      Отмена
                    </Button>
                    <Button onClick={addProduct}>
                      <Icon name="Check" size={16} className="mr-2" />
                      {isEditMode ? 'Сохранить изменения' : 'Добавить товар'}
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
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onToggleFavorite={toggleFavorite}
                  onEdit={openEditDialog}
                  onDelete={setDeleteProductId}
                />
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

      <AlertDialog open={deleteProductId !== null} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товар будет удалён из каталога.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ProductsSection;