import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface AdminSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

interface UsersStorage {
  [email: string]: UserData;
}

const AdminSettings = ({ isOpen, onClose }: AdminSettingsProps) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UsersStorage>({});
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = () => {
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');
    setUsers(usersData);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Новый пароль должен быть не менее 6 символов',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }

    if (user?.email === 'admin') {
      toast({
        title: 'Внимание',
        description: 'Пароль главного админа нельзя изменить через интерфейс',
        variant: 'destructive'
      });
      return;
    }

    const userData = users[user?.email || ''];
    if (userData && userData.password === currentPassword) {
      userData.password = newPassword;
      const updatedUsers = { ...users, [user?.email || '']: userData };
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: 'Успешно!',
        description: 'Пароль изменён'
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный текущий пароль',
        variant: 'destructive'
      });
    }
  };

  const toggleUserRole = (email: string) => {
    const userData = users[email];
    if (!userData) return;

    userData.role = userData.role === 'admin' ? 'user' : 'admin';
    const updatedUsers = { ...users, [email]: userData };
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    toast({
      title: 'Успешно!',
      description: `Роль пользователя ${email} изменена на ${userData.role === 'admin' ? 'Администратор' : 'Пользователь'}`
    });
  };

  const deleteUser = (email: string) => {
    const updatedUsers = { ...users };
    delete updatedUsers[email];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    toast({
      title: 'Удалено',
      description: `Пользователь ${email} удалён`
    });
  };

  const usersList = Object.entries(users);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Settings" size={24} />
            Настройки администратора
          </DialogTitle>
          <DialogDescription>
            Управление аккаунтом, пользователями и настройками сайта
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Аккаунт</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Информация об аккаунте</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Роль</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                      {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user?.email !== 'admin' && (
              <Card>
                <CardHeader>
                  <CardTitle>Сменить пароль</CardTitle>
                  <CardDescription>Измените пароль вашего аккаунта</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Текущий пароль</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Новый пароль</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleChangePassword} className="w-full">
                    <Icon name="Key" size={16} className="mr-2" />
                    Изменить пароль
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Опасная зона</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={logout} className="w-full">
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>Всего зарегистрировано: {usersList.length} пользователей</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {usersList.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Нет зарегистрированных пользователей</p>
                ) : (
                  usersList.map(([email, userData]) => (
                    <div key={email} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name={userData.role === 'admin' ? 'Shield' : 'User'} size={20} />
                        <div>
                          <p className="font-medium">{email}</p>
                          <Badge variant={userData.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                            {userData.role === 'admin' ? 'Администратор' : 'Пользователь'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUserRole(email)}
                        >
                          <Icon name={userData.role === 'admin' ? 'UserMinus' : 'UserPlus'} size={16} className="mr-2" />
                          {userData.role === 'admin' ? 'Снять админа' : 'Назначить админом'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(email)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Eye" size={20} />
                    Просмотры каталога
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {localStorage.getItem('catalog_views') || '0'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Eye" size={20} />
                    Просмотры статей
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {localStorage.getItem('articles_views') || '0'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Eye" size={20} />
                    Просмотры промокодов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {localStorage.getItem('promocodes_views') || '0'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="Eye" size={20} />
                    Просмотры сравнений
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {localStorage.getItem('comparisons_views') || '0'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminSettings;