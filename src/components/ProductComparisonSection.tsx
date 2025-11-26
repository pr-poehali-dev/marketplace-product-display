import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Product } from './ProductCard';

interface ProductComparisonSectionProps {
  products: Product[];
}

const ProductComparisonSection = ({ products }: ProductComparisonSectionProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const availableProducts = products.filter(p => 
    !selectedProducts.find(sp => sp.id === p.id) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToComparison = (product: Product) => {
    if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeFromComparison = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setSelectedProducts([]);
  };

  const marketplaceColors = {
    ozon: 'bg-gray-800',
    wb: 'bg-gray-700',
    yandex: 'bg-gray-600'
  };

  const marketplaceNames = {
    ozon: 'Ozon',
    wb: 'Wildberries',
    yandex: 'Яндекс Маркет'
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      <div className="container">
        <div className="mb-8">
          <h3 className="text-3xl font-bold font-heading mb-2">Сравнение товаров</h3>
          <p className="text-muted-foreground">Выберите до 4 товаров для сравнения</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Поиск товаров</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    placeholder="Искать товары..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {availableProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {searchQuery ? 'Ничего не найдено' : 'Все товары уже добавлены'}
                    </p>
                  ) : (
                    availableProducts.slice(0, 10).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => addToComparison(product)}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.title}</p>
                          <p className="text-xs text-primary font-semibold">{product.price}</p>
                        </div>
                        <Icon name="Plus" size={16} className="text-muted-foreground" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedProducts.length === 0 ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Icon name="Scale" size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-xl font-semibold mb-2">Начните сравнение</h4>
                  <p className="text-muted-foreground">Выберите товары из списка слева</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-sm">
                    Выбрано: {selectedProducts.length} из 4
                  </Badge>
                  <Button variant="outline" size="sm" onClick={clearComparison}>
                    <Icon name="X" size={16} className="mr-2" />
                    Очистить
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedProducts.map((product) => (
                    <Card key={product.id} className="relative overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur hover:bg-white"
                        onClick={() => removeFromComparison(product.id)}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                      <div className="relative">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-2 left-2 ${marketplaceColors[product.marketplace]} text-white border-0`}>
                          {marketplaceNames[product.marketplace]}
                        </Badge>
                      </div>
                      <CardContent className="pt-4 space-y-3">
                        <h4 className="font-semibold line-clamp-2">{product.title}</h4>
                        <div className="text-2xl font-bold text-primary">{product.price}</div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <Button variant="outline" className="w-full" size="sm" asChild>
                          <a href={product.url} target="_blank" rel="noopener noreferrer">
                            <Icon name="ExternalLink" size={14} className="mr-2" />
                            Перейти
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedProducts.length >= 2 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Сравнительная таблица</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-semibold">Параметр</th>
                              {selectedProducts.map((product) => (
                                <th key={product.id} className="text-left py-3 px-4 font-semibold">
                                  {product.title.substring(0, 20)}...
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-3 px-4 text-muted-foreground">Цена</td>
                              {selectedProducts.map((product) => (
                                <td key={product.id} className="py-3 px-4 font-semibold text-primary">
                                  {product.price}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4 text-muted-foreground">Маркетплейс</td>
                              {selectedProducts.map((product) => (
                                <td key={product.id} className="py-3 px-4">
                                  <Badge className={`${marketplaceColors[product.marketplace]} text-white border-0`}>
                                    {marketplaceNames[product.marketplace]}
                                  </Badge>
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-3 px-4 text-muted-foreground">Описание</td>
                              {selectedProducts.map((product) => (
                                <td key={product.id} className="py-3 px-4 text-sm">
                                  {product.description}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 text-muted-foreground">Ссылка</td>
                              {selectedProducts.map((product) => (
                                <td key={product.id} className="py-3 px-4">
                                  <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                    <a href={product.url} target="_blank" rel="noopener noreferrer">
                                      <Icon name="ExternalLink" size={14} className="mr-1" />
                                      Открыть
                                    </a>
                                  </Button>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductComparisonSection;