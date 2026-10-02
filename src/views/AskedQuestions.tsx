import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';

const questions: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Nesse monitoramento, vocês identificaram um aumento dessas plataformas clandestinas desde a publicação da MP. Pode explicar qual foi o cenário observado antes e depois da MP?',
    a: (
      <>
        <p>
          Nosso monitoramento contínuo começou em 20 de setembro, cinco dias antes da MP. É uma janela curta para afirmar tendência sobre o tamanho do mercado clandestino, e não vamos afirmar. Dá para medir, com precisão, o que mais importa: o que a MP fez com quem já estava operando fora da lei.
        </p>
        <p>
          Quando a MP foi assinada, às 18h de 25 de setembro, tínhamos 340 casas não autorizadas catalogadas e verificadas. Rechecamos todas depois do anúncio. 329 continuavam no ar. Quinze saíram.
        </p>
        <p>
          Em 27 de setembro, 48 horas depois, o catálogo tinha 693 casas fora de qualquer lista oficial, 627 delas com a página respondendo naquele momento. Entraram 260 depois da MP. Não afirmamos que nasceram depois: parte podia já existir, e nós é que chegamos nela. Não conseguimos datar quando um site clandestino entra em operação. A data de registro do domínio diz quando o endereço foi comprado, quando o registro responde — e um domínio pode ficar anos parado antes de virar casa de apostas. Ela não diz quando o endereço virou plataforma. Um domínio antigo pode ter sido reaproveitado depois. O que publicamos é o cruzamento de três datas: a compra, o primeiro certificado e o dia em que a nossa varredura encontrou o endereço.
        </p>
      </>
    ),
  },
  {
    q: 'Qual a metodologia utilizada para identificar essas plataformas?',
    a: (
      <>
        <p>Quatro etapas automatizadas, em varredura contínua.</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Descoberta.</strong> Cruzamos a lista oficial da SPA/MF com certificados TLS recém-emitidos (Certificate Transparency), lojas de aplicativos, busca aberta, denúncias de usuários e permutação de nomes de marcas conhecidas, procurando o espelho.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Verificação.</strong> Cada domínio é aberto em navegador real, com captura de tela. Como a sonda sai de fora do Brasil, mantemos uma segunda sonda hospedada em São Paulo, para distinguir "site fora do ar" de "site que bloqueia o Brasil".
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Classificação.</strong> Um modelo de linguagem lê o texto da página e responde se é casa de apostas, se mira o Brasil, se alega autorização e qual licença alega. Os casos que chegam ao limiar de publicação passam por uma segunda pergunta, independente, antes de entrar.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Confronto com a fonte oficial.</strong> O status só vale contra a lista da SPA/MF na data. Domínio ou CNPJ que apareça em fonte oficial nunca é marcado como não autorizado, mesmo que os sinais apontem nessa direção.
          </li>
        </ol>
        <p>
          Ficam de fora página de indicação, comparador, domínio à venda e o mesmo site repetido em vários endereços. Dois limites que fazemos questão de declarar: não é inventário exaustivo, é varredura ativa — existe site que não encontramos. E "não autorizada" é observação factual, não juízo jurídico: significa que o domínio não consta nas listas oficiais consultadas naquela data. Em 27 de setembro, 118 casos aguardavam revisão humana antes de qualquer publicação. Na ficha de cada site, três datas ficam lado a lado: quando o domínio foi comprado, quando apareceu o primeiro certificado de segurança e quando o BetLegal detectou o endereço. Nenhuma delas é a data em que o site foi criado ou publicado.
        </p>
      </>
    ),
  },
  {
    q: 'Segundo o monitoramento, embora tenha aumentado o número de sites clandestinos, não houve atualização de novos bloqueios. Na avaliação de vocês, por que isso ocorre?',
    a: (
      <>
        <p>
          <strong style={{ color: 'var(--color-text-primary)' }}>De onde vem o número.</strong> A Secretaria de Prêmios e Apostas informou 57.691 endereços encaminhados à Anatel em 2026 até 22 de setembro, sendo 10.590 só em setembro — o maior volume mensal da série. Esse número não é medição nossa, e não conseguimos auditá-lo. Só existe uma lista de bloqueio publicada na íntegra: a de 11 de outubro de 2024, com 2.027 endereços, processo 53500.082450/2024-13. Ela virou arquivo público por acidente — o sistema interno da Anatel estava fora do ar e a planilha foi publicada como PDF no site. Todas as remessas seguintes correm sob sigilo administrativo, para que o operador não identifique qual domínio caiu e suba o espelho no mesmo dia. É por isso que o número de bloqueadas no site não se move com as remessas novas: ele reflete a única lista auditável que existe.
        </p>
        <p>
          <strong style={{ color: 'var(--color-text-primary)' }}>Como esses bloqueios eram alimentados.</strong> Uma parcela grande dos bloqueios dos últimos dois anos não nasceu de varredura do Estado: nasceu de denúncia das próprias casas autorizadas. A operadora identifica o clone que copia sua marca, monta o dossiê e pede o takedown — em geral por meio de consultorias de segurança, como a Iron Security, que é onde este monitoramento nasceu. O interesse era direto: cada clone desviava depósito e queimava a marca de quem pagava outorga.
        </p>
        <p>
          <strong style={{ color: 'var(--color-text-primary)' }}>O que mudou.</strong> Depois da MP, esse fluxo praticamente parou, por dois motivos que se somam. Primeiro, a operadora autorizada perdeu o incentivo e a própria legitimidade para pedir a derrubada de um clone de uma marca que a MP acabou de colocar na ilegalidade. Segundo, a velocidade de surgimento dos novos sites tornou o trabalho caso a caso inviável — não se derruba no varejo o que sobe no atacado.
        </p>
        <p>
          O resultado é que o Estado perdeu, de uma vez, o principal alimentador da sua fila de bloqueios, exatamente quando a demanda por bloqueio aumenta.
        </p>
      </>
    ),
  },
  {
    q: 'Algumas dessas plataformas espelham o formato de sites que antes da MP eram legalizados. Quais são as características que vocês têm identificado dessas plataformas?',
    a: (
      <>
        <p>
          De 657 domínios classificados, a característica mais relevante é a imitação do formato regulatório.
        </p>
        <p>
          Um quarto afirma ser autorizado: 162 sites. Desses, 64 exibem um número de portaria da SPA/MF e 46 exibem um CNPJ no rodapé. Copiam exatamente o elemento que o apostador foi ensinado a procurar para se sentir seguro.
        </p>
        <p>
          Outro quarto apela à licença estrangeira: 171 sites citam Curaçao, Malta e jurisdições semelhantes. Isso não tem efeito no Brasil. A Lei 14.790 exige outorga federal brasileira, e licença de outro país não substitui. Mas funciona como verniz de legitimidade.
        </p>
        <p>
          63% miram o brasileiro de forma inequívoca: 412 sites em português, com Pix e valores em real.
        </p>
      </>
    ),
  },
  {
    q: 'Por que no painel existem números diferentes sobre as casas não autorizadas?',
    a: (
      <>
        <p>
          O painel apresenta as informações de formas diferentes para os sites sem autorização. Os números 627, 693, 66 e 64 não medem a mesma coisa. São os de 27 de setembro de 2026.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>693</strong> é o total de sites que o Radar encontrou operando fora de qualquer lista oficial. É o ponto do gráfico em 27 de setembro.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>627</strong> é quantos desses 693 ainda estavam com a página no ar. O card "Não autorizadas — online" conta só esses.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>66</strong> (693 menos 627) são sites já detectados cuja página não respondia, ou que ainda não tinham passado por uma checagem conclusiva. A data da descoberta não entra nessa conta: o site pode ter sido encontrado em qualquer dia desde o início da coleta.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>64</strong> é o quanto o estoque de detectadas cresceu de 26 para 27 de setembro. No dia 26 havia 629; no dia 27, 693. O card "Não autorizadas — detectadas hoje", naquela data, registrava esse saldo do dia. Se algum site saiu da lista no mesmo dia, por exemplo porque passou a constar em bloqueio, essa saída já estava descontada nos 64.
          </li>
        </ul>
        <p>
          Depois de 27 de setembro, o card "Não autorizadas — detectadas hoje" passou a contar a primeira identificação de cada domínio no dia, e não mais o saldo entre um dia e o outro.
        </p>
      </>
    ),
  },
  {
    q: 'Como o painel acha os sites, e dá para saber se nasceram depois da MP?',
    a: (
      <>
        <p style={{ color: 'var(--color-text-tertiary)' }}>Resposta de 29 de setembro de 2026.</p>
        <p>
          O painel não fica olhando "domínio comprado agora". Ele procura casas de apostas na internet e, para cada uma, anota três datas diferentes. As três aparecem na ficha do site.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Detectado pelo BetLegal em.</strong> É o dia em que a nossa varredura encontrou aquele endereço. O 543 é essa data: sites que publicamos pela primeira vez entre as 18h de sexta (25/09) e a tarde de segunda (28/09). Uma hora depois do anúncio eram 41. No sábado, 292.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Domínio registrado em.</strong> É o dia em que alguém comprou o endereço, no cartório da internet. Um domínio pode ficar anos parado, sem site nenhum, e só depois virar casa de apostas.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Primeiro certificado de segurança.</strong> É o dia em que o site passou a abrir com o cadeado do navegador. É o indício mais próximo de "entrou no ar". Essa data falta em boa parte das fichas, porque a fonte que a fornece limita a consulta.
          </li>
        </ul>
        <p>
          Dá para separar "já existia" de "foi comprado depois da MP", site a site, quando o cartório do domínio responde. Olhando em 29/09 os sites que o BetLegal viu pela primeira vez a partir das 18h de sexta, são 486. Em 322 o cartório informou a data de compra:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>320</strong> já tinham sido comprados antes da MP. Quando os encontramos, o endereço tinha, em média, uns dez meses. Há casos bem mais antigos: 7a.com foi comprado em 1997 e só entrou na nossa lista em 28/09/2026. parimatch.com foi comprado em 2000 e apareceu para nós no mesmo dia 28.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>2</strong> foram comprados depois da MP: apostamaxbet.com e jogao.online, os dois no sábado, 26/09.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>164</strong> ficaram sem essa data. O cartório não respondeu. Nesses, não dá para afirmar.
          </li>
        </ul>
        <p>O caminho até a ficha é simples, e é por isso que o número é menor do que o universo de endereços que existem:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Um robô procura candidatos: certificados novos com nome de aposta, variações de marcas conhecidas, busca aberta, lojas de aplicativo e denúncias.</li>
          <li>Outro abre a página de verdade e tira um print.</li>
          <li>Um leitor automático decide se aquilo é a casa de apostas em si. Página de indicação, comparador ou domínio à venda fica de fora.</li>
          <li>O endereço é confrontado com a lista oficial da SPA/MF. Se estiver lá, não entra como não autorizado.</li>
        </ol>
        <p>
          Saber quando o endereço foi comprado não diz quando ele virou casa de apostas. Um domínio antigo pode ter sido reaproveitado depois da MP. O painel mostra as três datas lado a lado para o leitor não confundir "nós vimos agora" com "nasceu agora".
        </p>
      </>
    ),
  },
  {
    q: 'Por que o BNLData fala em 6,4 mil e o BetLegal em 543?',
    a: (
      <>
        <p style={{ color: 'var(--color-text-tertiary)' }}>Resposta de 29 de setembro de 2026.</p>
        <p>
          São duas contagens diferentes, em períodos diferentes. Sem a lista do outro levantamento, não dá para cruzar endereço por endereço. Dá para explicar por que os totais não se encontram.
        </p>
        <p>
          O 6.401 soma a semana inteira, de 22 a 28/09: 95, 94, 292, 310, 1.692, 3.024 e 894 até as 14h54 de segunda. O 543 só começa às 18h de sexta e para na tarde de segunda. A diferença de calendário existe, mas é pequena. Mesmo olhando só sábado, domingo e a manhã de segunda, o outro número continua na casa dos 5,6 mil.
        </p>
        <p>
          O que muda o tamanho é o que entra na conta. No BetLegal, o site precisa ser aberto, reconhecido como a própria casa de apostas e conferido contra a lista oficial antes de ser publicado. Ficam de fora domínio à venda, página que só indica outra casa, o mesmo site repetido em vários endereços, o que a varredura não alcançou e o que ainda espera revisão humana. Em 27/09 havia 118 casos nessa fila. A varredura não percorre todos os domínios do mundo. Há site que não encontramos.
        </p>
        <p>O calendário da semana mostra que as duas séries não sobem juntas:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Sábado:</strong> 1.692 no outro levantamento, 327 no BetLegal.
          </li>
          <li>
            <strong style={{ color: 'var(--color-text-primary)' }}>Domingo:</strong> 3.024 de um lado, 76 do outro. No BetLegal, esses 76 saíram quase todos de madrugada, no ritmo da fila de verificação.
          </li>
        </ul>
        <p>
          Uma conta que no domingo multiplica para 3 mil, enquanto a outra publica 76, está registrando outro acontecimento.
        </p>
        <p>
          A data de compra dos nossos próprios sites aponta na mesma direção. Na lista publicada pelo BetLegal, só 14 endereços foram comprados entre 22 e 28/09. Só 2, depois das 18h de sexta. Se os 6,4 mil forem endereços novos que parecem aposta, ou endereços vistos pela primeira vez antes de alguém abrir a página, a maior parte nunca chegou à lista que publicamos.
        </p>
        <p>
          Um limite nosso, para a comparação ficar honesta: o monitoramento contínuo começou em 20/09. Não temos a média de agosto que o outro levantamento usa, e não estimamos o tamanho do mercado clandestino com poucos dias de coleta.
        </p>
      </>
    ),
  },
];

export const AskedQuestions: React.FC = () => (
  <GlassCard className="p-6 sm:p-8" as="section">
    <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
      Perguntas que já nos fizeram
    </h2>
    <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
      As cinco primeiras respostas são de 27 de setembro de 2026. As duas últimas, de 29 de setembro. Os números valem para a data de cada resposta.
    </p>
    <div className="mt-5 border-t" style={{ borderColor: 'var(--color-card-border)' }}>
      {questions.map((item, index) => (
        <details
          key={item.q}
          className="group py-1 border-b"
          style={{ borderColor: 'var(--color-card-border)' }}
          open={index === 0}
        >
          <summary
            className="cursor-pointer list-none py-4 text-sm font-semibold flex items-start justify-between gap-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span>{item.q}</span>
            <span className="shrink-0 text-xs font-medium group-open:hidden" style={{ color: 'var(--color-text-tertiary)' }}>Mostrar</span>
            <span className="shrink-0 text-xs font-medium hidden group-open:inline" style={{ color: 'var(--color-text-tertiary)' }}>Ocultar</span>
          </summary>
          <div className="pb-5 space-y-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {item.a}
          </div>
        </details>
      ))}
    </div>
  </GlassCard>
);
