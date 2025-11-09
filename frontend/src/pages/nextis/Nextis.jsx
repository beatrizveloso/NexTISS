import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSun, FaMoon, FaChevronDown, FaChevronUp, FaShoppingCart, FaTrash, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Nextis.css';

function Nextis() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [selectedPlanType, setSelectedPlanType] = useState('mensal');
  const [selectedProductRange, setSelectedProductRange] = useState('ate-100');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    const savedLogin = localStorage.getItem('nextisLogin');
    if (savedLogin) {
      const loginData = JSON.parse(savedLogin);
      setIsLoggedIn(true);
      setUserEmail(loginData.email);
    }
  }, [isDarkMode]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const togglePlanDetails = (planIndex) => {
    if (expandedPlan === planIndex) {
      setExpandedPlan(null);
    } else {
      setExpandedPlan(planIndex);
    }
  };

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('nextisLogin', JSON.stringify({ email, isLoggedIn: true }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setShowUserMenu(false);
    localStorage.removeItem('nextisLogin');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const addToCart = (plan) => {
    const existingItem = cartItems.find(item => item.tipo === plan.tipo && item.periodicidade === selectedPlanType);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.tipo === plan.tipo && item.periodicidade === selectedPlanType
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      let price = '';

      if (plan.periodicidade) {
        // Planos normais (Comanda / Estoque)
        const priceObj = plan.periodicidade.find(p =>
          (selectedPlanType === 'mensal' && p.tipo === 'Mensal') ||
          (selectedPlanType === 'trimestral' && p.tipo === 'Trimestral') ||
          (selectedPlanType === 'anual' && p.tipo === 'Anual')
        );
        price = priceObj ? priceObj.valor : '';
      } else {
        // Combos
        if (selectedPlanType === 'mensal') price = plan.mensal;
        if (selectedPlanType === 'trimestral') price = plan.trimestral;
        if (selectedPlanType === 'anual') price = plan.anual;
      }

      setCartItems([...cartItems, {
        tipo: plan.tipo,
        periodicidade: selectedPlanType,
        price: price,
        quantity: 1,
        image: plan.tipo.includes('Comanda') ? '/images/icon-comandou.svg' :
          plan.tipo.includes('Estoque') ? '/images/icon-estock.svg' :
            '/images/logo-conjunta.svg'
      }]);
    }

    setShowCart(true);
  };

  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const updateQuantity = (index, change) => {
    const newCartItems = [...cartItems];
    if (newCartItems[index].quantity + change > 0) {
      newCartItems[index].quantity += change;
    } else {
      newCartItems.splice(index, 1);
    }
    setCartItems(newCartItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceValue = parseFloat(item.price.replace('R$', '').replace(',', '.').replace(/[^\d.-]/g, ''));
      return total + (priceValue * item.quantity);
    }, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const pricingData = {
    estoque: [
      {
        nivel: "Nível 1: Até 50 produtos",
        mensal: "R$ 59,90",
        trimestral: "R$ 161,73",
        anual: "R$ 575,04",
        recursos: [
          "Controle de até 50 produtos",
          "Alertas de reposição",
          "Relatórios básicos",
          "Suporte por email",
          "1 usuário incluído"
        ]
      },
      {
        nivel: "Nível 2: De 51 a 200 produtos",
        mensal: "R$ 89,90",
        trimestral: "R$ 242,73",
        anual: "R$ 863,04",
        recursos: [
          "Controle de até 200 produtos",
          "Alertas de reposição inteligentes",
          "Relatórios detalhados",
          "Suporte prioritário",
          "3 usuários incluídos",
          "Histórico de movimentação"
        ]
      },
      {
        nivel: "Nível 3: De 201 a 500 produtos",
        mensal: "R$ 129,90",
        trimestral: "R$ 350,73",
        anual: "R$ 1.247,04",
        recursos: [
          "Controle de até 500 produtos",
          "Alertas de reposição automáticos",
          "Relatórios avançados e personalizáveis",
          "Suporte 24/7",
          "Usuários ilimitados",
          "Histórico completo",
          "Integração com outros sistemas"
        ]
      }
    ],
    comandou: [
      {
        nivel: "Nível 1: Até 50 produtos",
        mensal: "R$ 59,90",
        trimestral: "R$ 161,73",
        anual: "R$ 575,04",
        recursos: [
          "Cardápio digital com até 50 itens",
          "Comandas virtuais",
          "Gestão de mesas",
          "Relatórios de vendas básicos",
          "Suporte por email"
        ]
      },
      {
        nivel: "Nível 2: De 51 a 200 produtos",
        mensal: "R$ 89,90",
        trimestral: "R$ 242,73",
        anual: "R$ 863,04",
        recursos: [
          "Cardápio digital com até 200 itens",
          "Comandas virtuais personalizáveis",
          "Gestão de mesas e turnos",
          "Relatórios de vendas detalhados",
          "Suporte prioritário",
          "Integração com impressora"
        ]
      },
      {
        nivel: "Nível 3: De 201 a 500 produtos",
        mensal: "R$ 129,90",
        trimestral: "R$ 350,73",
        anual: "R$ 1.247,04",
        recursos: [
          "Cardápio digital ilimitado",
          "Comandas virtuais totalmente personalizáveis",
          "Gestão completa de estabelecimento",
          "Relatórios avançados e analytics",
          "Suporte 24/7",
          "Integração com múltiplos dispositivos",
          "Backup em nuvem"
        ]
      }
    ],
    combo: [
      {
        nome: "Comanda + Estoque",
        descricao: "Solução completa para seu negócio",
        mensal: "R$ 149,90",
        trimestral: "R$ 404,73",
        anual: "R$ 1.439,04"
      }
    ]
  };

  const planosComanda = [
    {
      tipo: "Comanda Virtual",
      periodicidade: [
        { tipo: "Mensal", valor: "R$ 69,90/mês", vantagem: "Maior flexibilidade para o cliente, que pode cancelar a qualquer momento. Ideal para quem quer testar o serviço." },
        { tipo: "Trimestral", valor: "R$ 188,73/trimestre", vantagem: "Oferece um desconto de 10% em relação ao plano mensal. Isso incentiva o cliente a se comprometer por mais tempo." },
        { tipo: "Anual", valor: "R$ 671,04/ano", vantagem: "Oferece o maior desconto, de 20%, o que é um grande atrativo para o cliente que já confia no seu produto." }
      ]
    },
    {
      tipo: "Controle de Estoque",
      periodicidade: [
        { tipo: "Mensal", valor: "R$ 99,90/mês", vantagem: "Oferece flexibilidade total para o cliente, que pode cancelar a qualquer momento sem burocracia." },
        { tipo: "Trimestral", valor: "R$ 269,73/trimestre", vantagem: "Concede um desconto de 10% no valor da assinatura, incentivando um compromisso maior por parte do cliente." },
        { tipo: "Anual", valor: "R$ 959,04/ano", vantagem: "Este plano oferece o maior benefício para o cliente, com 20% de desconto, e garante uma receita mais estável para o seu negócio." }
      ]
    },
    {
      tipo: "Combo Completo",
      periodicidade: [
        { tipo: "Mensal", valor: "R$ 149,90/mês", vantagem: "Este valor representa uma economia de R$ 19,90/mês em relação à compra dos serviços separadamente." },
        { tipo: "Trimestral", valor: "R$ 404,73/trimestre", vantagem: "Oferece um desconto de 10% sobre o valor mensal do pacote, o que torna o compromisso trimestral ainda mais atrativo." },
        { tipo: "Anual", valor: "R$ 1.439,04/ano", vantagem: "Este é o plano com o maior benefício para o cliente, com um desconto de 20% sobre o valor mensal do pacote." }
      ]
    }
  ];

  const faqItems = [
    {
      pergunta: "Como faço para contratar os serviços?",
      resposta: "Você pode entrar em contato conosco por email, telefone ou preencher o formulário em nossa página de contato. Nossa equipe entrará em contato para entender suas necessidades e oferecer a melhor solução."
    },
    {
      pergunta: "Os planos podem ser cancelados a qualquer momento?",
      resposta: "Sim, nossos planos mensais podem ser cancelados a qualquer momento sem multa. Para planos trimestrais e anuais, oferecemos reembolsos proporcionais ao período não utilizado."
    },
    {
      pergunta: "Há suporte técnico disponível?",
      resposta: "Sim, oferecemos suporte técnico por email e telefone para todos os clientes. Planos avançados incluem suporte prioritário e 24/7."
    },
    {
      pergunta: "É possível integrar com outros sistemas?",
      resposta: "Sim, nossos sistemas oferecem APIs para integração com outros softwares. Entre em contato conosco para discutir suas necessidades específicas de integração."
    }
  ];

  return (
    <div className="nextis-landing-page">
      <header className="nextis-header">
        <div className="header-container">
          <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <button onClick={() => scrollToSection('home')}>Home</button>
            <button onClick={() => scrollToSection('servicos')}>Serviços</button>
            <button className="nextis-logo-text" onClick={() => scrollToSection('home')}>Nextis</button>
            <button onClick={() => scrollToSection('sobre')}>Sobre nós</button>
            <button onClick={() => scrollToSection('contato')}>Contato</button>
            <div className="header-right">
              <button className="theme-toggle-nextis" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <button className="cart-toggle" onClick={() => setShowCart(!showCart)}>
                <FaShoppingCart />
                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
              </button>
              {isLoggedIn ? (
                <div className="user-menu-container" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
                  <button className="user-menu-button">
                    <FaUser className="user-icon" />
                    <span className="user-email">{userEmail}</span>
                  </button>
                  {showUserMenu && (
                    <div className="user-menu-dropdown">
                      <button onClick={handleLogout} className="btn-logout">
                        <FaSignOutAlt /> Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="login-button" onClick={() => navigate('/login')}>
                  Login
                </button>
              )}
            </div>
          </nav>

          <button className="hamburger-menu" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      <section id="home" className="hero-section" style={{ paddingTop: '80px' }}>
        <div className="hero-content">
          <img src="/images/logo-nextis-hm.svg" alt="Sistema NexTIS" className="hero-logo desktop-logo" />
          <img src="/images/logo-nextis-mb.svg" alt="Sistema NexTIS" className="hero-logo mobile-logo" />
          <h1>Tecnologia que organiza hoje, <br /> pensando no amanhã.</h1>
          <p>Da comanda ao estoque, tudo sob controle em um só sistema.</p>
        </div>
      </section>

      <section id="servicos" className="services-section">
        <div className="section-header">
          <div className="title-container">
            <h2 className="section-title">Serviços</h2>
            <p className="section-subtitle">Conheça nossas soluções integradas para o seu negócio. Oferecemos sistemas completos para gestão de comandas digitais e controle de estoque, proporcionando eficiência e praticidade para seu estabelecimento.</p>
          </div>
        </div>

        <div className="nextis-services-section">
          <div className="nextis-service-card" onClick={() => navigate('/comandou')}>
            <div className="nextis-service-icon">
              <img src="/images/icon-comandou.svg" alt="ComandOU Logo" />
            </div>
            <h2 className="comandou-gradient">ComandOU</h2>
            <p>
              Sistema completo de comanda virtual e cardápio digital.
              Seus clientes podem visualizar o cardápio e fazer pedidos pelo celular,
              enquanto você gerencia tudo de forma simples e intuitiva.
            </p>
            <button className="nextis-service-button orange-button">Saiba mais</button>
          </div>

          <div className="nextis-service-card" onClick={() => navigate('/estock')}>
            <div className="nextis-service-icon">
              <img src="/images/icon-estock.svg" alt="eStock Logo" className="estock-icon" />
            </div>
            <h2 className="estock-gradient">eStock</h2>
            <p>
              Controle de estoque inteligente para empresas.
              Gerencie seus produtos, receba alertas de reposição e tenha relatórios
              detalhados para tomar as melhores decisões para seu negócio.
            </p>
            <button className="nextis-service-button estock-button">Saiba mais</button>
          </div>
        </div>
      </section>

      <section id="planos" className="plans-section">
        <div className="section-header">
          <div className="title-container">
            <h2 className="section-title">Planos</h2>
            <p className="section-subtitle">Escolha o plano ideal para o seu negócio. Oferecemos soluções flexíveis e adaptáveis às necessidades do seu estabelecimento, avec opções para todos os tamanhos e orçamentos.</p>
          </div>
        </div>

        <div className="plans-container">
          <div className="plan-selection-options">
            <div className="plan-type-selector">
              <h3>Selecione o Período:</h3>
              <div className="selector-buttons">
                <button
                  className={selectedPlanType === 'mensal' ? 'active' : ''}
                  onClick={() => setSelectedPlanType('mensal')}
                >
                  Mensal
                </button>
                <button
                  className={selectedPlanType === 'trimestral' ? 'active' : ''}
                  onClick={() => setSelectedPlanType('trimestral')}
                >
                  Trimestral
                </button>
                <button
                  className={selectedPlanType === 'anual' ? 'active' : ''}
                  onClick={() => setSelectedPlanType('anual')}
                >
                  Anual
                </button>
              </div>
            </div>

            <div className="product-range-selector">
              <h3>Quantidade de Produtos:</h3>
              <select
                value={selectedProductRange}
                onChange={(e) => setSelectedProductRange(e.target.value)}
              >
                <option value="ate-100">Até 100 produtos</option>
                <option value="100-500">100 a 500 produtos</option>
                <option value="500-1000">500 a 1000 produtos</option>
                <option value="1000-5000">1000 a 5000 produtos</option>
              </select>
            </div>
          </div>

          <div className="plans-cards">
            {planosComanda.map((plano, index) => {
              const calculateAdjustedPrice = (basePrice) => {
                const baseValue = parseFloat(basePrice.replace('R$', '').replace('.', '').replace(',', '.'));
                let multiplier = 1;

                switch (selectedProductRange) {
                  case '100-500':
                    multiplier = 1.1;
                    break;
                  case '500-1000':
                    multiplier = 1.2;
                    break;
                  case '1000-5000':
                    multiplier = 1.3;
                    break;
                  default:
                    multiplier = 1;
                }

                const adjustedValue = baseValue * multiplier;
                return `R$ ${adjustedValue.toFixed(2).replace('.', ',')}`;
              };

              const getPeriodicidadeComAjuste = () => {
                return plano.periodicidade.map(periodo => ({
                  ...periodo,
                  valorAjustado: calculateAdjustedPrice(periodo.valor.split('/')[0])
                }));
              };

              const periodicidadeAjustada = getPeriodicidadeComAjuste();

              return (
                <div key={index} className="plan-card">
                  <div className="plan-card-header">
                    <h3>{plano.tipo}</h3>
                  </div>
                  <div className="plan-card-body">
                    <div className="plan-price">
                      {periodicidadeAjustada.map((periodo, i) => {
                        if (selectedPlanType === 'mensal' && periodo.tipo === 'Mensal') {
                          return <div key={i} className="price-display">{periodo.valorAjustado}/mês</div>;
                        } else if (selectedPlanType === 'trimestral' && periodo.tipo === 'Trimestral') {
                          return <div key={i} className="price-display">{periodo.valorAjustado}/trimestre</div>;
                        } else if (selectedPlanType === 'anual' && periodo.tipo === 'Anual') {
                          return <div key={i} className="price-display">{periodo.valorAjustado}/ano</div>;
                        }
                        return null;
                      })}
                    </div>
                    <ul className="plan-features">
                      {periodicidadeAjustada.map((periodo, i) => {
                        if (
                          (selectedPlanType === 'mensal' && periodo.tipo === 'Mensal') ||
                          (selectedPlanType === 'trimestral' && periodo.tipo === 'Trimestral') ||
                          (selectedPlanType === 'anual' && periodo.tipo === 'Anual')
                        ) {
                          return <li key={i}>{periodo.vantagem}</li>;
                        }
                        return null;
                      })}
                    </ul>
                    <button className="plan-select-button" onClick={() => addToCart(plano)}>Selecionar Plano</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="sobre" className="team-section">
        <div className="section-header">
          <div className="title-container">
            <h2 className="section-title">Time</h2>
            <p className="section-subtitle">Esse projeto foi desenvolvido por estudantes de ADS da Cruzeiro do Sul. Nossa equipe é composta por profissionais dedicados que trabalharam em diferentes áreas do projeto para entregar soluções de qualidade.</p>
          </div>
        </div>

        <div className="team-grid">
          <div className="team-member">
            <div className="member-card">
              <img src="/images/beatriz.png" alt="Beatriz Veloso" className="team-photo" />
              <div className="member-info">
                <h3>Beatriz Veloso</h3>
                <p>Engenheira de Software Front-end e UI/UX Designer</p>
                <div className="divider"></div>
                <p className="member-bio">Responsável pelo design e programação front-end dos sistemas.</p>
              </div>
              <a href="https://www.linkedin.com/in/beatriz-veloso6/" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="linkedin-img" />
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-card">
              <img src="/images/leticia.png" alt="Leticia Monteiro" className="team-photo" />
              <div className="member-info">
                <h3>Leticia Monteiro</h3>
                <p>Analista de Documentação Técnica</p>
                <div className="divider"></div>
                <p className="member-bio">Responsável pela documentação do projeto ComandOU.</p>
              </div>
              <a href="https://www.linkedin.com/in/let%C3%ADcia-monteiro-4529b0349/" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="linkedin-img" />
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-card">
              <img src="/images/caio.png" alt="Caio" className="team-photo" />
              <div className="member-info">
                <h3>Caio</h3>
                <p>Engenheiro de Software Back-end</p>
                <div className="divider"></div>
                <p className="member-bio">Desenvolveu o back-end dos dois projetos.</p>
              </div>
              <a href="https://www.linkedin.com/in/caio-ferreira-2a5394327/" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="linkedin-img" />
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-card">
              <img src="/images/nathalia.png" alt="Nathalia Pacheco" className="team-photo" />
              <div className="member-info">
                <h3>Nathalia Pacheco</h3>
                <p>Analista de Sistemas</p>
                <div className="divider"></div>
                <p className="member-bio">Responsável pelos diagramas do projeto ComandOU.</p>
              </div>
              <a href="https://www.linkedin.com/in/nath%C3%A1lia-do-nascimento-pacheco-a28a41295/" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="linkedin-img" />
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-card">
              <img src="/images/gabriel.png" alt="Gabriel Magalhães" className="team-photo" />
              <div className="member-info">
                <h3>Gabriel Magalhães</h3>
                <p>Engenheiro de Software Back-end</p>
                <div className="divider"></div>
                <p className="member-bio">Desenvolveu o back-end dos dois projetos.</p>
              </div>
              <a href="https://www.linkedin.com/in/gabriel-magalhaes-9b9104261/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="linkedin-img" />
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-card">
              <img src="/images/georgia.png" alt="Georgia Marli" className="team-photo" />
              <div className="member-info">
                <h3>Georgia Marli</h3>
                <p>Engenheira de Banco de Dados</p>
                <div className="divider"></div>
                <p className="member-bio">Responsável pelo banco de dados dos dois projetos.</p>
              </div>
              <a href="https://www.linkedin.com/in/georgia-marli-concei%C3%A7%C3%A3o-silva 324874214?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="linkedin-img" />
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-card">
              <img src="/images/daniel.png" alt="Daniel Urbano" className="team-photo" />
              <div className="member-info">
                <h3>Daniel Urbano</h3>
                <p>Analista de Sistemas</p>
                <div className="divider"></div>
                <p className="member-bio">Responsável pelos diagramas do projeto eStock.</p>
              </div>
              <a href="https://www.linkedin.com/in/daniel-c%C3%A2ndido-759493343/" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="linkedin-img" />
              </a>
            </div>
          </div>

          <div className="team-member">
            <div className="member-card">
              <img src="/images/maria.png" alt="Maria Vitoria" className="team-photo" />
              <div className="member-info">
                <h3>Maria Vitoria</h3>
                <p>Analista de Requisitos</p>
                <div className="divider"></div>
                <p className="member-bio">Levantamento de requisitos and documentação do eStock.</p>
              </div>
              <a href="https://www.linkedin.com/in/maria-vitoria-oliveira-da-silva-044a43270/edit/forms/next-action/after-connect-add-position/" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" className="linkedin-img" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-header">
          <div className="title-container">
            <h2 className="section-title">Perguntas Frequentes</h2>
            <p className="section-subtitle">Tire suas dúvidas sobre nossos serviços e planos. Estamos aqui para ajudar você a encontrar a melhor solução para o seu negócio.</p>
          </div>
        </div>

        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <button
                className="faq-question"
                onClick={() => togglePlanDetails(`faq-${index}`)}
              >
                {item.pergunta}
                {expandedPlan === `faq-${index}` ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {expandedPlan === `faq-${index}` && (
                <div className="faq-answer">
                  <p>{item.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer id="contato" className="nextis-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img src="/images/logo-footer.svg" alt="NexTIS Logo" />
            </div>
            <p className="footer-description">
              Soluções inovadoras em gestão de comandas e controle de estoque para seu negócio.
            </p>
            <div className="social-icons">
              <a href="mailto:nextiscontato@gmail.com" className="social-icon">
                <img src="/images/gmail-icon.png" alt="Gmail" />
              </a>
              <a href="https://www.linkedin.com/company/nextiscontact/about/?viewAsMember=true" className="social-icon">
                <img src="/images/linkedin-icon.svg" alt="LinkedIn" />
              </a>
              <a href="https://www.instagram.com/nextis_oficial/" className="social-icon">
                <img src="/images/instagram-icon.png" alt="Instagram" />
              </a>
            </div>
          </div>

          <div className="footer-center">
            <h3>Contato</h3>
            <div className="footer-contacts">
              <p><strong>Email:</strong> nextiscontato@gmail.com</p>
              <p><strong>Telefone:</strong> (11) 94002-8922</p>
              <p><strong>Endereço:</strong> Av. Santo Amaro, 123 - São Paulo, SP</p>
            </div>
          </div>

          <div className="footer-right">
            <h3>Localização</h3>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.559424972781!2d-46.72040232517223!3d-23.655944165072835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce51a36a2b5357%3A0x6375faa71efa063e!2sUniversidade%20Cruzeiro%20do%20Sul%20-%20Campus%20Santo%20Amaro!5e0!3m2!1spt-BR!2sbr!4v1725216481621!5m2!1spt-BR!2sbr"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização NexTIS"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {new Date().getFullYear()} NexTIS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {showCart && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h3>Carrinho de Planos</h3>
            <button className="close-cart" onClick={() => setShowCart(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p className="empty-cart">Seu carrinho está vazio</p>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.tipo} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.tipo}</h4>
                    <p>{item.periodicidade}</p>
                    <p className="cart-item-price">{item.price}</p>

                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(index, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)}>+</button>
                    </div>

                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(index)}>
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <strong>Total: {calculateTotal()}</strong>
              </div>

              <button
                className="checkout-button"
                onClick={() => navigate('/pagamento', { state: { cartItems } })}
              >
                Finalizar Compra
              </button>

            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Nextis;