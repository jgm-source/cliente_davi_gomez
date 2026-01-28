import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { MetricCard } from '@/components/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, ShoppingCart, Settings, RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventCounts {
  leads: number;
  conversions: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<EventCounts>({ leads: 0, conversions: 0 });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  const fetchEventCounts = async () => {
    if (!user) return;

    setIsRefreshing(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch leads count
      const { count: leadsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('event_type', 'lead')
        .eq('status', 'success')
        .gte('created_at', today.toISOString());

      // Fetch conversions count
      const { count: conversionsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('event_type', 'conversion')
        .eq('status', 'success')
        .gte('created_at', today.toISOString());

      setCounts({
        leads: leadsCount || 0,
        conversions: conversionsCount || 0,
      });

      // Check if user has credentials configured
      const { data: credentials } = await supabase
        .from('meta_credentials')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      setHasCredentials(!!credentials);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching event counts:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEventCounts();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchEventCounts, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Acompanhe seus eventos de conversão da Meta
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchEventCounts}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button asChild className="gradient-primary">
              <Link to="/configuracao">
                <Settings className="h-4 w-4 mr-2" />
                Configurar Tokens
              </Link>
            </Button>
          </div>
        </div>

        {/* Date indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Eventos de hoje, {format(new Date(), "dd 'de' MMMM", { locale: ptBR })}
          </span>
          <span className="text-xs">
            • Última atualização: {format(lastUpdate, 'HH:mm:ss')}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <MetricCard
            title="Eventos de Lead"
            value={counts.leads}
            icon={Users}
            description="Total enviados hoje"
            variant="lead"
          />
          <MetricCard
            title="Eventos de Conversão"
            value={counts.conversions}
            icon={ShoppingCart}
            description="Total enviados hoje"
            variant="conversion"
          />
        </div>

        {/* Configuration Alert */}
        {!hasCredentials && (
          <Card className="border-warning/50 bg-warning/5 animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                ⚠️ Configuração Pendente
              </CardTitle>
              <CardDescription>
                Para começar a receber eventos, você precisa configurar suas credenciais da Meta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/configuracao">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Agora
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimos eventos processados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentEvents userId={user?.id} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function RecentEvents({ userId }: { userId?: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRecentEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      setEvents(data || []);
      setLoading(false);
    };

    fetchRecentEvents();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum evento registrado ainda.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              event.status === 'success' ? 'bg-success' : 
              event.status === 'failed' ? 'bg-destructive' : 'bg-warning'
            }`} />
            <div>
              <p className="text-sm font-medium">{event.event_name}</p>
              <p className="text-xs text-muted-foreground">
                {event.event_type === 'lead' ? 'Lead' : 'Conversão'}
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(event.created_at), 'dd/MM HH:mm')}
          </span>
        </div>
      ))}
    </div>
  );
}