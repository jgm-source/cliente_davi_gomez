import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Save, Copy, Check, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Credentials {
  id?: number;
  pixel_id: string;
  page_id: string;
  access_token: string;
}

export default function Configuracao() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [credentials, setCredentials] = useState<Credentials>({
    pixel_id: '',
    page_id: '',
    access_token: '',
  });
  const [showToken, setShowToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [credentialsId, setCredentialsId] = useState<number | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [linkInstrucao, setLinkInstrucao] = useState<string>('');

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      // Buscar credenciais da tabela credenciais (pegar o primeiro registro)
      const { data, error } = await supabase
        .from('credenciais')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setCredentials({
          pixel_id: data.pixel_id?.toString() || '',
          page_id: data.page_id?.toString() || '',
          access_token: data.access_token || '',
        });
        setWebhookUrl(data.webhook || '');
        setLinkInstrucao(data.link_instrucao || '');
        setCredentialsId(data.id);
      }
    } catch (error: any) {
      console.error('Erro ao buscar credenciais:', error);
    }
  };

  const handleSave = async () => {
    if (!credentials.pixel_id || !credentials.access_token) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Pixel ID e Access Token são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      if (credentialsId) {
        // Atualizar credenciais existentes
        const { error } = await supabase
          .from('credenciais')
          .update({
            pixel_id: parseFloat(credentials.pixel_id),
            page_id: credentials.page_id ? parseFloat(credentials.page_id) : null,
            access_token: credentials.access_token,
          })
          .eq('id', credentialsId);

        if (error) throw error;
      } else {
        // Inserir novas credenciais
        const { data, error } = await supabase
          .from('credenciais')
          .insert({
            pixel_id: parseFloat(credentials.pixel_id),
            page_id: credentials.page_id ? parseFloat(credentials.page_id) : null,
            access_token: credentials.access_token,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setCredentialsId(data.id);
      }

      toast({
        title: 'Salvo com sucesso!',
        description: 'Suas credenciais foram atualizadas.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyAccessToken = () => {
    if (credentials.access_token) {
      navigator.clipboard.writeText(credentials.access_token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
      toast({
        title: 'Copiado!',
        description: 'Access Token copiado para a área de transferência.',
      });
    }
  };

  const copyWebhook = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
      toast({
        title: 'Copiado!',
        description: 'Webhook URL copiado para a área de transferência.',
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuração</h1>
          <p className="text-muted-foreground">
            Configure suas credenciais da Meta e webhook
          </p>
        </div>

        {/* Meta Credentials Card */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="gradient-primary p-2 rounded-lg">
                <LinkIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              Credenciais da Meta
            </CardTitle>
            <CardDescription>
              Configure seu Pixel ID e Access Token para enviar eventos de conversão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pixel_id">Pixel ID *</Label>
              <Input
                id="pixel_id"
                placeholder="Ex: 123456789012345"
                value={credentials.pixel_id}
                onChange={(e) => setCredentials({ ...credentials, pixel_id: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="page_id">Page ID (opcional)</Label>
              <Input
                id="page_id"
                placeholder="Ex: 123456789012345"
                value={credentials.page_id}
                onChange={(e) => setCredentials({ ...credentials, page_id: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access_token">Access Token *</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="access_token"
                    type={showToken ? 'text' : 'password'}
                    placeholder="EAAxxxxxxxxxx..."
                    value={credentials.access_token}
                    onChange={(e) => setCredentials({ ...credentials, access_token: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={copyAccessToken}
                  disabled={!credentials.access_token}
                  className="shrink-0"
                >
                  {copiedToken ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={isSaving} className="gradient-primary">
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Webhook URL Card - Somente Leitura */}
        {webhookUrl && (
          <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle>Webhook Configurado</CardTitle>
              <CardDescription>
                URL do webhook configurada no banco de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="font-mono text-sm bg-muted cursor-not-allowed"
                  />
                  <Button variant="outline" onClick={copyWebhook}>
                    {copiedWebhook ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Este campo é gerenciado diretamente no banco de dados
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Link de Instruções - Somente Leitura */}
        {linkInstrucao && (
          <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle>Link de Instruções</CardTitle>
              <CardDescription>
                Acesse o guia de configuração e uso do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={linkInstrucao}
                    readOnly
                    className="font-mono text-sm bg-muted cursor-not-allowed"
                  />
                </div>
                <a
                  href={linkInstrucao}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" className="w-full sm:w-auto">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Abrir Instruções
                  </Button>
                </a>
                <p className="text-xs text-muted-foreground">
                  Este link é gerenciado diretamente no banco de dados
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
