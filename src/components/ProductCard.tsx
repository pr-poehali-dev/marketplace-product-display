import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  marketplace: 'ozon' | 'wb' | 'yandex';
  url: string;
  imageUrl: string;
  isFavorite: boolean;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onToggleFavorite: (id: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductCard = ({ product, index, onToggleFavorite, onEdit, onDelete }: ProductCardProps) => {
  const { isAdmin } = useAuth();
  
  const marketplaceColors = {
    ozon: 'bg-gray-800',
    wb: 'bg-gray-700',
    yandex: 'bg-gray-600'
  };

  const marketplaceNames = {
    ozon: 'Ozon',
    wb: 'Wildberries',
    yandex: 'Яндекс Маркет'
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-primary/20"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`bg-white/90 backdrop-blur hover:bg-white ${
              product.isFavorite ? 'text-red-500' : 'text-gray-400'
            }`}
            onClick={() => onToggleFavorite(product.id)}
          >
            <Icon name="Heart" size={20} fill={product.isFavorite ? 'currentColor' : 'none'} />
          </Button>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/90 backdrop-blur hover:bg-white"
                >
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Icon name="Pencil" size={16} className="mr-2" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(product.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Badge className={`absolute top-2 left-2 ${marketplaceColors[product.marketplace]} text-white border-0`}>
          {marketplaceNames[product.marketplace]}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-heading text-primary">
          {product.price}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
          variant="outline"
          asChild
        >
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            <Icon name="ExternalLink" size={16} className="mr-2" />
            Перейти на маркетплейс
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;