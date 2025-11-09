import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaCreditCard, FaLock, FaArrowLeft, FaBarcode, FaQrcode } from 'react-icons/fa';
import './Pagamento.css';

function Pagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showLgpdBanner, setShowLgpdBanner] = useState(true);

  useEffect(() => {
    const lgpdAccepted = localStorage.getItem('lgpdAccepted');
    if (lgpdAccepted === 'true') setShowLgpdBanner(false);

    if (location.state && location.state.cartItems) {
      setCartItems(location.state.cartItems);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceValue = parseFloat(item.price.replace('R$', '').replace(',', '.').replace(/[^\d.-]/g, ''));
      return total + (priceValue * item.quantity);
    }, 0);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) parts.push(match.substring(i, i + 4));
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardNumberChange = (e) => {
    setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) });
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    setPaymentData({ ...paymentData, expiryDate: value });
  };

  const handleAcceptTerms = () => {
    localStorage.setItem('lgpdAccepted', 'true');
    setShowLgpdBanner(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Você precisa aceitar os termos de uso e política de privacidade para continuar.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate('/', { state: { paymentCompleted: true } });
      }, 3000);
    }, 2000);
  };

  const getProductImage = (tipo) => {
    if (tipo.includes('Comanda')) return '/images/icon-comandou.svg';
    if (tipo.includes('Estoque')) return '/images/icon-estock.svg';
    return '/images/logo-conjunta.svg';
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success-container">
        <div className="payment-success">
          <FaCheckCircle className="success-icon" />
          <h2>Pagamento Realizado com Sucesso!</h2>
          <p>Obrigado por escolher nossos serviços. Em instantes você será redirecionado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <header className="payment-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Voltar
        </button>
        <div className="header-logo">
          <img src="/images/logo-nextis-hm.svg" alt="NexTIS" />
        </div>
      </header>

      <div className="payment-container">
        <div className="payment-summary">
          <h2>Resumo do Pedido</h2>
          <div className="order-items">
            {cartItems.map((item, index) => {
              const priceValue = parseFloat(item.price.replace('R$', '').replace(',', '.').replace(/[^\d.-]/g, ''));
              const total = priceValue * item.quantity;
              return (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img src={getProductImage(item.tipo)} alt={item.tipo} />
                  </div>
                  <div className="item-info">
                    <h4>{item.tipo}</h4>
                    <p>{item.periodicidade}</p>
                  </div>
                  <div className="item-price">
                    <p>{formatCurrency(total)}</p>
                    <span>Qtd: {item.quantity}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="order-total">
            <h3>Total: {formatCurrency(calculateTotal())}</h3>
          </div>
        </div>

        <div className="payment-form-container">
          <div className="payment-methods">
            <h3>Forma de Pagamento</h3>
            <div className="method-options">
              <button className={`method-btn ${paymentMethod === 'credit' ? 'active' : ''}`} onClick={() => setPaymentMethod('credit')}>
                <FaCreditCard /> Cartão de Crédito
              </button>
              <button className={`method-btn ${paymentMethod === 'pix' ? 'active' : ''}`} onClick={() => setPaymentMethod('pix')}>
                <FaQrcode /> PIX
              </button>
              <button className={`method-btn ${paymentMethod === 'boleto' ? 'active' : ''}`} onClick={() => setPaymentMethod('boleto')}>
                <FaBarcode /> Boleto
              </button>
            </div>
          </div>

          {paymentMethod === 'credit' && (
            <>
              <div className="payment-form-header">
                <FaCreditCard className="card-icon" />
                <h2>Cartão de Crédito</h2>
                <div className="secure-payment">
                  <FaLock className="lock-icon" />
                  <span>Pagamento seguro</span>
                </div>
              </div>

              <form className="payment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="cardNumber">Número do Cartão</label>
                  <input type="text" id="cardNumber" name="cardNumber" placeholder="0000 0000 0000 0000" value={paymentData.cardNumber} onChange={handleCardNumberChange} maxLength="19" required />
                </div>

                <div className="form-group">
                  <label htmlFor="cardName">Nome no Cartão</label>
                  <input type="text" id="cardName" name="cardName" placeholder="Como está no cartão" value={paymentData.cardName} onChange={handleInputChange} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Validade</label>
                    <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/AA" value={paymentData.expiryDate} onChange={handleExpiryDateChange} maxLength="5" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="000" value={paymentData.cvv} onChange={handleInputChange} maxLength="3" required />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="installments">Parcelamento</label>
                  <select id="installments" name="installments" value={paymentData.installments} onChange={handleInputChange} className="installments-select">
                    <option value="1">1x de {formatCurrency(calculateTotal())} sem juros</option>
                    <option value="2">2x de {formatCurrency(calculateTotal() / 2)} sem juros</option>
                    <option value="3">3x de {formatCurrency(calculateTotal() / 3)} sem juros</option>
                    <option value="4">4x de {formatCurrency(calculateTotal() / 4)} sem juros</option>
                    <option value="5">5x de {formatCurrency(calculateTotal() / 5)} sem juros</option>
                    <option value="6">6x de {formatCurrency(calculateTotal() / 6)} sem juros</option>
                  </select>
                </div>

                <div className="lgpd-warning">
                  <h4>Proteção de Dados</h4>
                  <p>Seus dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD). As informações do seu cartão são criptografadas e não são armazenadas em nossos servidores.</p>
                </div>

                <div className="terms-checkbox">
                  <input type="checkbox" id="acceptTerms" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
                  <label htmlFor="acceptTerms">
                    Li e aceito os <a href="/termos" target="_blank" rel="noopener noreferrer">Termos de Uso</a> e <a href="/privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>
                  </label>
                </div>

                <button type="submit" className="submit-payment-btn" disabled={isProcessing}>
                  {isProcessing ? 'Processando...' : `Pagar ${formatCurrency(calculateTotal())}`}
                </button>
              </form>
            </>
          )}

          {paymentMethod === 'pix' && (
            <div className="pix-payment">
              <div className="payment-form-header">
                <FaQrcode className="card-icon" />
                <h2>PIX</h2>
              </div>
              <div className="pix-instructions">
                <p>Para finalizar sua compra com PIX:</p>
                <ol>
                  <li>Clique no botão "Gerar QR Code" abaixo</li>
                  <li>Escaneie o código com seu aplicativo bancário</li>
                  <li>Confirme o pagamento no valor de {formatCurrency(calculateTotal())}</li>
                  <li>Aguarde a confirmação automática</li>
                </ol>

                <div className="pix-advantages">
                  <h4>Vantagens do PIX:</h4>
                  <ul>
                    <li>Pagamento instantâneo</li>
                    <li>Sem taxas adicionais</li>
                    <li>Máxima segurança</li>
                  </ul>
                </div>
              </div>

              <div className="terms-checkbox">
                <input type="checkbox" id="acceptTermsPix" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
                <label htmlFor="acceptTermsPix">
                  Li e aceito os <a href="/termos" target="_blank" rel="noopener noreferrer">termos de uso</a> e <a href="/privacidade" target="_blank" rel="noopener noreferrer">política de privacidade</a>
                </label>
              </div>

              <button className="submit-payment-btn" disabled={isProcessing || !acceptedTerms} onClick={handleSubmit}>
                {isProcessing ? 'Processando...' : `Gerar QR Code PIX`}
              </button>
            </div>
          )}

          {paymentMethod === 'boleto' && (
            <div className="boleto-payment">
              <div className="payment-form-header">
                <FaBarcode className="card-icon" />
                <h2>Boleto Bancário</h2>
              </div>
              <div className="boleto-instructions">
                <p>Para finalizar sua compra com boleto bancário:</p>
                <ol>
                  <li>Clique no botão "Emitir Boleto" abaixo</li>
                  <li>Imprima ou copie o código do boleto</li>
                  <li>Pague em qualquer agência bancária, internet banking ou aplicativo</li>
                  <li>O processamento leva até 3 dias úteis</li>
                </ol>

                <div className="boleto-advantages">
                  <h4>Informações importantes:</h4>
                  <ul>
                    <li>Vencimento: 3 dias úteis</li>
                    <li>Desconto de 5% no pagamento à vista</li>
                    <li>Enviaremos por e-mail a confirmação do pagamento</li>
                  </ul>
                </div>
              </div>

              <div className="terms-checkbox">
                <input type="checkbox" id="acceptTermsBoleto" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
                <label htmlFor="acceptTermsBoleto">
                  Li e aceito os <a href="/termos" target="_blank" rel="noopener noreferrer">termos de uso</a> e <a href="/privacidade" target="_blank" rel="noopener noreferrer">política de privacidade</a>
                </label>
              </div>

              <button className="submit-payment-btn" disabled={isProcessing || !acceptedTerms} onClick={handleSubmit}>
                {isProcessing ? 'Processando...' : `Emitir Boleto - ${formatCurrency(calculateTotal() * 0.95)}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {showLgpdBanner && (
        <div className="lgpd-banner">
          <div className="lgpd-content">
            <p>
              Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência.
              Ao continuar navegando, você concorda com nossa <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a> e <a href="/termos-uso" target="_blank" rel="noopener noreferrer">Termos de Uso</a>.
            </p>
            <div className="lgpd-buttons">
              <button className="lgpd-btn-terms" onClick={() => window.open('/termos-completos', '_blank', 'noopener,noreferrer')}>
                Ver Termos Completos
              </button>
              <button className="lgpd-btn-accept" onClick={handleAcceptTerms}>
                Aceitar Termos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pagamento;
