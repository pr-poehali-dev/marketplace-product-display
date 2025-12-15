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
    <section id="home" className="py-12 sm:py-20 px-4">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-primary leading-tight relative">
            Shop Sage <span className="inline-block animate-bounce">🎄</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            ShopSage — это современная онлайн-платформа, предназначенная для предоставления широкого ассортимента товаров и услуг. Сайт ориентирован на удобство пользователей, предлагая интуитивно понятный интерфейс и разнообразные возможности для поиска и приобретения продукции на всех известных маркетплейсах
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-sm sm:text-base"
              />
            </div>
            <Button size="lg" className="h-12 px-6 sm:px-8 w-full sm:w-auto">
              Найти
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap px-4">
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
              <Icon name="Package" size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
              1000+ товаров
            </Badge>
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2">
              <Icon name="Zap" size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
              Быстрый поиск
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;