import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Icon from './ui/icon';
import { getAdminFingerprint } from '@/utils/fingerprint';

const ANALYTICS_API = 'https://functions.poehali.dev/a8d029f8-e71d-46d6-92e2-4268e73be8cd';

interface PageStat {
  page_path: string;
  unique_visitors: number;
  last_visit: string | null;
}

export const AnalyticsPanel = () => {
  const [stats, setStats] = useState<PageStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const adminFingerprint = getAdminFingerprint();
      const response = await fetch(
        `${ANALYTICS_API}?admin_fingerprint=${adminFingerprint}`
      );
      const data = await response.json();
      setStats(data.stats || []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalVisitors = () => {
    const uniqueVisitors = new Set(stats.map(s => s.unique_visitors));
    return Array.from(uniqueVisitors).reduce((sum, count) => sum + count, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="TrendingUp" size={24} />
          Статистика посещений
        </CardTitle>
        <CardDescription>
          Уникальные посетители (без учета вас как админа)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={32} className="mx-auto animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Загрузка статистики...</p>
          </div>
        ) : stats.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Пока нет посетителей</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Общая статистика */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Всего уникальных посетителей:</span>
                <span className="text-2xl font-bold text-primary">{getTotalVisitors()}</span>
              </div>
            </div>

            {/* Статистика по страницам */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">По страницам:</h4>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{stat.page_path}</p>
                    {stat.last_visit && (
                      <p className="text-xs text-muted-foreground">
                        Последнее посещение:{' '}
                        {new Date(stat.last_visit).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Icon name="Users" size={16} />
                    <span className="font-bold">{stat.unique_visitors}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsPanel;
