import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/icon';

export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  imageUrl: string;
  productLink?: string;
  linkText?: string;
  createdAt: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Как выбрать беспроводные наушники в 2024 году',
    content: 'Беспроводные наушники стали неотъемлемой частью нашей жизни. В этой статье разберём ключевые характеристики, на которые стоит обратить внимание при выборе: качество звука, время работы, удобство посадки и дополнительные функции вроде шумоподавления.',
    author: 'Admin',
    tags: ['Наушники', 'Гайды', 'Электроника'],
    imageUrl: 'https://images.unsplash.com/photo-1590658165737-15a047b7a0b5?w=800&h=400&fit=crop',
    createdAt: '2024-11-20'
  }
];

const ArticlesSection = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('articles');
    return saved ? JSON.parse(saved) : mockArticles;
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
    imageUrl: '',
    productLink: '',
    linkText: ''
  });

  const addArticle = () => {
    if (!newArticle.title || !newArticle.content || !newArticle.author) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    if (isEditMode && editingArticleId) {
      const updatedArticles = articles.map(a => 
        a.id === editingArticleId 
          ? {
              ...a,
              title: newArticle.title,
              content: newArticle.content,
              author: newArticle.author,
              tags: newArticle.tags.split(',').map(t => t.trim()).filter(t => t),
              imageUrl: newArticle.imageUrl || a.imageUrl,
              productLink: newArticle.productLink,
              linkText: newArticle.linkText
            }
          : a
      );
      setArticles(updatedArticles);
      localStorage.setItem('articles', JSON.stringify(updatedArticles));
      toast({
        title: 'Успешно!',
        description: 'Статья обновлена'
      });
    } else {
      const article: Article = {
        id: Math.max(...articles.map(a => a.id), 0) + 1,
        title: newArticle.title,
        content: newArticle.content,
        author: newArticle.author,
        tags: newArticle.tags.split(',').map(t => t.trim()).filter(t => t),
        imageUrl: newArticle.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop',
        productLink: newArticle.productLink,
        linkText: newArticle.linkText,
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedArticles = [article, ...articles];
      setArticles(updatedArticles);
      localStorage.setItem('articles', JSON.stringify(updatedArticles));
      toast({
        title: 'Успешно!',
        description: 'Статья опубликована'
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setNewArticle({
      title: '',
      content: '',
      author: '',
      tags: '',
      imageUrl: '',
      productLink: '',
      linkText: ''
    });
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingArticleId(null);
  };

  const openEditDialog = (article: Article) => {
    setNewArticle({
      title: article.title,
      content: article.content,
      author: article.author,
      tags: article.tags.join(', '),
      imageUrl: article.imageUrl,
      productLink: article.productLink || '',
      linkText: article.linkText || ''
    });
    setEditingArticleId(article.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const deleteArticle = (articleId: number) => {
    const updatedArticles = articles.filter(article => article.id !== articleId);
    setArticles(updatedArticles);
    localStorage.setItem('articles', JSON.stringify(updatedArticles));
    toast({
      title: 'Удалено',
      description: 'Статья удалена'
    });
  };

  const shareArticle = (articleId: number) => {
    const url = `${window.location.origin}/#article-${articleId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Ссылка скопирована!',
      description: 'Поделитесь статьёй с друзьями'
    });
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Статьи о товарах</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Полезные обзоры и советы по выбору товаров</p>
          </div>
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить статью
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">
                  {isEditMode ? 'Редактировать статью' : 'Новая статья'}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode ? 'Измените информацию о статье' : 'Создайте статью о товаре или категории'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="article-title">Заголовок *</Label>
                  <Input
                    id="article-title"
                    placeholder="Как выбрать..."
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-content">Текст статьи *</Label>
                  <Textarea
                    id="article-content"
                    placeholder="Основной текст статьи..."
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-author">Автор *</Label>
                  <Input
                    id="article-author"
                    placeholder="Ваше имя"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-tags">Теги (через запятую)</Label>
                  <Input
                    id="article-tags"
                    placeholder="Наушники, Гайды, Электроника"
                    value={newArticle.tags}
                    onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-image">Ссылка на изображение</Label>
                  <Input
                    id="article-image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newArticle.imageUrl}
                    onChange={(e) => setNewArticle({ ...newArticle, imageUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-link">Ссылка на товар/сайт (опционально)</Label>
                  <Input
                    id="article-link"
                    type="url"
                    placeholder="https://example.com/product"
                    value={newArticle.productLink}
                    onChange={(e) => setNewArticle({ ...newArticle, productLink: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-link-text">Текст кнопки ссылки (опционально)</Label>
                  <Input
                    id="article-link-text"
                    placeholder="Перейти к товару"
                    value={newArticle.linkText}
                    onChange={(e) => setNewArticle({ ...newArticle, linkText: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Если не указано, будет "Перейти к товару"
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>Отмена</Button>
                <Button onClick={addArticle}>
                  <Icon name="Check" size={16} className="mr-2" />
                  {isEditMode ? 'Сохранить изменения' : 'Опубликовать'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <Card 
              key={article.id} 
              id={`article-${article.id}`}
              className="overflow-hidden hover:shadow-lg transition-all animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/article/${article.id}`)}
            >
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareArticle(article.id);
                      }}
                    >
                      <Icon name="Share2" size={18} />
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(article);
                          }}
                        >
                          <Icon name="Pencil" size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteArticle(article.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="User" size={14} />
                  <span>{article.author}</span>
                  <span>•</span>
                  <Icon name="Calendar" size={14} />
                  <span>{article.createdAt}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-3 text-base">
                  {article.content}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-16">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Статей пока нет</h3>
            <p className="text-muted-foreground">Создайте первую статью о товаре</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;