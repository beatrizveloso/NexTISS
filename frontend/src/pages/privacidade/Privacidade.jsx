import React from 'react';
import '../termos/Termos.css';

function Privacidade() {
  return (
    <div className="termos-page">
      <header className="termos-header">
        <div className="header-logo">
          <img src="/images/logo-nextis-hm.svg" alt="NexTIS" />
        </div>
      </header>

      <div className="termos-container">
        <h1>Política de Privacidade</h1>
        
        <div className="termos-content">
          <section className="termos-section">
            <h2>1. Introdução</h2>
            <p>
              A sua privacidade é importante para nós. Esta política descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais.
            </p>
          </section>

          <section className="termos-section">
            <h2>2. Informações que Coletamos</h2>
            <p>Coletamos informações que você fornece diretamente, incluindo:</p>
            <ul>
              <li>Nome, e-mail e telefone;</li>
              <li>Dados de pagamento, quando aplicável;</li>
              <li>Conteúdo que você envia através de nossos serviços;</li>
              <li>Informações técnicas sobre o dispositivo e navegação.</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>3. Uso das Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul>
              <li>Fornecer, manter e melhorar nossos serviços;</li>
              <li>Processar pagamentos e notificações;</li>
              <li>Enviar avisos, atualizações e suporte;</li>
              <li>Responder a dúvidas e solicitações de suporte.</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>4. Compartilhamento de Informações</h2>
            <p>Não compartilhamos informações pessoais fora da NexTIS, exceto:</p>
            <ul>
              <li>Com seu consentimento;</li>
              <li>Para processamento externo por provedores de confiança;</li>
              <li>Quando exigido por lei ou processo legal.</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>5. Segurança</h2>
            <p>
              Adotamos medidas técnicas e administrativas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>
          </section>

          <section className="termos-section">
            <h2>6. LGPD</h2>
            <p>
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem os seguintes direitos:
            </p>
            <ul>
              <li>Confirmação de existência de tratamento de dados;</li>
              <li>Acesso e correção de dados pessoais;</li>
              <li>Eliminação de dados tratados com consentimento;</li>
              <li>Portabilidade de dados para outro fornecedor;</li>
              <li>Revogação do consentimento a qualquer momento.</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>7. Alterações na Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas em nossos serviços ou por e-mail. O uso continuado implica aceitação da versão revisada.
            </p>
          </section>

          <section className="termos-section">
            <h2>8. Contato</h2>
            <p>
              Para dúvidas ou solicitações relacionadas à privacidade, entre em contato:
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

export default Privacidade;
