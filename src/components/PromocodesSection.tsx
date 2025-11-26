import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export interface Promocode {
  id: number;
  code: string;
  title: string;
  description: string;
  discount: string;
  marketplace: 'ozon' | 'wb' | 'yandex' | 'all';
  validUntil: string;
  url: string;
}

const mockPromocodes: Promocode[] = [
  {
    id: 1,
    code: 'ELECTRONICS2024',
    title: 'Скидка на электронику',
    description: 'Получите скидку 15% на всю электронику и гаджеты',
    discount: '15%',
    marketplace: 'ozon',
    validUntil: '2024-12-31',
    url: 'https://ozon.ru'
  },
  {
    id: 2,
    code: 'FIRSTORDER',
    title: 'Скидка на первый заказ',
    description: 'Специальное предложение для новых пользователей',
    discount: '500 ₽',
    marketplace: 'wb',
    validUntil: '2024-11-15',
    url: 'https://wildberries.ru'
  }
];

const PromocodesSection = () => {
  const [promocodes, setPromocodes] = useState<Promocode[]>(mockPromocodes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterMarketplace, setFilterMarketplace] = useState<'all' | 'ozon' | 'wb' | 'yandex'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  const { toast } = useToast();

  const [newPromocode, setNewPromocode] = useState({
    code: '',
    title: '',
    description: '',
    discount: '',
    marketplace: 'all' as 'ozon' | 'wb' | 'yandex' | 'all',
    validUntil: '',
    url: ''
  });

  const addPromocode = () => {
    if (!newPromocode.code || !newPromocode.title || !newPromocode.discount) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    const promocode: Promocode = {
      id: Math.max(...promocodes.map(p => p.id), 0) + 1,
      ...newPromocode
    };

    setPromocodes([promocode, ...promocodes]);
    toast({
      title: 'Успешно!',
      description: 'Промокод добавлен'
    });
    resetForm();
  };

  const resetForm = () => {
    setNewPromocode({
      code: '',
      title: '',
      description: '',
      discount: '',
      marketplace: 'all',
      validUntil: '',
      url: ''
    });
    setIsDialogOpen(false);
  };

  const deletePromocode = (promocodeId: number) => {
    setPromocodes(promocodes.filter(promo => promo.id !== promocodeId));
    toast({
      title: 'Удалено',
      description: 'Промокод удалён'
    });
  };

  const copyPromocode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Промокод скопирован!',
      description: `Код ${code} скопирован в буфер обмена`
    });
  };

  const marketplaceColors = {
    ozon: 'bg-gray-800',
    wb: 'bg-gray-700',
    yandex: 'bg-gray-600',
    all: 'bg-gray-900'
  };

  const marketplaceNames = {
    ozon: 'Ozon',
    wb: 'Wildberries',
    yandex: 'Яндекс Маркет',
    all: 'Все маркетплейсы'
  };

  const isPromoExpired = (validUntil: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  const filteredPromocodes = promocodes.filter(promo => {
    const matchesMarketplace = filterMarketplace === 'all' || 
                               promo.marketplace === filterMarketplace || 
                               promo.marketplace === 'all';
    
    const isExpired = isPromoExpired(promo.validUntil);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !isExpired) ||
                         (filterStatus === 'expired' && isExpired);
    
    return matchesMarketplace && matchesStatus;
  });

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-bold font-heading mb-2">Промокоды и скидки</h3>
              <p className="text-muted-foreground">
                Найдено промокодов: {filteredPromocodes.length}
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить промокод
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading">Новый промокод</DialogTitle>
                  <DialogDescription>Добавьте промокод для пользователей</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="promo-code">Промокод *</Label>
                    <Input
                      id="promo-code"
                      placeholder="SALE2024"
                      value={newPromocode.code}
                      onChange={(e) => setNewPromocode({ ...newPromocode, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promo-title">Название *</Label>
                    <Input
                      id="promo-title"
                      placeholder="Скидка на..."
                      value={newPromocode.title}
                      onChange={(e) => setNewPromocode({ ...newPromocode, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promo-description">Описание</Label>
                    <Textarea
                      id="promo-description"
                      placeholder="Условия использования промокода..."
                      value={newPromocode.description}
                      onChange={(e) => setNewPromocode({ ...newPromocode, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-discount">Скидка *</Label>
                      <Input
                        id="promo-discount"
                        placeholder="15% или 500 ₽"
                        value={newPromocode.discount}
                        onChange={(e) => setNewPromocode({ ...newPromocode, discount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promo-marketplace">Маркетплейс</Label>
                      <Select
                        value={newPromocode.marketplace}
                        onValueChange={(value: 'ozon' | 'wb' | 'yandex' | 'all') => 
                          setNewPromocode({ ...newPromocode, marketplace: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все маркетплейсы</SelectItem>
                          <SelectItem value="ozon">Ozon</SelectItem>
                          <SelectItem value="wb">Wildberries</SelectItem>
                          <SelectItem value="yandex">Яндекс Маркет</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promo-valid">Действителен до</Label>
                    <Input
                      id="promo-valid"
                      type="date"
                      value={newPromocode.validUntil}
                      onChange={(e) => setNewPromocode({ ...newPromocode, validUntil: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promo-url">Ссылка на маркетплейс</Label>
                    <Input
                      id="promo-url"
                      type="url"
                      placeholder="https://..."
                      value={newPromocode.url}
                      onChange={(e) => setNewPromocode({ ...newPromocode, url: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetForm}>Отмена</Button>
                  <Button onClick={addPromocode}>
                    <Icon name="Check" size={16} className="mr-2" />
                    Добавить промокод
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterMarketplace} onValueChange={(value: 'all' | 'ozon' | 'wb' | 'yandex') => setFilterMarketplace(value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Маркетплейс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все маркетплейсы</SelectItem>
                <SelectItem value="ozon">Ozon</SelectItem>
                <SelectItem value="wb">Wildberries</SelectItem>
                <SelectItem value="yandex">Яндекс Маркет</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'expired') => setFilterStatus(value)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все промокоды</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="expired">Истёкшие</SelectItem>
              </SelectContent>
            </Select>

            {(filterMarketplace !== 'all' || filterStatus !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterMarketplace('all');
                  setFilterStatus('all');
                }}
              >
                <Icon name="X" size={16} className="mr-2" />
                Сбросить фильтры
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromocodes.map((promo, index) => {
            const isExpired = isPromoExpired(promo.validUntil);
            return (
              <Card 
                key={promo.id}
                className={`overflow-hidden hover:shadow-lg transition-all animate-scale-in border-2 ${isExpired ? 'opacity-60' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{promo.title}</CardTitle>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex gap-1 items-center">
                        <Badge className={`${marketplaceColors[promo.marketplace]} text-white border-0 shrink-0`}>
                          {marketplaceNames[promo.marketplace]}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => deletePromocode(promo.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                      {isExpired && (
                        <Badge variant="destructive" className="shrink-0">
                          Истёк
                        </Badge>
                      )}
                    </div>
                  </div>
                  {promo.description && (
                    <CardDescription className="line-clamp-2">
                      {promo.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-lg border-2 border-dashed">
                    <code className="text-lg font-bold text-primary">{promo.code}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPromocode(promo.code)}
                    >
                      <Icon name="Copy" size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Tag" size={16} />
                      <span className="font-semibold text-primary text-lg">{promo.discount}</span>
                    </div>
                    {promo.validUntil && (
                      <div className={`flex items-center gap-1 text-xs ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Icon name="Calendar" size={14} />
                        <span>до {promo.validUntil}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {promo.url && (
                    <Button className="w-full" variant="outline" asChild disabled={isExpired}>
                      <a href={promo.url} target="_blank" rel="noopener noreferrer">
                        <Icon name="ExternalLink" size={16} className="mr-2" />
                        Перейти на сайт
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredPromocodes.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Tag" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Промокоды не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PromocodesSection;