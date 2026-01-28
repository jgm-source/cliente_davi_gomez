import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExternalLink } from 'lucide-react';

export function WebhookInstructions() {
  return (
    <div className="mt-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="instructions" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium hover:no-underline">
            📋 Como configurar o Webhook na sua plataforma
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pb-4">
            {/* BRAIP Instructions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                ▶️ BRAIP
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
                <li>No painel da Braip, localize a barra lateral roxa</li>
                <li>Clique em <strong>"Ferramentas"</strong></li>
                <li>Em seguida, clique em <strong>"Webhook/Postback"</strong></li>
                <li>Na tela de configuração:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li><strong>Nome:</strong> Defina qualquer nome de sua preferência</li>
                    <li><strong>URL do Webhook:</strong> Cole a URL copiada acima</li>
                    <li><strong>Evento:</strong> Selecione "Pagamento Aprovado/Concluído"</li>
                    <li><strong>Produto:</strong> Selecione o produto que está rodando ou deixe "Todos"</li>
                    <li><strong>Método:</strong> Verifique se está em POST</li>
                  </ul>
                </li>
                <li>Clique em <strong>"Salvar"</strong></li>
              </ol>
              <a
                href="https://youtu.be/zr_dEmEsx88?si=H15_17ZZLsnn06vT"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                🎥 Vídeo tutorial - Braip
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* PAYT Instructions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                ▶️ PAYT
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
                <li>No painel da Payt, localize a barra superior</li>
                <li>Clique em <strong>"Marketing"</strong></li>
                <li>Em seguida, clique em <strong>"Webhook/Postback"</strong></li>
                <li>Na tela de configuração:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li><strong>Nome:</strong> Defina qualquer nome de sua preferência</li>
                    <li><strong>URL do Webhook:</strong> Cole a URL copiada acima</li>
                    <li><strong>Versão:</strong> Selecione "PaytV1"</li>
                    <li><strong>Evento:</strong> Selecione "Pagamento Aprovado/Concluído"</li>
                    <li><strong>Produto:</strong> Selecione o produto que está rodando ou "Todos"</li>
                    <li><strong>Método:</strong> Verifique se está em POST</li>
                  </ul>
                </li>
                <li>Clique em <strong>"Salvar"</strong></li>
              </ol>
              <a
                href="https://youtu.be/eMF-2AgTc4Y?si=twZMjuU2Wq1IA3je"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                🎥 Vídeo tutorial - Payt
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}