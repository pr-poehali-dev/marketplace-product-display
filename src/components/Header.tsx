import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 flex gap-2 christmas-lights">
        <span className="flex-1 h-full bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
        <span className="flex-1 h-full bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
        <span className="flex-1 h-full bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
        <span className="flex-1 h-full bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></span>
        <span className="flex-1 h-full bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></span>
        <span className="flex-1 h-full bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></span>
        <span className="flex-1 h-full bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '1.8s' }}></span>
        <span className="flex-1 h-full bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '2.1s' }}></span>
        <span className="flex-1 h-full bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '2.4s' }}></span>
        <span className="flex-1 h-full bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '2.7s' }}></span>
      </div>
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