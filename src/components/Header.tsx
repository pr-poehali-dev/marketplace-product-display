import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-heading text-primary">
            Shop Sage
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Главная</a>
          <a href="#posts" className="text-sm font-medium hover:text-primary transition-colors">Посты</a>
          <a href="#favorites" className="text-sm font-medium hover:text-primary transition-colors">Избранное</a>
          <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Icon name="Menu" size={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;