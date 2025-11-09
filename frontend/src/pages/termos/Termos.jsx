import React from 'react';
import './Termos.css';

function Termos() {
  return (
    <div className="termos-page">
      <header className="termos-header">
        <div className="header-logo">
          <img src="/images/logo-nextis-hm.svg" alt="NexTIS" />
        </div>
      </header>

      <div className="termos-container">
        <h1>Termos de Uso e Política de Privacidade</h1>
        
        <div className="termos-content">
          <section className="termos-section">
            <h2>1. Termos de Uso</h2>
            <p>
              Bem-vindo aos nossos serviços. Ao acessar e utilizar nossos serviços, você concorda com estes termos de uso.
            </p>
            
            <h3>1.1. Uso dos Serviços</h3>
            <p>
              Você concorda em utilizar nossos serviços apenas para fins legais e de acordo com estes Termos. Você não pode:
            </p>
            <ul>
              <li>Utilizar nossos serviços de qualquer maneira que viole leis ou regulamentos aplicáveis;</li>
              <li>Enviar conteúdo falso, enganoso ou fraudulento;</li>
              <li>Acessar ou tentar acessar qualquer um de nossos serviços por qualquer meio não disponibilizado por nós;</li>
              <li>Interferir ou tentar interferir no funcionamento adequado dos nossos serviços.</li>
            </ul>
            
            <h3>1.2. Conta do Usuário</h3>
            <p>
              Para acessar certos recursos dos nossos serviços, você pode precisar criar uma conta. Você é responsável por:
            </p>
            <ul>
              <li>Manter a confidencialidade de suas credenciais de login;</li>
              <li>Toda e qualquer atividade que ocorra em sua conta;</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.</li>
            </ul>
          </section>
          
          <section className="termos-section">
            <h2>2. Política de Privacidade</h2>
            <p>
              Sua privacidade é importante para nós. Esta política explica quais informações pessoais coletamos e como as utilizamos.
            </p>
            
            <h3>2.1. Informações que Coletamos</h3>
            <p>Coletamos informações que você nos fornece diretamente, incluindo:</p>
            <ul>
              <li>Informações de contato (nome, e-mail, telefone);</li>
              <li>Informações de pagamento (dados de cartão de crédito, quando aplicável);</li>
              <li>Conteúdo que você envia através dos nossos serviços.</li>
            </ul>
            
            <h3>2.2. Como Utilizamos suas Informações</h3>
            <p>Utilizamos as informações coletadas para:</p>
            <ul>
              <li>Fornecer, manter e melhorar nossos serviços;</li>
              <li>Processar transações e enviar notificações relacionadas;</li>
              <li>Enviar avisos técnicos, atualizações e suporte;</li>
              <li>Responder a comentários, perguntas e solicitações de suporte.</li>
            </ul>
            
            <h3>2.3. Compartilhamento de Informações</h3>
            <p>
              Não compartilhamos informações pessoais com empresas, organizações ou indivíduos outside da NexTIS, exceto nas seguintes circunstâncias:
            </p>
            <ul>
              <li>Com seu consentimento;</li>
              <li>Para processamento externo (com provedores que processam dados conforme nossas instruções);</li>
              <li>Por motivos legais (quando necessário para cumprir leis, regulamentos ou processos legais).</li>
            </ul>
            
            <h3>2.4. Segurança das Informações</h3>
            <p>
              Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>
          
          <section className="termos-section">
            <h2>3. LGPD - Lei Geral de Proteção de Dados</h2>
            <p>
              Em conformidade com a Lei nº 13.709/2018 (LGPD), garantimos os direitos dos titulares de dados, incluindo:
            </p>
            <ul>
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso aos dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Eliminação de dados tratados com consentimento;</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
              <li>Revogação do consentimento.</li>
            </ul>
            
            <p>
              Para exercer seus direitos, entre em contato conosco através dos canais de atendimento disponíveis.
            </p>
          </section>
          
          <section className="termos-section">
            <h2>4. Alterações nos Termos</h2>
            <p>
              Podemos modificar estes Termos a qualquer momento. Notificaremos sobre mudanças materiais através dos nossos serviços
              ou por e-mail. O uso continuado dos serviços após tais modificações constitui sua concordância com os Termos revisados.
            </p>
          </section>
          
          <section className="termos-section">
            <h2>5. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes Termos ou Política de Privacidade, entre em contato conosco:
            </p>
            <ul>
              <li>E-mail: nextiscontato@gmail.com.br</li>
              <li>Telefone: (11) 4002-8922</li>
              <li>Endereço: Av. das Nações Unidas, 18605 - Santo Amaro, São Paulo/SP</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Termos;
