import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  variant?: 'default' | 'lead' | 'conversion';
}

export function MetricCard({ title, value, icon: Icon, description, variant = 'default' }: MetricCardProps) {
  const variantStyles = {
    default: 'border-border',
    lead: 'border-l-4 border-l-primary',
    conversion: 'border-l-4 border-l-success',
  };

  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    lead: 'bg-primary/10 text-primary',
    conversion: 'bg-success/10 text-success',
  };

  return (
    <Card className={cn('animate-slide-up', variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value.toLocaleString('pt-BR')}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn('p-3 rounded-xl', iconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}