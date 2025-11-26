import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  return (
    <section id="home" className="py-20 px-4">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold font-heading text-primary leading-tight">
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
            <Button size="lg" className="h-12 px-8">
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
  );
};

export default HeroSection;