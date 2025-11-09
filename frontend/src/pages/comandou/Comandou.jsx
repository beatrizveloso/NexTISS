import React, { useState, useEffect, useRef } from 'react';
import {
  FaSun, FaMoon, FaUser, FaSignOutAlt, FaExclamationTriangle, FaUtensils,
  FaClipboardList, FaUserTie, FaUsers, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaArrowRight,
  FaShoppingCart, FaTimes, FaMinus, FaPlus, FaTrash, FaCheckCircle
} from 'react-icons/fa';
import './Comandou.css';

const Header = ({ logo, activeTab, setActiveTab, theme, toggleTheme, user, userRole, onLogout, onLogoClick, isMobile }) => {
  const canAccessTab = (tab) => {
    if (!user) return false;

    const rolePermissions = {
      'garçom': ['cardapio', 'comanda'],
      'caixa': ['comanda'],
      'cozinheiro': ['comanda'],
      'gerente': ['cardapio', 'comanda', 'gerenciamento'],
      'administrador': ['cardapio', 'comanda', 'gerenciamento']
    };

    return rolePermissions[userRole]?.includes(tab) || false;
  };

  return (
    <header className="header-comandou">
      <div className="logo-container-cm" onClick={onLogoClick}>
        {isMobile ? (
          <img src="/images/icon-comandou.svg" alt="Comandou" className="logo-icon-comandou" />
        ) : (
          <img src={logo} alt="Comandou" className="logo-comandou" />
        )}
      </div>

      <nav className="header-nav-comandou">
        <button
          className={activeTab === 'cardapio' ? 'active' : ''}
          onClick={() => setActiveTab('cardapio')}
        >
          Cardápio <FaUtensils />
        </button>

        {user && (
          <>
            {canAccessTab('comanda') && (
              <button
                className={activeTab === 'comanda' ? 'active' : ''}
                onClick={() => setActiveTab('comanda')}
              >
                Comanda <FaClipboardList />
              </button>
            )}
            {canAccessTab('gerenciamento') && (
              <button
                className={activeTab === 'gerenciamento' ? 'active' : ''}
                onClick={() => setActiveTab('gerenciamento')}
              >
                Gerenciamento <FaUserTie />
              </button>
            )}
          </>
        )}
      </nav>

      <div className="header-right-comandou">
        <div className="theme-toggle-comandou" onClick={toggleTheme}>
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </div>
        {user ? (
          <div className="user-menu-cm">
            <FaUser />
            {!isMobile && (
              <div className="user-info">
                <span className="user-email">{user}</span>
                <span className="user-role">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              </div>
            )}
            <div className="dropdown-menu-cm">
              <button onClick={onLogout}>
                <FaSignOutAlt /> Sair
              </button>
            </div>
          </div>
        ) : (
          <div className="user-menu-cm">
            <FaUser />
            {!isMobile && <span className="user-email">Visitante</span>}
            <div className="dropdown-menu-cm">
              <button onClick={() => setActiveTab('login')}>
                <FaUserTie /> Login
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const WelcomeScreen = ({ onClientEnter, onEmployeeEnter, isMobile }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <img src="/images/logo-comandou.png" alt="Comandou" className="welcome-logo" />
        <h1>Bem-vindo ao Comandou</h1>
        <p>Sistema de gerenciamento de comandas</p>
        <div className="welcome-options">
          <div className="welcome-option">
            <div className="option-icon client-icon">
              <FaUsers />
            </div>
            <button onClick={onClientEnter} className="btn-welcome">Sou Cliente</button>
          </div>
          <div className="welcome-option">
            <div className="option-icon employee-icon">
              <FaUserTie />
            </div>
            <button onClick={onEmployeeEnter} className="btn-welcome">Sou Funcionário</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginComandou = ({ onLogin, isMobile }) => {
  const [loginComandouEmail, setLoginComandouEmail] = useState('');
  const [loginComandouSenha, setLoginComandouSenha] = useState('');
  const [loginComandouFuncao, setLoginComandouFuncao] = useState('');
  const [mostrarSenhaComandou, setMostrarSenhaComandou] = useState(false);
  const [erroLoginComandou, setErroLoginComandou] = useState('');

  const handleSubmitComandou = (e) => {
    e.preventDefault();

    if (!loginComandouFuncao) {
      setErroLoginComandou('Selecione uma função');
      return;
    }

    if (loginComandouEmail === 'nextiscontato@gmail.com' && loginComandouSenha === 'nextis') {
      setErroLoginComandou('');
      onLogin(true, loginComandouEmail, loginComandouFuncao);
    } else {
      setErroLoginComandou('Email ou senha incorretos');
    }
  };

  return (
    <div className="comandou-login-container">
      <div className="comandou-login-card">
        <div className="comandou-login-header">
          <img src="/images/logo-comandou.png" alt="Logo comandou" />
          <h2>Sistema de Comanda</h2>
          <p>Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleSubmitComandou} className="comandou-login-form">
          {erroLoginComandou && <div className="error-message">{erroLoginComandou}</div>}

          <div className="comandou-form-group">
            <label className="white-label">Email:</label>
            <div className="comandou-input-with-icon">
              <FaUser className="comandou-input-icon" />
              <input
                type="email"
                name="email"
                value={loginComandouEmail}
                onChange={(e) => setLoginComandouEmail(e.target.value)}
                required
                placeholder="Seu email"
                className="comandou-white-input"
              />
            </div>
          </div>

          <div className="comandou-form-group">
            <label className="white-label">Senha:</label>
            <div className="comandou-input-with-icon">
              <FaLock className="comandou-input-icon" />
              <input
                type={mostrarSenhaComandou ? "text" : "password"}
                name="password"
                value={loginComandouSenha}
                onChange={(e) => setLoginComandouSenha(e.target.value)}
                required
                placeholder="Sua senha"
                className="comandou-white-input"
              />
              <button
                type="button"
                className="comandou-password-toggle"
                onClick={() => setMostrarSenhaComandou(!mostrarSenhaComandou)}
              >
                {mostrarSenhaComandou ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="comandou-form-group">
            <label className="white-label">Função:</label>
            <div className="comandou-input-with-icon">
              <FaUserTie className="comandou-input-icon" />
              <select
                value={loginComandouFuncao}
                onChange={(e) => setLoginComandouFuncao(e.target.value)}
                required
                className="comandou-white-input"
              >
                <option value="">Selecione sua função</option>
                <option value="garçom">Garçom</option>
                <option value="caixa">Caixa</option>
                <option value="cozinheiro">Cozinheiro</option>
                <option value="gerente">Gerente</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
          </div>

          <button type="submit" className="comandou-login-btn">
            Entrar no Sistema
          </button>
        </form>

        <div className="comandou-login-footer">
          <p>Entre com suas credenciais de funcionário</p>
        </div>
      </div>
    </div>
  );
};

const ComandaTab = ({ pedidos, onPedidoPronto, onLogout, estoque, isMobile, userRole }) => {
  const pedidosPreparando = pedidos.filter(pedido => pedido.status === 'preparando');
  const pedidosProntos = pedidos.filter(pedido => pedido.status === 'pronto');

  const canSeeKitchenOrders = ['cozinheiro', 'garçom', 'gerente', 'administrador'].includes(userRole);
  const canSeeReadyOrders = ['garçom', 'caixa', 'gerente', 'administrador'].includes(userRole);
  const canMarkAsReady = ['cozinheiro', 'gerente', 'administrador'].includes(userRole);

  return (
    <div className="tab-content comanda-tab">
      <div className="comanda-header">
        <h2>Gerenciar Comandas</h2>
        <div className="comanda-actions">
          <button onClick={onLogout} className="btn-logout"><FaSignOutAlt /> Sair</button>
        </div>
      </div>

      {['gerente', 'administrador'].includes(userRole) && (
        <div className="estoque-section">
          <h3>Alertas de Estoque</h3>
          <div className="estoque-grid mobile">
            {estoque.map((item) => (
              item.quantidade <= 5 && (
                <div key={item.id} className="estoque-item alerta mobile">
                  <span className="estoque-nome">{item.nome}</span>
                  <div className="estoque-controles">
                    <span className="quantidade-atual">{item.quantidade} unidades</span>
                    {item.quantidade <= 5 && <span className="estoque-alerta"><FaExclamationTriangle /> Baixo estoque</span>}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      <div className="comanda-container">
        {canSeeKitchenOrders && (
          <div className="comanda-coluna">
            <h3>Pedidos em Preparo</h3>
            {pedidosPreparando.length === 0 ? <p>Nenhum pedido em preparo</p> : (
              <div className="pedidos-grid">
                {pedidosPreparando.map((pedido) => (
                  <div key={pedido.codigo} className="pedido-card">
                    <div className="pedido-header">
                      <span className="pedido-codigo">#{pedido.codigo}</span>
                      <span className="pedido-hora">{pedido.horaPedido}</span>
                    </div>
                    <div className="pedido-cliente"><strong>{pedido.cliente}</strong>{pedido.email && <span>{pedido.email}</span>}</div>
                    <ul className="pedido-itens">
                      {pedido.itens.map((item, i) => <li key={i}><span>{item.nome}</span><span>R$ {item.preco.toFixed(2)}</span></li>)}
                    </ul>
                    <div className="pedido-footer">
                      <span>Total: R$ {pedido.total.toFixed(2)}</span>
                      <span>{pedido.pagamento}</span>
                    </div>
                    {canMarkAsReady && (
                      <button onClick={() => onPedidoPronto(pedido.codigo)} className="btn-pronto">Pedido Pronto</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {canSeeReadyOrders && (
          <div className="comanda-coluna">
            <h3>Pedidos Prontos</h3>
            {pedidosProntos.length === 0 ? <p>Nenhum pedido pronto</p> : (
              <div className="pedidos-grid">
                {pedidosProntos.map((pedido) => (
                  <div key={pedido.codigo} className="pedido-card pronto">
                    <div className="pedido-header">
                      <span className="pedido-codigo">#{pedido.codigo}</span>
                      <span className="pedido-hora">{pedido.horaPedido}</span>
                    </div>
                    <div className="pedido-cliente"><strong>{pedido.cliente}</strong>{pedido.email && <span>{pedido.email}</span>}</div>
                    <ul className="pedido-itens">
                      {pedido.itens.map((item, i) => <li key={i}><span>{item.nome}</span><span>R$ {item.preco.toFixed(2)}</span></li>)}
                    </ul>
                    <div className="pedido-footer">
                      <span>Total: R$ {pedido.total.toFixed(2)}</span>
                      <span>{pedido.pagamento}</span>
                    </div>
                    <div className="pedido-status"><span className="status pronto">PRONTO</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const GerenciamentoTab = ({ 
  cardapio, 
  estoque, 
  onAtualizarCardapio, 
  onAtualizarEstoque, 
  categoriasPersonalizadas, 
  onAtualizarCategorias, 
  isMobile 
}) => {
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    id: null,
    nome: '',
    descricao: '',
    preco: '',
    precoDose: '',
    mlGarrafa: '',
    categoria: '',
    imagem: '',
    quantidade: ''
  });

  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [categoriaEditandoNome, setCategoriaEditandoNome] = useState('');

  const [calcularDoseAutomaticamente, setCalcularDoseAutomaticamente] = useState(true);
  const formularioRef = useRef(null);

  useEffect(() => {
    if (calcularDoseAutomaticamente && novoProduto.preco > 0 && novoProduto.mlGarrafa > 0) {
      const precoPorDose = (novoProduto.preco / novoProduto.mlGarrafa) * 50;
      setNovoProduto((prev) => ({
        ...prev,
        precoDose: parseFloat(precoPorDose.toFixed(2))
      }));
    }
  }, [novoProduto.preco, novoProduto.mlGarrafa, calcularDoseAutomaticamente]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNovoProduto({ ...novoProduto, imagem: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarProduto = () => {
    if (!novoProduto.nome) return;

    const produtoParaSalvar = {
      ...novoProduto,
      preco: parseFloat(novoProduto.preco) || 0,
      precoDose: parseFloat(novoProduto.precoDose) || 0,
      mlGarrafa: parseInt(novoProduto.mlGarrafa) || 0,
      quantidade: parseInt(novoProduto.quantidade) || 0,
    };

    if (produtoEditandoId !== null) {
      const index = cardapio.findIndex(p => p.id === produtoEditandoId);
      if (index !== -1) {
        const updated = [...cardapio];
        updated[index] = { ...produtoParaSalvar, id: produtoEditandoId };
        onAtualizarCardapio(updated);

        const estIndex = estoque.findIndex(s => s.id === produtoEditandoId);
        if (estIndex !== -1) {
          const novoEst = [...estoque];
          novoEst[estIndex].nome = novoProduto.nome;
          onAtualizarEstoque(novoEst);
        }
      }
    } else {
      const novoId = cardapio.length ? Math.max(...cardapio.map(p => p.id)) + 1 : 1;
      const produtoParaAdicionar = { ...produtoParaSalvar, id: novoId };
      onAtualizarCardapio([produtoParaAdicionar, ...cardapio]);
      onAtualizarEstoque([{ id: novoId, nome: novoProduto.nome, quantidade: produtoParaSalvar.quantidade }, ...estoque]);
    }

    setProdutoEditandoId(null);
    setNovoProduto({
      id: null,
      nome: '',
      descricao: '',
      preco: '',
      precoDose: '',
      mlGarrafa: '',
      categoria: '',
      imagem: ''
    });
    setCalcularDoseAutomaticamente(true);
  };

  const handleEditarProduto = (id) => {
    const p = cardapio.find(item => item.id === id);
    if (p) {
      setProdutoEditandoId(id);
      setNovoProduto({ ...p });
      
      setTimeout(() => {
        formularioRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const handleCancelarEdicao = () => {
    setProdutoEditandoId(null);
    setNovoProduto({ id: null, nome: '', descricao: '', preco: 0, precoDose: 0, categoria: '', imagem: '' });
    setCalcularDoseAutomaticamente(true);
  };

  const handleExcluirProduto = (id) => {
    onAtualizarCardapio(cardapio.filter(p => p.id !== id));
    onAtualizarEstoque(estoque.filter(s => s.id !== id));
    if (produtoEditandoId === id) handleCancelarEdicao();
  };

  const handleAtualizarEstoque = (id, novaQuantidade) => {
    const novoEst = estoque.map(s => s.id === id ? { ...s, quantidade: novaQuantidade } : s);
    onAtualizarEstoque(novoEst);
  };

  const adicionarCategoria = () => {
    if (novaCategoria && !categoriasPersonalizadas.includes(novaCategoria.toLowerCase())) {
      onAtualizarCategorias([...categoriasPersonalizadas, novaCategoria.toLowerCase()]);
      setNovaCategoria('');
    }
  };

  const editarCategoria = (categoriaAntiga, novaCategoriaNome) => {
    if (novaCategoriaNome && !categoriasPersonalizadas.includes(novaCategoriaNome.toLowerCase())) {
      const novasCategorias = categoriasPersonalizadas.map(cat =>
        cat === categoriaAntiga ? novaCategoriaNome.toLowerCase() : cat
      );
      onAtualizarCategorias(novasCategorias);
      
      const novoCardapio = cardapio.map(produto =>
        produto.categoria === categoriaAntiga
          ? { ...produto, categoria: novaCategoriaNome.toLowerCase() }
          : produto
      );
      onAtualizarCardapio(novoCardapio);
      
      setCategoriaEditando(null);
      setCategoriaEditandoNome('');
    }
  };

  const excluirCategoria = (categoria) => {
    if (categoriasPersonalizadas.length > 1) {
      onAtualizarCategorias(categoriasPersonalizadas.filter(cat => cat !== categoria));
      
      const produtosNaCategoria = cardapio.filter(produto => produto.categoria === categoria);
      if (produtosNaCategoria.length > 0) {
        const novaCategoriaPadrao = categoriasPersonalizadas.find(cat => cat !== categoria);
        const novoCardapio = cardapio.map(produto =>
          produto.categoria === categoria
            ? { ...produto, categoria: novaCategoriaPadrao }
            : produto
        );
        onAtualizarCardapio(novoCardapio);
      }
    }
  };

  return (
    <div className="tab-content gerenciamento-tab">
      <h2>Gerenciamento de Cardápio</h2>

      <div className="categorias-section">
        <h3>Gerenciar Categorias</h3>
        <div className="categorias-form">
          <div className="form-group">
            <label>Nova Categoria</label>
            <input
              type="text"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              placeholder="Ex: Drinks Especiais"
            />
            <button onClick={adicionarCategoria} className="btn-adicionar-categoria">Adicionar Categoria</button>
          </div>
        </div>

        <div className="categorias-lista">
          <h4>Categorias Existentes</h4>
          <div className="categorias-grid">
            {categoriasPersonalizadas.map((categoria) => (
              <div key={categoria} className="categoria-card">
                {categoriaEditando === categoria ? (
                  <div className="categoria-editando">
                    <input
                      type="text"
                      value={categoriaEditandoNome}
                      onChange={(e) => setCategoriaEditandoNome(e.target.value)}
                      placeholder="Novo nome"
                    />
                    <button onClick={() => editarCategoria(categoria, categoriaEditandoNome)} className="btn-salvar-cat">Salvar</button>
                    <button onClick={() => {
                      setCategoriaEditando(null);
                      setCategoriaEditandoNome('');
                    }} className="btn-cancelar-cat">Cancelar</button>
                  </div>
                ) : (
                  <div className="categoria-info">
                    <span className="categoria-nome">{categoria}</span>
                    <div className="categoria-actions">
                      <button onClick={() => {
                        setCategoriaEditando(categoria);
                        setCategoriaEditandoNome(categoria);
                      }} className="btn-editar-cat">Editar</button>
                      {categoriasPersonalizadas.length > 1 && (
                        <button onClick={() => excluirCategoria(categoria)} className="btn-excluir-cat">Excluir</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`formulario-produto ${produtoEditandoId !== null ? 'em-edicao' : ''}`} ref={formularioRef}>
        <h3>{produtoEditandoId !== null ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
        <div className="form-grid">

          <div className="comandou-form-group">
            <label>Nome</label>
            <input
              type="text"
              value={novoProduto.nome}
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  nome: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                })
              }
              placeholder="Ex: Licor 43 Chocolate"
            />
          </div>

          <div className="comandou-form-group">
            <label>Descrição</label>
            <input
              type="text"
              value={novoProduto.descricao}
              onChange={(e) =>
                setNovoProduto({
                  ...novoProduto,
                  descricao: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
                })
              }
              placeholder="Ex: Combina a doçura..."
            />
          </div>

          <div className="comandou-form-group">
            <label>Categoria</label>
            <select value={novoProduto.categoria} onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}>
              <option value="">Selecione</option>
              {categoriasPersonalizadas.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="comandou-form-group">
            <label>Quantidade em Estoque (garrafas)</label>
            <input
              type="number"
              min="0"
              value={novoProduto.quantidade}
              onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: e.target.value })}
              placeholder="Ex: 10"
            />
          </div>
          <div className="comandou-form-group">
            <label>Quantidade da Garrafa (ml)</label>
            <input
              type="number"
              value={novoProduto.mlGarrafa || ''}
              onChange={(e) => setNovoProduto({ ...novoProduto, mlGarrafa: e.target.value })}
              placeholder="Ex: 700ml"
            />
          </div>
          <div className="comandou-form-group">
            <label>Preço (Garrafa/Unidade)</label>
            <input
              type="number"
              step="0.01"
              value={novoProduto.preco}
              onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
              placeholder="Ex: 189,99"
            />
          </div>
          <div className="comandou-form-group">
            <label>Preço da Dose</label>
            <div className="dose-input-container">
              <input
                type="number"
                step="0.01"
                value={novoProduto.precoDose}
                onChange={(e) => {
                  setNovoProduto({ ...novoProduto, precoDose: e.target.value });
                  setCalcularDoseAutomaticamente(false);
                }}
                placeholder="Ex: 29,99"
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={calcularDoseAutomaticamente}
                  onChange={(e) => setCalcularDoseAutomaticamente(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    border: '2px solid #475bd1ff',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: calcularDoseAutomaticamente ? '#3f58e4ff' : 'transparent',
                    color: 'white',
                    fontSize: '12px',
                  }}
                >
                  {calcularDoseAutomaticamente ? '✓' : ''}
                </span>
                Calcular automaticamente
              </label>
            </div>
          </div>
          <div className="comandou-form-group">
            <label>Imagem do Produto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload-input"
            />
            {novoProduto.imagem && (
              <div className="image-preview">
                <img src={novoProduto.imagem} alt="Preview" className="preview-image" />
              </div>
            )}
          </div>
        </div>
        <div className="form-buttons">
          <button onClick={handleSalvarProduto} className="btn-salvar">{produtoEditandoId !== null ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
          {produtoEditandoId !== null && <button onClick={handleCancelarEdicao} className="btn-cancelar">Cancelar</button>}
        </div>
      </div>
      <div className="lista-produtos">
        <h3>Produtos do Cardápio</h3>
        <div className="produtos-grid">
          {cardapio.map((produto) => {
            const estoqueItem = estoque.find(e => e.id === produto.id) || { quantidade: 0 };
            return (
              <div key={produto.id} className="produto-card">
                <img src={produto.imagem || '/images/placeholder.png'} alt={produto.nome} className="produto-imagem" />
                <div className="produto-info">
                  <h4>{produto.nome}</h4>
                  <p>{produto.descricao}</p>
                  <div className="produto-precos">
                    {produto.precoDose ? (<><span>Dose: R$ {produto.precoDose.toFixed(2)}</span><span>Garrafa: R$ {produto.preco.toFixed(2)}</span></>) : (<span>Preço: R$ {produto.preco.toFixed(2)}</span>)}
                  </div>
                  {produto.mlGarrafa && <div className="produto-ml">Tamanho: {produto.mlGarrafa}ml</div>}
                  <div className="produto-categoria">Categoria: {produto.categoria}</div>
                  <div className="produto-estoque">
                    <label>Estoque:</label>
                    <input type="number" value={estoqueItem.quantidade} onChange={(e) => handleAtualizarEstoque(produto.id, parseInt(e.target.value) || 0)} min="0" />
                  </div>
                </div>
                <div className="produto-actions">
                  <button onClick={() => handleEditarProduto(produto.id)} className="btn-editar">Editar</button>
                  <button onClick={() => handleExcluirProduto(produto.id)} className="btn-excluir">Excluir</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CarrinhoItem = ({ item, index, onAumentarQuantidade, onDiminuirQuantidade, onRemoverItem }) => {
  return (
    <div className="carrinho-item">
      <div className="carrinho-item-imagem">
        <img src={item.imagem || '/images/placeholder.png'} alt={item.nome} />
      </div>

      <div className="carrinho-item-info">
        <h4>{item.nome}</h4>
        <p>{item.descricao}</p>

        {item.tipo === 'dose' && item.mlGarrafa && (
          <div className="carrinho-item-detalhes">
            <span>Tipo: {item.tipo === 'dose' ? 'Dose' : 'Garrafa'}</span>
            <span>Tamanho: {item.tipo === 'dose' ? '50ml' : `${item.mlGarrafa}ml`}</span>
          </div>
        )}

        <div className="carrinho-item-preco">R$ {item.preco.toFixed(2)}</div>

        <div className="carrinho-item-controles">
          <button className="btn-remover-item" onClick={() => onRemoverItem(index)}>
            <FaTrash />
          </button>
          <div className="quantidade-controle">
            <button className="minus-btn" onClick={() => onDiminuirQuantidade(index)}>
              <FaMinus />
            </button>
            <span>{item.quantidade || 1}</span>
            <button className="mais-btn" onClick={() => onAumentarQuantidade(index)}>
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardapioTab = ({ 
  onAdicionarPedido, 
  pedidoPronto, 
  pedidos, 
  pedidosEmPreparo, 
  estoque, 
  cardapio, 
  categoriasPersonalizadas, 
  isMobile 
}) => {
  const [carrinho, setCarrinho] = useState([]);
  const [pagamento, setPagamento] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [currentPedido, setCurrentPedido] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState({});
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [showCarrinho, setShowCarrinho] = useState(false);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const categorias = [
    { id: 'todos', nome: 'Todos os Itens' },
    ...categoriasPersonalizadas.map(cat => ({
      id: cat,
      nome: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  const opcoesDose = {
    destilado: [
      { nome: "Dose Simples (50ml)", multiplicador: 1 },
      { nome: "Meia Dose (25ml)", multiplicador: 0.5 },
      { nome: "Dose Dupla (100ml)", multiplicador: 2 }
    ],
    vinho: [
      { nome: "Taça Padrão (150ml)", multiplicador: 1 },
      { nome: "Taça Branco/Rosé (120ml)", multiplicador: 0.8 },
      { nome: "Degustação (50ml)", multiplicador: 0.33 }
    ],
    espumante: [
      { nome: "Taça Flute (120ml)", multiplicador: 1 },
      { nome: "Meia Taça (60ml)", multiplicador: 0.5 }
    ],
    licor: [
      { nome: "Dose (30ml)", multiplicador: 1 },
      { nome: "Dose Dupla (60ml)", multiplicador: 2 }
    ]
  };

  const adicionarAoCarrinho = (item, tipo) => {
    const itemExistenteIndex = carrinho.findIndex(prod =>
      prod.id === item.id &&
      prod.tipo === tipo &&
      (tipo !== 'dose' || prod.tamanho === (tamanhoSelecionado[item.id]?.nome || (opcoesDose[item.categoria] ? opcoesDose[item.categoria][0].nome : '')))
    );

    if (itemExistenteIndex !== -1) {
      const novoCarrinho = [...carrinho];
      novoCarrinho[itemExistenteIndex].quantidade = (novoCarrinho[itemExistenteIndex].quantidade || 1) + 1;
      setCarrinho(novoCarrinho);
    } else {
      if (tipo === 'garrafa') {
        const nomeComTipo = `${item.nome} (Garrafa)`;
        setCarrinho([...carrinho, {
          ...item,
          nome: nomeComTipo,
          preco: item.preco,
          tipo: 'garrafa',
          quantidade: 1
        }]);
      } else if (tipo === 'dose') {
        const tamanho = tamanhoSelecionado[item.id] || (opcoesDose[item.categoria] ? opcoesDose[item.categoria][0] : { multiplicador: 1, nome: '' });
        const preco = (item.precoDose || 0) * (tamanho.multiplicador || 1);
        const nomeComTipo = `${item.nome} (${tamanho.nome || 'Dose'})`;
        setCarrinho([...carrinho, {
          ...item,
          nome: nomeComTipo,
          preco,
          tipo: 'dose',
          tamanho: tamanho.nome,
          quantidade: 1
        }]);
      } else {
        setCarrinho([...carrinho, {
          ...item,
          tipo: 'unidade',
          quantidade: 1
        }]);
      }
    }

    setShowCarrinho(true);
  };

  const aumentarQuantidade = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho[index].quantidade = (novoCarrinho[index].quantidade || 1) + 1;
    setCarrinho(novoCarrinho);
  };

  const diminuirQuantidade = (index) => {
    const novoCarrinho = [...carrinho];
    if (novoCarrinho[index].quantidade > 1) {
      novoCarrinho[index].quantidade -= 1;
      setCarrinho(novoCarrinho);
    } else {
      removerDoCarrinho(index);
    }
  };

  const removerDoCarrinho = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);

    if (novoCarrinho.length === 0) {
      setShowCarrinho(false);
    }
  };

  const finalizarPedido = () => {
    if (carrinho.length === 0 || !pagamento || !nomeCliente) return;

    if (pagamento === 'pagseguro') {
      setPaymentStatus('waiting');

      setTimeout(() => {
        setPaymentStatus('success');
        setPaymentSuccess(true);

        const codigo = Math.floor(1000 + Math.random() * 9000);
        const novoPedido = {
          codigo,
          itens: carrinho,
          total: carrinho.reduce((sum, item) => sum + (item.preco || 0) * (item.quantidade || 1), 0),
          status: 'preparando',
          pagamento,
          cliente: nomeCliente,
          email: emailCliente,
          timestamp: new Date().getTime(),
          horaPedido: new Date().toLocaleTimeString()
        };

        setCurrentPedido(novoPedido);
        onAdicionarPedido(novoPedido);
        setCarrinho([]);
        setPagamento('');
        setTamanhoSelecionado({});
        setNomeCliente('');
        setEmailCliente('');

        setTimeout(() => {
          setShowCarrinho(false);
          setPaymentStatus('idle');
          setPaymentSuccess(false);
        }, 1000);
      }, 10000);
    } else {
      const codigo = Math.floor(1000 + Math.random() * 9000);
      const novoPedido = {
        codigo,
        itens: carrinho,
        total: carrinho.reduce((sum, item) => sum + (item.preco || 0) * (item.quantidade || 1), 0),
        status: 'preparando',
        pagamento,
        cliente: nomeCliente,
        email: emailCliente,
        timestamp: new Date().getTime(),
        horaPedido: new Date().toLocaleTimeString()
      };

      setCurrentPedido(novoPedido);
      onAdicionarPedido(novoPedido);
      setCarrinho([]);
      setPagamento('');
      setTamanhoSelecionado({});
      setNomeCliente('');
      setEmailCliente('');
      setShowCarrinho(false);
    }
  };

  const PaymentSuccess = () => {
    return (
      <div className="payment-success-container-cm">
        <div className="payment-success-cm">
          <FaCheckCircle className="success-icon-cm" />
          <h2>Pagamento Realizado com Sucesso!</h2>
          <p>Obrigado por escolher nossos serviços. Em instantes você será redirecionado.</p>
        </div>
      </div>
    );
  };

  const PaymentWaiting = () => {
    return (
      <div className="payment-waiting-container">
        <div className="payment-waiting">
          <div className="loading-spinner"></div>
          <h2>Aguardando Confirmação de Pagamento</h2>
          <p>Por favor, aguarde enquanto processamos seu pagamento.</p>
          <div className="countdown">5 segundos</div>
        </div>
      </div>
    );
  };

  const total = carrinho.reduce((sum, item) => sum + (item.preco || 0) * (item.quantidade || 1), 0);

  const pedidoAtivo = pedidoPronto ? pedidos.find(p => p.codigo === pedidoPronto) : currentPedido;

  const cardapioFiltrado = categoriaAtiva === 'todos' ? cardapio : cardapio.filter(item => item.categoria === categoriaAtiva);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [cardapioFiltrado]);

  return (
    <div className="tab-content cardapio-tab">
      {pedidoAtivo && (
        <div className={`nota-fiscal ${pedidoAtivo.status === 'pronto' ? 'pronto piscando' : ''}`}>
          <h3>Nota Fiscal Digital - Pedido #{pedidoAtivo.codigo}</h3>
          <div className="info-cliente">
            <p><strong>Cliente:</strong> {pedidoAtivo.cliente}</p>
            <p><strong>E-mail:</strong> {pedidoAtivo.email || 'Não informado'}</p>
            <p><strong>Pagamento:</strong> {pedidoAtivo.pagamento}</p>
            <p><strong>Status:</strong> {pedidoAtivo.status === 'pronto' ? 'PRONTO' : 'Em preparo'}</p>
          </div>
          <div className="nota-itens">
            <h4>Itens do Pedido:</h4>
            <ul>
              {pedidoAtivo.itens.map((item, index) => (
                <li key={index}>
                  {item.nome} {item.quantidade > 1 ? `(x${item.quantidade})` : ''} - R$ {(item.preco * (item.quantidade || 1)).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="nota-total"><strong>Total: R$ {pedidoAtivo.total.toFixed(2)}</strong></p>
          </div>
          <div className={`nota-aviso ${pedidoAtivo.status}`}>{pedidoAtivo.status === 'pronto' ? 'Seu pedido está pronto! Dirija-se ao balcão.' : 'Seu pedido está sendo preparado!'}</div>
        </div>
      )}

      <div className="cardapio-header">
        <h2>Cardápio</h2>
        <button
          className="cart-toggle"
          onClick={() => setShowCarrinho(!showCarrinho)}
          disabled={carrinho.length === 0}
        >
          <FaShoppingCart />
          {carrinho.length > 0 && <span className="carrinho-badge-cm">{carrinho.reduce((sum, item) => sum + (item.quantidade || 1), 0)}</span>}
        </button>
      </div>

      <div className="categorias-menu">
        {categorias.map(categoria => <button key={categoria.id} className={categoriaAtiva === categoria.id ? 'active' : ''} onClick={() => setCategoriaAtiva(categoria.id)}>{categoria.nome}</button>)}
      </div>

      <div className="cardapio-container">
        <div className="itens-cardapio">
          <div className="bebidas-grid horizontal" ref={scrollContainerRef}>
            {cardapioFiltrado.map((item) => {
              const estoqueItem = estoque.find(e => e.id === item.id) || { quantidade: 0 };
              const disponivel = estoqueItem.quantidade > 0;
              return (
                <div key={item.id} className={`bebida-card horizontal ${!disponivel ? 'esgotado' : ''}`}>

                  <div className="bebida-icon-container">
                    <img src={item.imagem || '/images/placeholder.png'} alt={item.nome} className="bebida-imagem" />
                  </div>

                  <div className="bebida-info">
                    <span className="bebida-nome">{item.nome}</span>
                    <span className="bebida-descricao">{item.descricao}</span>
                    <div className="bebida-estoque">{disponivel ? `Disponível: ${estoqueItem.quantidade}` : 'ESGOTADO'}</div>
                    <div className="bebida-precos">
                      {item.precoDose ? (
                        <>
                          <span>Dose: R$ {item.precoDose.toFixed(2)}</span>
                          <span>Garrafa: R$ {item.preco.toFixed(2)}</span>
                        </>
                      ) : (
                        <span>Preço: R$ {item.preco.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="bebida-actions">
                    {disponivel && item.precoDose ? (
                      <>
                        <div className="dose-options">
                          <select value={tamanhoSelecionado[item.id]?.nome || (opcoesDose[item.categoria] ? opcoesDose[item.categoria][0].nome : '')} onChange={(e) => {
                            const selected = opcoesDose[item.categoria]?.find(opt => opt.nome === e.target.value);
                            setTamanhoSelecionado({ ...tamanhoSelecionado, [item.id]: selected });
                          }}>
                            {opcoesDose[item.categoria]?.map((opcao, idx) => <option key={idx} value={opcao.nome}>{opcao.nome}</option>)}
                          </select>
                          <button onClick={() => adicionarAoCarrinho(item, 'dose')} className="btn-adicionar">+ Dose</button>
                        </div>
                        <button onClick={() => adicionarAoCarrinho(item, 'garrafa')} className="btn-adicionar">+ Garrafa</button>
                      </>
                    ) : disponivel ? (
                      <button onClick={() => adicionarAoCarrinho(item, 'unidade')} className="btn-adicionar">Adicionar</button>
                    ) : (
                      <button className="btn-adicionar" disabled>Esgotado</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className={`carrinho-lateral ${showCarrinho ? 'active' : ''}`}>
          <div className="carrinho-lateral-header">
            <h3>Seu Pedido</h3>
            <button className="close-carrinho" onClick={() => setShowCarrinho(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="carrinho-lateral-content">
            {paymentStatus === 'waiting' ? (
              <PaymentWaiting />
            ) : paymentStatus === 'success' ? (
              <PaymentSuccess />
            ) : carrinho.length === 0 ? (
              <p className="carrinho-vazio">Seu carrinho está vazio</p>
            ) : (
              <>
                <div className="carrinho-itens">
                  {carrinho.map((item, index) => (
                    <CarrinhoItem
                      key={index}
                      item={item}
                      index={index}
                      onAumentarQuantidade={aumentarQuantidade}
                      onDiminuirQuantidade={diminuirQuantidade}
                      onRemoverItem={removerDoCarrinho}
                    />
                  ))}
                </div>

                <div className="carrinho-total">
                  <strong>Total: R$ {total.toFixed(2)}</strong>
                </div>

                <div className="dados-cliente">
                  <div className="form-group">
                    <label>Nome do Cliente *</label>
                    <input
                      type="text"
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      value={emailCliente}
                      onChange={(e) => setEmailCliente(e.target.value)}
                      placeholder="Seu e-mail"
                    />
                  </div>
                </div>

                <div className="pagamento">
                  <label>
                    <input
                      type="radio"
                      name="pagamento"
                      value="pagseguro"
                      checked={pagamento === 'pagseguro'}
                      onChange={() => setPagamento('pagseguro')}
                    />
                    <img src="/images/pagseguro.png" alt="PagSeguro" className="pagamento-icon" />
                    PagSeguro
                  </label>
                </div>

                <button
                  onClick={finalizarPedido}
                  className="btn-finalizar"
                  disabled={!pagamento || !nomeCliente}
                >
                  Finalizar Pedido
                </button>
              </>
            )
            }
          </div>
        </div>
      )}

      {isMobile && showCarrinho && (
        <div className="carrinho-mobile-overlay">
          <div className="carrinho-mobile">
            <div className="carrinho-mobile-header">
              <h3>Seu Pedido</h3>
              <button className="close-carrinho" onClick={() => setShowCarrinho(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="carrinho-mobile-content">
              {carrinho.length === 0 ? (
                <p className="carrinho-vazio">Seu carrinho está vazio</p>
              ) : (
                <>
                  <div className="carrinho-itens">
                    {carrinho.map((item, index) => (
                      <CarrinhoItem
                        key={index}
                        item={item}
                        index={index}
                        onAumentarQuantidade={aumentarQuantidade}
                        onDiminuirQuantidade={diminuirQuantidade}
                        onRemoverItem={removerDoCarrinho}
                      />
                    ))}
                  </div>

                  <div className="carrinho-total">
                    <strong>Total: R$ {total.toFixed(2)}</strong>
                  </div>

                  <div className="dados-cliente">
                    <div className="form-group">
                      <label>Nome do Cliente *</label>
                      <input
                        type="text"
                        value={nomeCliente}
                        onChange={(e) => setNomeCliente(e.target.value)}
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>E-mail</label>
                      <input
                        type="email"
                        value={emailCliente}
                        onChange={(e) => setEmailCliente(e.target.value)}
                        placeholder="Seu e-mail"
                      />
                    </div>
                  </div>

                  <div className="pagamento">
                    <label>
                      <input
                        type="radio"
                        name="pagamento"
                        value="pagseguro"
                        checked={pagamento === 'pagseguro'}
                        onChange={() => setPagamento('pagseguro')}
                      />
                      <img src="/images/pagseguro.png" alt="PagSeguro" className="pagamento-icon" />
                      PagSeguro
                    </label>
                  </div>

                  <button
                    onClick={finalizarPedido}
                    className="btn-finalizar"
                    disabled={!pagamento || !nomeCliente}
                  >
                    Finalizar Pedido
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {paymentStatus === 'waiting' && (
        <div className="payment-waiting-container">
          <div className="payment-waiting">
            <div className="loading-spinner"></div>
            <h2>Aguardando Confirmação de Pagamento</h2>
            <p>Por favor, aguarde enquanto processamos seu pagamento.</p>
            <div className="countdown">5 segundos</div>
          </div>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="payment-success-container-cm">
          <div className="payment-success-cm">
            <FaCheckCircle className="success-icon-cm" />
            <h2>Pagamento Realizado com Sucesso!</h2>
            <p>Obrigado por escolher nossos serviços. Em instantes você será redirecionado.</p>
          </div>
        </div>
      )}
    </div>
  );
};

function Comandou() {
  const [activeTab, setActiveTab] = useState('cardapio');
  const [pedidos, setPedidos] = useState([]);
  const [pedidoPronto, setPedidoPronto] = useState(null);
  const [pedidosEmPreparo, setPedidosEmPreparo] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [theme, setTheme] = useState('dark');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showHeader, setShowHeader] = useState(true);

  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState([
    'vinho', 'destilado', 'cerveja', 'espumante', 'licor', 'agua', 'chopp', 'petisco', 'porcao'
  ]);

  const [cardapio, setCardapio] = useState([
    { id: 1, nome: 'Vinho Bordô Suave Tradição 1000ml', descricao: 'Vinho tinto suave da linha Tradição', preco: 28.40, precoDose: 12.90, mlGarrafa: 1000, categoria: "vinho", imagem: '/images/vinho-tinto.png' },
    { id: 2, nome: 'Whisky Jack Daniels N. 7 1000ml', descricao: 'Whisky Tennessee premium', preco: 145.00, precoDose: 25.90, mlGarrafa: 1000, categoria: "destilado", imagem: '/images/whisky.png' },
    { id: 3, nome: 'Cerveja Heineken Long Neck 330ml', descricao: 'Cerveja pilsen premium importada', preco: 7.49, mlGarrafa: 330, categoria: "cerveja", imagem: '/images/cerveja.png' },
    { id: 4, nome: 'Vodka Smirnoff 998ml', descricao: 'Vodka premium destilada', preco: 39.99, precoDose: 15.90, categoria: "destilado", imagem: '/images/vodka.png' },
    { id: 5, nome: 'Gin Rock\'s Strawberry 700ml', descricao: 'Gin com sabor de morango', preco: 45.00, precoDose: 16.90, categoria: "destilado", imagem: '/images/gin.png' },
    { id: 6, nome: 'Tequila Jose Cuervo Especial Gold 750ml', descricao: 'Tequila premium mexicana', preco: 169.00, precoDose: 28.90, categoria: "destilado", imagem: '/images/tequila.png' },
    { id: 7, nome: 'Rum Explorer Trinidad 700ml', descricao: 'Rum premium das ilhas caribenhas', preco: 245.13, precoDose: 35.90, categoria: "destilado", imagem: '/images/rum.png' },
    { id: 8, nome: 'Licor Sheridans Coffee Layered Liqueur 700ml', descricao: 'Licor irlandês de café', preco: 199.00, precoDose: 22.90, categoria: "licor", imagem: '/images/licor.png' },
    { id: 9, nome: 'Conhaque Hennessy Very Special 700ml', descricao: 'Conhaque francês premium', preco: 480.00, precoDose: 65.90, categoria: "destilado", imagem: '/images/conhaque.png' },
    { id: 10, nome: 'Champagne Veuve Clicquot Brut 750ml', descricao: 'Champagne francês brut', preco: 519.90, precoDose: 45.90, categoria: "espumante", imagem: '/images/champagne.png' },
    { id: 11, nome: 'Caneca De Vidro Roma Para Chopp 345ml', descricao: 'Caneca de vidro para chopp', preco: 28.50, categoria: "chopp", imagem: '/images/chopp.png' },
    { id: 12, nome: 'Cerveja Skol Lata 269ml', descricao: 'Cerveja pilsen brasileira', preco: 3.39, categoria: "cerveja", imagem: '/images/cerveja-skol.png' },
    { id: 13, nome: 'Cerveja Budweiser American Lager 350ml', descricao: 'Cerveja lager americana', preco: 4.29, categoria: "cerveja", imagem: '/images/cerveja-bud.png' },
    { id: 14, nome: 'Água Mineral Minalba 510ml Sem Gás', descricao: 'Água mineral sem gás', preco: 2.50, categoria: "agua", imagem: '/images/agua-semgas.png' },
    { id: 15, nome: 'Água Mineral Com Gás Garrafa 500ml Crystal', descricao: 'Água mineral com gás', preco: 3.50, categoria: "agua", imagem: '/images/agua-comgas.png' },
    { id: 16, nome: 'Amendoim 100g', descricao: 'Amendoim torrado e salgado', preco: 8.00, categoria: "petisco", imagem: '/images/amendoim.png' },
    { id: 17, nome: 'Mix Castanhas 150g', descricao: 'Mix de castanhas e frutas secas', preco: 15.00, categoria: "petisco", imagem: '/images/mix-castanhas.png' },
    { id: 18, nome: 'Batata Chips 120g', descricao: 'Batata chips sabor original', preco: 10.00, categoria: "petisco", imagem: '/images/batata-chips.png' },
    { id: 19, nome: 'Salame 100g', descricao: 'Salame italiano fatiado', preco: 18.00, categoria: "petisco", imagem: '/images/salame.png' },
    { id: 20, nome: 'Queijos 150g', descricao: 'Tabua de queijos variados', preco: 25.00, categoria: "petisco", imagem: '/images/queijos.png' },
    { id: 21, nome: 'Azeitonas 100g', descricao: 'Azeitonas verdes e pretas', preco: 12.00, categoria: "petisco", imagem: '/images/azeitonas.png' },
    { id: 22, nome: 'Batata Frita 200g', descricao: 'Porção de batata frita crocante', preco: 20.00, categoria: "porcao", imagem: '/images/batata-frita.png' },
    { id: 23, nome: 'Mandioca Frita 200g', descricao: 'Porção de mandioca frita', preco: 22.00, categoria: "porcao", imagem: '/images/mandioca-frita.png' },
    { id: 24, nome: 'Frango a Passarinho 250g', descricao: 'Porção de frango a passarinho', preco: 28.00, categoria: "porcao", imagem: '/images/frango-passarinho.png' },
    { id: 25, nome: 'Isca de Peixe 250g', descricao: 'Porção de isca de peixe', preco: 32.00, categoria: "porcao", imagem: '/images/isca-peixe.png' },
    { id: 26, nome: 'Linguiça Acebolada 200g', descricao: 'Porção de linguiça acebolada', preco: 26.00, categoria: "porcao", imagem: '/images/linguica-acebolada.png' },
    { id: 27, nome: 'Torresmo 150g', descricao: 'Porção de torresmo crocante', preco: 18.00, categoria: "porcao", imagem: '/images/torresmo.png' },
    { id: 28, nome: 'Queijo Coalho 200g', descricao: 'Porção de queijo coalho grelhado', preco: 24.00, categoria: "porcao", imagem: '/images/queijo-coalho.png' },
    { id: 29, nome: 'Onion Rings 150g', descricao: 'Porção de anéis de cebola empanados', preco: 16.00, categoria: "porcao", imagem: '/images/onion-rings.png' }
  ]);

  const [estoque, setEstoque] = useState([
    { id: 1, nome: 'Vinho Bordô Suave Tradição 1000ml', quantidade: 10 },
    { id: 2, nome: 'Whisky Jack Daniels N. 7 1000ml', quantidade: 8 },
    { id: 3, nome: 'Cerveja Heineken Long Neck 330ml', quantidade: 24 },
    { id: 4, nome: 'Vodka Smirnoff 998ml', quantidade: 12 },
    { id: 5, nome: 'Gin Rock\'s Strawberry 700ml', quantidade: 6 },
    { id: 6, nome: 'Tequila Jose Cuervo Especial Gold 750ml', quantidade: 7 },
    { id: 7, nome: 'Rum Explorer Trinidad 700ml', quantidade: 5 },
    { id: 8, nome: 'Licor Sheridans Coffee Layered Liqueur 700ml', quantidade: 4 },
    { id: 9, nome: 'Conhaque Hennessy Very Special 700ml', quantidade: 2 },
    { id: 10, nome: 'Champagne Veuve Clicquot Brut 750ml', quantidade: 9 },
    { id: 11, nome: 'Caneca De Vidro Roma Para Chopp 345ml', quantidade: 15 },
    { id: 12, nome: 'Cerveja Skol Lata 269ml', quantidade: 36 },
    { id: 13, nome: 'Cerveja Budweiser American Lager 350ml', quantidade: 30 },
    { id: 14, nome: 'Água Mineral Minalba 510ml Sem Gás', quantidade: 20 },
    { id: 15, nome: 'Água Mineral Com Gás Garrafa 500ml Crystal', quantidade: 18 },
    { id: 16, nome: 'Amendoim 100g', quantidade: 15 },
    { id: 17, nome: 'Mix Castanhas 150g', quantidade: 12 },
    { id: 18, nome: 'Batata Chips 120g', quantidade: 20 },
    { id: 19, nome: 'Salame 100g', quantidade: 8 },
    { id: 20, nome: 'Queijos 150g', quantidade: 10 },
    { id: 21, nome: 'Azeitonas 100g', quantidade: 18 },
    { id: 22, nome: 'Batata Frita 200g', quantidade: 25 },
    { id: 23, nome: 'Mandioca Frita 200g', quantidade: 15 },
    { id: 24, nome: 'Frango a Passarinho 250g', quantidade: 12 },
    { id: 25, nome: 'Isca de Peixe 250g', quantidade: 10 },
    { id: 26, nome: 'Linguiça Acebolada 200g', quantidade: 14 },
    { id: 27, nome: 'Torresmo 150g', quantidade: 20 },
    { id: 28, nome: 'Queijo Coalho 200g', quantidade: 16 },
    { id: 29, nome: 'Onion Rings 150g', quantidade: 18 }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (mobile && activeTab === 'login') {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleLogin = (status, email, role) => {
    setIsAuthenticated(status);
    setUserEmail(email);
    setUserRole(role);
    setShowWelcome(false);
    setActiveTab('comanda');
    setShowHeader(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserRole('');
    setShowWelcome(true);
    setActiveTab('cardapio');
  };

  const handleClientEnter = () => {
    setShowWelcome(false);
    setActiveTab('cardapio');
  };

  const handleEmployeeEnter = () => {
    setShowWelcome(false);
    setActiveTab('login');

    if (isMobile) {
      setShowHeader(false);
    }
  };

  const adicionarPedido = (novoPedido) => {
    const pedidoComStatus = { ...novoPedido, status: 'preparando', horaPedido: new Date().toLocaleTimeString() };
    setPedidos(prev => [...prev, pedidoComStatus]);
    setPedidosEmPreparo(prev => [...prev, pedidoComStatus.codigo]);
    const novoEstoque = estoque.map(s => ({ ...s }));
    novoPedido.itens.forEach(item => {
      const itemEstoque = novoEstoque.find(e => e.id === item.id);
      if (itemEstoque && itemEstoque.quantidade > 0) itemEstoque.quantidade -= (item.quantidade || 1);
    });
    setEstoque(novoEstoque);
    window.scrollTo(0, 0);
  };

  const marcarComoPronto = (codigoPedido) => {
    setPedidos(prev => prev.map(pedido => pedido.codigo === codigoPedido ? { ...pedido, status: 'pronto' } : pedido));
    setPedidosEmPreparo(prev => prev.filter(codigo => codigo !== codigoPedido));
    setPedidoPronto(codigoPedido);
    setTimeout(() => setPedidoPronto(null), 120000);
  };

  const atualizarCardapio = (novoCardapio) => setCardapio(novoCardapio);

  if (showWelcome) {
    return <WelcomeScreen onClientEnter={handleClientEnter} onEmployeeEnter={handleEmployeeEnter} isMobile={isMobile} />;
  }

  return (
    <div className="comandou">
      {showHeader && activeTab !== 'login' && (
        <Header
          logo="/images/logo-comandou.png"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          toggleTheme={toggleTheme}
          user={isAuthenticated ? userEmail : null}
          userRole={userRole}
          onLogout={handleLogout}
          onLogoClick={() => window.location.href = "/comandou"}
          isMobile={isMobile}
        />
      )}
      <main className="main-content">
        {activeTab === 'login' ? (
          <LoginComandou onLogin={handleLogin} isMobile={isMobile} />
        ) : activeTab === 'comanda' ? (
          <ComandaTab
            pedidos={pedidos}
            onPedidoPronto={marcarComoPronto}
            onLogout={handleLogout}
            estoque={estoque}
            isMobile={isMobile}
            userRole={userRole}
          />
        ) : activeTab === 'gerenciamento' ? (
          <GerenciamentoTab
            cardapio={cardapio}
            estoque={estoque}
            onAtualizarCardapio={atualizarCardapio}
            onAtualizarEstoque={(novo) => setEstoque(novo)}
            categoriasPersonalizadas={categoriasPersonalizadas}
            onAtualizarCategorias={setCategoriasPersonalizadas}
            isMobile={isMobile}
          />
        ) : (
          <CardapioTab
            onAdicionarPedido={adicionarPedido}
            pedidoPronto={pedidoPronto}
            pedidos={pedidos}
            pedidosEmPreparo={pedidosEmPreparo}
            estoque={estoque}
            cardapio={cardapio}
            categoriasPersonalizadas={categoriasPersonalizadas}
            isMobile={isMobile}
          />
        )}
      </main>
    </div>
  );
}

export default Comandou;
