import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    if (login(loginEmail, loginPassword)) {
      toast({
        title: 'Успешно!',
        description: `Добро пожаловать, ${loginEmail}!`
      });
      setLoginEmail('');
      setLoginPassword('');
      onClose();
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный email или пароль',
        variant: 'destructive'
      });
    }
  };

  const handleRegister = () => {
    if (!registerEmail || !registerPassword || !registerPasswordConfirm) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен быть не менее 6 символов',
        variant: 'destructive'
      });
      return;
    }

    if (registerPassword !== registerPasswordConfirm) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }

    if (register(registerEmail, registerPassword)) {
      toast({
        title: 'Успешно!',
        description: 'Регистрация прошла успешно!'
      });
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterPasswordConfirm('');
      onClose();
    } else {
      toast({
        title: 'Ошибка',
        description: 'Пользователь с таким email уже существует',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Вход в аккаунт</DialogTitle>
          <DialogDescription>
            Войдите в существующий аккаунт или создайте новый
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Введите email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Пароль</Label>
              <Input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Введите пароль"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button onClick={handleLogin}>
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Пароль</Label>
              <Input
                id="register-password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Минимум 6 символов"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password-confirm">Подтвердите пароль</Label>
              <Input
                id="register-password-confirm"
                type="password"
                value={registerPasswordConfirm}
                onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                placeholder="Повторите пароль"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button onClick={handleRegister}>
                <Icon name="UserPlus" size={16} className="mr-2" />
                Создать аккаунт
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;