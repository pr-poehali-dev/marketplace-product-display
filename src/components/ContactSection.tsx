import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 px-4">
      <div className="container max-w-2xl">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold font-heading mb-4">Свяжитесь с нами</h3>
          <p className="text-muted-foreground">Есть вопросы или предложения? Напишите нам!</p>
        </div>
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Форма обратной связи</CardTitle>
            <CardDescription>Мы ответим в течение 24 часов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Имя</label>
              <Input placeholder="Ваше имя" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Сообщение</label>
              <textarea 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Расскажите, чем мы можем помочь..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg">
              <Icon name="Send" size={16} className="mr-2" />
              Отправить сообщение
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;
