import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 py-8 px-4">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Shop Sage © 2024</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Агрегатор товаров с популярных маркетплейсов
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon">
              <Icon name="Mail" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="MessageCircle" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;