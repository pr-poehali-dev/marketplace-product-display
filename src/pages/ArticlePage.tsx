import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Article } from '@/components/ArticlesSection';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import ArticleComments from '@/components/ArticleComments';
import { generateFingerprint, getAdminFingerprint } from '@/utils/fingerprint';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    loadArticle();
    trackPageVisit();
  }, [id]);

  const trackPageVisit = async () => {
    try {
      const visitorFingerprint = generateFingerprint();
      const adminFingerprint = getAdminFingerprint();
      
      await fetch('https://functions.poehali.dev/a8d029f8-e71d-46d6-92e2-4268e73be8cd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_path: `/article/${id}`,
          visitor_fingerprint: visitorFingerprint,
          admin_fingerprint: adminFingerprint
        })
      });
    } catch (error) {
      console.error('Failed to track visit:', error);
    }
  };

  const loadArticle = () => {
    const articlesData = localStorage.getItem('articles');
    if (articlesData) {
      const articles: Article[] = JSON.parse(articlesData);
      const found = articles.find(a => a.id === Number(id));
      if (found) {
        setArticle(found);
        setEditedContent(found.content);
      }
    }
  };

  const handleSave = () => {
    if (!article) return;

    const articlesData = localStorage.getItem('articles');
    if (articlesData) {
      const articles: Article[] = JSON.parse(articlesData);
      const updatedArticles = articles.map(a =>
        a.id === article.id ? { ...a, content: editedContent } : a
      );
      localStorage.setItem('articles', JSON.stringify(updatedArticles));
      setArticle({ ...article, content: editedContent });
      setIsEditing(false);
      toast({
        title: 'Успешно!',
        description: 'Статья обновлена'
      });
    }
  };

  const handleCancel = () => {
    setEditedContent(article?.content || '');
    setIsEditing(false);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <div className="container py-16 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Статья не найдена</h1>
            <Button onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Вернуться на главную
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <article className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад к статьям
            </Button>
            {isAdmin && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      <Icon name="X" size={16} className="mr-2" />
                      Отмена
                    </Button>
                    <Button onClick={handleSave}>
                      <Icon name="Check" size={16} className="mr-2" />
                      Сохранить
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Icon name="Pencil" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            
            <div className="p-6 md:p-8">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={16} />
                    <span>{new Date(article.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="mt-6">
                  <RichTextEditor
                    content={editedContent}
                    onChange={setEditedContent}
                    placeholder="Редактируйте статью..."
                  />
                </div>
              ) : (
                <div 
                  className="prose prose-lg max-w-none mt-6"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              )}
            </div>
          </div>

          {/* Комментарии и лайки */}
          <div className="mt-8">
            <ArticleComments articleId={article.id} isAdmin={isAdmin} />
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticlePage;