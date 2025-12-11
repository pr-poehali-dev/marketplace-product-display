import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ContactsSection = () => {
  const handleTelegramClick = () => {
    window.open('https://t.me/ShopSage', '_blank');
  };

  return (
    <div className="container py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageCircle" size={24} />
            Контакты
          </CardTitle>
          <CardDescription>
            Свяжитесь с нами через Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Присоединяйтесь к нашему Telegram-каналу</h3>
              <p className="text-muted-foreground">
                Получайте актуальные новости о товарах, эксклюзивные промокоды и советы по выбору продуктов
              </p>
            </div>
            <Button 
              onClick={handleTelegramClick} 
              size="lg"
              className="gap-2"
            >
              <Icon name="Send" size={20} />
              Перейти в Telegram
            </Button>
            <p className="text-sm text-muted-foreground">
              @ShopSage
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsSection;
