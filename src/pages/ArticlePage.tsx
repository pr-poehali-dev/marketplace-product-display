import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Article } from '@/components/ArticlesSection';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const articlesData = localStorage.getItem('articles');
    if (articlesData) {
      const articles: Article[] = JSON.parse(articlesData);
      const found = articles.find(a => a.id === Number(id));
      if (found) {
        setArticle(found);
      }
    }
  }, [id]);

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
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к статьям
          </Button>

          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            {article.imageUrl && (
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}
            
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

              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </p>
              </div>

              {article.productLink && (
                <div className="mt-8 pt-6 border-t">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <a href={article.productLink} target="_blank" rel="noopener noreferrer">
                      <Icon name="ExternalLink" size={18} className="mr-2" />
                      {article.linkText || 'Перейти к товару'}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticlePage;
