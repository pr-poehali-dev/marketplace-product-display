import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ComparisonPost {
  id: number;
  title: string;
  description: string;
  products: {
    title: string;
    price: string;
    marketplace: 'ozon' | 'wb' | 'yandex';
    url: string;
    pros: string;
    cons: string;
  }[];
  createdAt: string;
}

const mockPosts: ComparisonPost[] = [
  {
    id: 1,
    title: 'Сравнение беспроводных наушников до 3000₽',
    description: 'Подробное сравнение популярных моделей TWS наушников в бюджетном сегменте',
    products: [
      {
        title: 'Наушники Xiaomi Redmi Buds 4',
        price: '2 490 ₽',
        marketplace: 'ozon',
        url: 'https://ozon.ru',
        pros: 'Отличный звук, долгая работа батареи',
        cons: 'Нет активного шумоподавления'
      },
      {
        title: 'Наушники Haylou GT7',
        price: '2 190 ₽',
        marketplace: 'wb',
        url: 'https://wildberries.ru',
        pros: 'Низкая задержка, хорошая сборка',
        cons: 'Средний басс'
      }
    ],
    createdAt: '2024-11-20'
  }
];

const ComparisonPostsSection = () => {
  const [posts, setPosts] = useState<ComparisonPost[]>(mockPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    products: [
      { title: '', price: '', marketplace: 'ozon' as 'ozon' | 'wb' | 'yandex', url: '', pros: '', cons: '' },
      { title: '', price: '', marketplace: 'wb' as 'ozon' | 'wb' | 'yandex', url: '', pros: '', cons: '' }
    ]
  });

  const addPost = () => {
    if (!newPost.title || !newPost.description || !newPost.products[0].title || !newPost.products[1].title) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    const post: ComparisonPost = {
      id: Math.max(...posts.map(p => p.id), 0) + 1,
      ...newPost,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPosts([post, ...posts]);
    setIsDialogOpen(false);
    setNewPost({
      title: '',
      description: '',
      products: [
        { title: '', price: '', marketplace: 'ozon', url: '', pros: '', cons: '' },
        { title: '', price: '', marketplace: 'wb', url: '', pros: '', cons: '' }
      ]
    });
    toast({
      title: 'Успешно!',
      description: 'Пост со сравнением опубликован'
    });
  };

  const deletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: 'Удалено',
      description: 'Пост со сравнением удалён'
    });
  };

  const sharePost = (postId: number) => {
    const url = `${window.location.origin}/#comparison-post-${postId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Ссылка скопирована!',
      description: 'Поделитесь постом с друзьями'
    });
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
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Посты со сравнениями</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Создавайте детальные сравнения товаров</p>
          </div>
          {isAuthenticated && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать пост
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">Создать пост со сравнением</DialogTitle>
                <DialogDescription>
                  Сравните товары с разных маркетплейсов
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="postTitle">Название поста *</Label>
                  <Input
                    id="postTitle"
                    placeholder="Например: Сравнение смартфонов до 20000₽"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postDescription">Описание *</Label>
                  <Textarea
                    id="postDescription"
                    placeholder="Краткое описание сравнения..."
                    value={newPost.description}
                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="border-t pt-4 space-y-6">
                  <h4 className="font-semibold">Товар 1 *</h4>
                  <div className="grid gap-3">
                    <Input
                      placeholder="Название товара"
                      value={newPost.products[0].title}
                      onChange={(e) => {
                        const products = [...newPost.products];
                        products[0].title = e.target.value;
                        setNewPost({ ...newPost, products });
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Цена"
                        value={newPost.products[0].price}
                        onChange={(e) => {
                          const products = [...newPost.products];
                          products[0].price = e.target.value;
                          setNewPost({ ...newPost, products });
                        }}
                      />
                      <Input
                        placeholder="Ссылка на товар"
                        value={newPost.products[0].url}
                        onChange={(e) => {
                          const products = [...newPost.products];
                          products[0].url = e.target.value;
                          setNewPost({ ...newPost, products });
                        }}
                      />
                    </div>
                    <Input
                      placeholder="Плюсы (через запятую)"
                      value={newPost.products[0].pros}
                      onChange={(e) => {
                        const products = [...newPost.products];
                        products[0].pros = e.target.value;
                        setNewPost({ ...newPost, products });
                      }}
                    />
                    <Input
                      placeholder="Минусы (через запятую)"
                      value={newPost.products[0].cons}
                      onChange={(e) => {
                        const products = [...newPost.products];
                        products[0].cons = e.target.value;
                        setNewPost({ ...newPost, products });
                      }}
                    />
                  </div>

                  <h4 className="font-semibold">Товар 2 *</h4>
                  <div className="grid gap-3">
                    <Input
                      placeholder="Название товара"
                      value={newPost.products[1].title}
                      onChange={(e) => {
                        const products = [...newPost.products];
                        products[1].title = e.target.value;
                        setNewPost({ ...newPost, products });
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Цена"
                        value={newPost.products[1].price}
                        onChange={(e) => {
                          const products = [...newPost.products];
                          products[1].price = e.target.value;
                          setNewPost({ ...newPost, products });
                        }}
                      />
                      <Input
                        placeholder="Ссылка на товар"
                        value={newPost.products[1].url}
                        onChange={(e) => {
                          const products = [...newPost.products];
                          products[1].url = e.target.value;
                          setNewPost({ ...newPost, products });
                        }}
                      />
                    </div>
                    <Input
                      placeholder="Плюсы (через запятую)"
                      value={newPost.products[1].pros}
                      onChange={(e) => {
                        const products = [...newPost.products];
                        products[1].pros = e.target.value;
                        setNewPost({ ...newPost, products });
                      }}
                    />
                    <Input
                      placeholder="Минусы (через запятую)"
                      value={newPost.products[1].cons}
                      onChange={(e) => {
                        const products = [...newPost.products];
                        products[1].cons = e.target.value;
                        setNewPost({ ...newPost, products });
                      }}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={addPost}>
                  <Icon name="Check" size={16} className="mr-2" />
                  Опубликовать пост
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {posts.map((post, index) => (
            <Card 
              key={post.id} 
              id={`comparison-post-${post.id}`}
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl mb-2">{post.title}</CardTitle>
                    <CardDescription className="text-sm">{post.description}</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <Badge variant="secondary" className="text-xs">
                      <Icon name="Calendar" size={14} className="mr-1" />
                      {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                    </Badge>
                    {isAuthenticated && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePost(post.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {post.products.map((product, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-lg">{product.title}</h4>
                        <Badge className={`${marketplaceColors[product.marketplace]} text-white border-0`}>
                          {marketplaceNames[product.marketplace]}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary">{product.price}</div>
                      {product.pros && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <Icon name="Plus" size={16} />
                            Плюсы
                          </div>
                          <p className="text-sm text-muted-foreground">{product.pros}</p>
                        </div>
                      )}
                      {product.cons && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm font-medium text-red-600">
                            <Icon name="Minus" size={16} />
                            Минусы
                          </div>
                          <p className="text-sm text-muted-foreground">{product.cons}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                {post.products.map((product, idx) => (
                  product.url && (
                    <Button key={idx} variant="outline" className="flex-1" asChild>
                      <a href={product.url} target="_blank" rel="noopener noreferrer">
                        <Icon name="ExternalLink" size={16} className="mr-2" />
                        Товар {idx + 1}
                      </a>
                    </Button>
                  )
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => sharePost(post.id)}
                >
                  <Icon name="Share2" size={18} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Нет постов</h3>
            <p className="text-muted-foreground">Создайте первый пост со сравнением товаров</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComparisonPostsSection;