import React, { useState, useEffect, useRef } from 'react';
import { FaTachometerAlt, FaBoxes, FaWarehouse, FaTruck, FaExchangeAlt, FaCog, FaUsers, FaChartBar, FaCalendarAlt, FaPlus, FaTrash, FaUpload, FaEdit, FaSave, FaTimes, FaChevronLeft, FaChevronRight, FaBell, FaBars, FaCheck, FaSignOutAlt, FaUser, FaLock, FaEye, FaEyeSlash, FaUserTie, FaExclamationTriangle } from 'react-icons/fa';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import './Estock.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function Estock() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    cargo: ''
  });

  const rolePermissions = {
    'administrador': ['dashboard', 'produtos', 'estoque', 'fornecedores', 'movimentacoes', 'sistema', 'usuarios'],
    'gerente': ['dashboard', 'produtos', 'estoque', 'fornecedores', 'movimentacoes'],
    'supervisor': ['dashboard', 'estoque', 'movimentacoes'],
    'funcionario': ['dashboard', 'estoque', 'movimentacoes'],
    'financeiro': ['dashboard', 'movimentacoes']
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeMetric, setActiveMetric] = useState('dia');
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    quantidade: 0,
    shots: 0,
    validade: '',
    imagem: null,
    fornecedorId: '',
    capacidade: 0,
    shotMl: 50,
    categoria: '',
    preco: 0,
    precoDose: 0
  });
  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: '',
    contato: '',
    email: '',
    telefone: ''
  });
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    cargo: '',
    email: '',
    notificacoesEmail: true
  });
  const [editandoFornecedor, setEditandoFornecedor] = useState(null);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [configuracoes, setConfiguracoes] = useState({
    notificacoesEmail: true,
    alertaEstoqueMinimo: 5,
    dadosEmpresa: {
      nome: '',
      cnpj: '',
      endereco: '',
      telefone: '',
      logo: null
    },
    configuracoesGerais: {
      idioma: 'pt-BR',
      fusoHorario: 'America/Sao_Paulo',
      moeda: 'BRL'
    },
    parametrosEstoque: {
      estoqueMinimo: 5,
      permitirEstoqueNegativo: false,
      unidadePadrao: 'unidade'
    },
    notificacoes: {
      email: true,
      emailContato: '',
      whatsapp: false,
      whatsappNumero: '',
      popup: true
    },
    movimentacoes: {
      permitirEdicao: true,
      tempoLimiteEdicao: 24,
      mostrarHistorico: true,
      confirmarExclusao: true
    },
    alertas: {
      alertaPercentual: 30,
      produtosVencidos: true,
      fornecedoresInativos: true
    }
  });
  const [previewImagem, setPreviewImagem] = useState(null);
  const fileInputRef = useRef(null);

  const [vendasData, setVendasData] = useState({
    dia: Array(24).fill().map((_, i) => ({ hora: i, valor: Math.floor(Math.random() * 100) })),
    mes: Array(30).fill().map((_, i) => ({ dia: i + 1, valor: Math.floor(Math.random() * 500) })),
    ano: Array(12).fill().map((_, i) => ({ mes: i + 1, valor: Math.floor(Math.random() * 3000) }))
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const produtosIniciais = [
      { id: 1, nome: 'Vinho Bordô Suave Tradição 1000ml', quantidade: 10, shots: 20, validade: '2024-12-31', imagem: '/images/vinho-tinto.png', fornecedorId: 1, capacidade: 1000, shotMl: 50, categoria: "vinho", preco: 28.40, precoDose: 12.90 },
      { id: 2, nome: 'Whisky Jack Daniels N. 7 1000ml', quantidade: 8, shots: 20, validade: '2025-11-15', imagem: '/images/whisky.png', fornecedorId: 1, capacidade: 1000, shotMl: 50, categoria: "destilado", preco: 145.00, precoDose: 25.90 },
      { id: 3, nome: 'Cerveja Heineken Long Neck 330ml', quantidade: 24, shots: 1, validade: '2023-10-30', imagem: '/images/cerveja.png', fornecedorId: 2, capacidade: 330, shotMl: 330, categoria: "cerveja", preco: 7.49 },
      { id: 4, nome: 'Vodka Smirnoff 998ml', quantidade: 12, shots: 20, validade: '2024-08-20', imagem: '/images/vodka.png', fornecedorId: 1, capacidade: 998, shotMl: 50, categoria: "destilado", preco: 39.99, precoDose: 15.90 },
      { id: 5, nome: 'Gin Rock\'s Strawberry 700ml', quantidade: 6, shots: 14, validade: '2024-05-15', imagem: '/images/gin.png', fornecedorId: 2, capacidade: 700, shotMl: 50, categoria: "destilado", preco: 45.00, precoDose: 16.90 },
      { id: 6, nome: 'Tequila Jose Cuervo Especial Gold 750ml', quantidade: 7, shots: 15, validade: '2024-09-20', imagem: '/images/tequila.png', fornecedorId: 1, capacidade: 750, shotMl: 50, categoria: "destilado", preco: 169.00, precoDose: 28.90 },
      { id: 7, nome: 'Rum Explorer Trinidad 700ml', quantidade: 5, shots: 14, validade: '2025-01-15', imagem: '/images/rum.png', fornecedorId: 2, capacidade: 700, shotMl: 50, categoria: "destilado", preco: 245.13, precoDose: 35.90 },
      { id: 8, nome: 'Licor Sheridans Coffee Layered Liqueur 700ml', quantidade: 4, shots: 14, validade: '2024-11-30', imagem: '/images/licor.png', fornecedorId: 1, capacidade: 700, shotMl: 50, categoria: "licor", preco: 199.00, precoDose: 22.90 },
      { id: 9, nome: 'Conhaque Hennessy Very Special 700ml', quantidade: 2, shots: 14, validade: '2026-03-10', imagem: '/images/conhaque.png', fornecedorId: 1, capacidade: 700, shotMl: 50, categoria: "destilado", preco: 480.00, precoDose: 65.90 },
      { id: 10, nome: 'Champagne Veuve Clicquot Brut 750ml', quantidade: 9, shots: 15, validade: '2024-07-25', imagem: '/images/champagne.png', fornecedorId: 2, capacidade: 750, shotMl: 50, categoria: "espumante", preco: 519.90, precoDose: 45.90 },
      { id: 11, nome: 'Caneca De Vidro Roma Para Chopp 345ml', quantidade: 15, shots: 1, validade: '2024-12-31', imagem: '/images/chopp.png', fornecedorId: 3, capacidade: 345, shotMl: 345, categoria: "chopp", preco: 28.50 },
      { id: 12, nome: 'Cerveja Skol Lata 269ml', quantidade: 36, shots: 1, validade: '2023-12-31', imagem: '/images/cerveja-skol.png', fornecedorId: 3, capacidade: 269, shotMl: 269, categoria: "cerveja", preco: 3.39 },
      { id: 13, nome: 'Cerveja Budweiser American Lager 350ml', quantidade: 30, shots: 1, validade: '2023-12-31', imagem: '/images/cerveja-bud.png', fornecedorId: 3, capacidade: 350, shotMl: 350, categoria: "cerveja", preco: 4.29 },
      { id: 14, nome: 'Água Mineral Minalba 510ml Sem Gás', quantidade: 20, shots: 1, validade: '2024-12-31', imagem: '/images/agua-semgas.png', fornecedorId: 4, capacidade: 510, shotMl: 510, categoria: "agua", preco: 2.50 },
      { id: 15, nome: 'Água Mineral Com Gás Garrafa 500ml Crystal', quantidade: 18, shots: 1, validade: '2024-12-31', imagem: '/images/agua-comgas.png', fornecedorId: 4, capacidade: 500, shotMl: 500, categoria: "agua", preco: 3.50 },
      { id: 16, nome: 'Amendoim 100g', quantidade: 15, shots: 1, validade: '2023-10-30', imagem: '/images/amendoim.png', fornecedorId: 5, capacidade: 100, shotMl: 100, categoria: "petisco", preco: 8.00 },
      { id: 17, nome: 'Mix Castanhas 150g', quantidade: 12, shots: 1, validade: '2023-11-15', imagem: '/images/mix-castanhas.png', fornecedorId: 5, capacidade: 150, shotMl: 150, categoria: "petisco", preco: 15.00 },
      { id: 18, nome: 'Batata Chips 120g', quantidade: 20, shots: 1, validade: '2023-10-20', imagem: '/images/batata-chips.png', fornecedorId: 5, capacidade: 120, shotMl: 120, categoria: "petisco", preco: 10.00 },
      { id: 19, nome: 'Salame 100g', quantidade: 8, shots: 1, validade: '2023-09-30', imagem: '/images/salame.png', fornecedorId: 5, capacidade: 100, shotMl: 100, categoria: "petisco", preco: 18.00 },
      { id: 20, nome: 'Queijos 150g', quantidade: 10, shots: 1, validade: '2023-09-25', imagem: '/images/queijos.png', fornecedorId: 5, capacidade: 150, shotMl: 150, categoria: "petisco", preco: 25.00 },
      { id: 21, nome: 'Azeitonas 100g', quantidade: 18, shots: 1, validade: '2023-11-10', imagem: '/images/azeitonas.png', fornecedorId: 5, capacidade: 100, shotMl: 100, categoria: "petisco", preco: 12.00 },
      { id: 22, nome: 'Batata Frita 200g', quantidade: 25, shots: 1, validade: '2023-10-05', imagem: '/images/batata-frita.png', fornecedorId: 5, capacidade: 200, shotMl: 200, categoria: "porcao", preco: 20.00 },
      { id: 23, nome: 'Mandioca Frita 200g', quantidade: 15, shots: 1, validade: '2023-10-10', imagem: '/images/mandioca-frita.png', fornecedorId: 5, capacidade: 200, shotMl: 200, categoria: "porcao", preco: 22.00 },
      { id: 24, nome: 'Frango a Passarinho 250g', quantidade: 12, shots: 1, validade: '2023-09-20', imagem: '/images/frango-passarinho.png', fornecedorId: 5, capacidade: 250, shotMl: 250, categoria: "porcao", preco: 28.00 },
      { id: 25, nome: 'Isca de Peixe 250g', quantidade: 10, shots: 1, validade: '2023-09-15', imagem: '/images/isca-peixe.png', fornecedorId: 5, capacidade: 250, shotMl: 250, categoria: "porcao", preco: 32.00 },
      { id: 26, nome: 'Linguiça Acebolada 200g', quantidade: 14, shots: 1, validade: '2023-10-15', imagem: '/images/linguica-acebolada.png', fornecedorId: 5, capacidade: 200, shotMl: 200, categoria: "porcao", preco: 26.00 },
      { id: 27, nome: 'Torresmo 150g', quantidade: 20, shots: 1, validade: '2023-10-25', imagem: '/images/torresmo.png', fornecedorId: 5, capacidade: 150, shotMl: 150, categoria: "porcao", preco: 18.00 },
      { id: 28, nome: 'Queijo Coalho 200g', quantidade: 16, shots: 1, validade: '2023-09-28', imagem: '/images/queijo-coalho.png', fornecedorId: 5, capacidade: 200, shotMl: 200, categoria: "porcao", preco: 24.00 },
      { id: 29, nome: 'Onion Rings 150g', quantidade: 18, shots: 1, validade: '2023-10-08', imagem: '/images/onion-rings.png', fornecedorId: 5, capacidade: 150, shotMl: 150, categoria: "porcao", preco: 16.00 }
    ];
    setProdutos(produtosIniciais);

    const fornecedoresIniciais = [
      {
        id: 1,
        nome: 'Distribuidora de Bebidas LTDA',
        contato: 'Carlos Silva',
        email: 'contato@distribuidora.com',
        telefone: '(11) 1234-5678'
      },
      {
        id: 2,
        nome: 'Importadora de Vinhos',
        contato: 'Ana Santos',
        email: 'vendas@importvinhos.com',
        telefone: '(11) 9876-5432'
      },
      {
        id: 3,
        nome: 'Cervejaria Nacional',
        contato: 'Pedro Almeida',
        email: 'pedro@cervejarianacional.com',
        telefone: '(11) 5555-9999'
      },
      {
        id: 4,
        nome: 'Águas Puras',
        contato: 'Maria Oliveira',
        email: 'vendas@aguaspuras.com',
        telefone: '(11) 4444-8888'
      },
      {
        id: 5,
        nome: 'Petiscos & Companhia',
        contato: 'João Santos',
        email: 'joao@petiscos.com',
        telefone: '(11) 3333-7777'
      }
    ];
    setFornecedores(fornecedoresIniciais);

    const usuariosIniciais = [
      {
        id: 1,
        nome: 'João Alberto',
        cargo: 'administrador',
        email: 'joao@empresa.com',
        password: 'admin123',
        notificacoesEmail: true
      },
      {
        id: 2,
        nome: 'Maria Silva',
        cargo: 'funcionario',
        email: 'maria@empresa.com',
        password: 'user123',
        notificacoesEmail: false
      },
      {
        id: 3,
        nome: 'Carlos Santos',
        cargo: 'gerente',
        email: 'carlos@empresa.com',
        password: 'gerente123',
        notificacoesEmail: true
      },
      {
        id: 4,
        nome: 'Ana Oliveira',
        cargo: 'supervisor',
        email: 'ana@empresa.com',
        password: 'super123',
        notificacoesEmail: true
      },
      {
        id: 5,
        nome: 'Pedro Costa',
        cargo: 'financeiro',
        email: 'pedro@empresa.com',
        password: 'finance123',
        notificacoesEmail: false
      }
    ];
    setUsuarios(usuariosIniciais);

    const movimentacoesIniciais = [
      { id: 1, data: '2023-10-01 09:15', tipo: 'entrada', produto: 'Vinho Bordô Suave Tradição 1000ml', quantidade: 10, funcionario: 'João Alberto', observacao: 'Compra mensal' },
      { id: 2, data: '2023-10-01 10:30', tipo: 'saida', produto: 'Whisky Jack Daniels N. 7 1000ml', quantidade: 2, funcionario: 'Maria Silva', observacao: 'Venda balcão' },
      { id: 3, data: '2023-10-02 14:20', tipo: 'entrada', produto: 'Cerveja Heineken Long Neck 330ml', quantidade: 24, funcionario: 'Carlos Santos', observacao: 'Estoque cervejas' },
      { id: 4, data: '2023-10-02 16:45', tipo: 'ajuste', produto: 'Vodka Smirnoff 998ml', quantidade: 5, funcionario: 'Ana Oliveira', observacao: 'Ajuste inventário' },
      { id: 5, data: '2023-10-03 08:30', tipo: 'saida', produto: 'Gin Rock\'s Strawberry 700ml', quantidade: 1, funcionario: 'Pedro Costa', observacao: 'Venda delivery' },
      { id: 6, data: '2023-10-03 11:15', tipo: 'entrada', produto: 'Tequila Jose Cuervo Especial Gold 750ml', quantidade: 6, funcionario: 'João Alberto', observacao: 'Reposição' },
      { id: 7, data: '2023-10-04 13:40', tipo: 'saida', produto: 'Rum Explorer Trinidad 700ml', quantidade: 2, funcionario: 'Maria Silva', observacao: 'Venda balcão' },
      { id: 8, data: '2023-10-04 15:20', tipo: 'entrada', produto: 'Licor Sheridans Coffee Layered Liqueur 700ml', quantidade: 4, funcionario: 'Carlos Santos', observacao: 'Nova aquisição' },
      { id: 9, data: '2023-10-05 09:50', tipo: 'saida', produto: 'Conhaque Hennessy Very Special 700ml', quantidade: 1, funcionario: 'Ana Oliveira', observacao: 'Venda especial' },
      { id: 10, data: '2023-10-05 17:30', tipo: 'entrada', produto: 'Champagne Veuve Clicquot Brut 750ml', quantidade: 8, funcionario: 'Pedro Costa', observacao: 'Estoque festas' },
      { id: 11, data: '2023-10-06 10:10', tipo: 'saida', produto: 'Caneca De Vidro Roma Para Chopp 345ml', quantidade: 3, funcionario: 'João Alberto', observacao: 'Venda balcão' },
      { id: 12, data: '2023-10-06 14:35', tipo: 'entrada', produto: 'Cerveja Skol Lata 269ml', quantidade: 36, funcionario: 'Maria Silva', observacao: 'Reposição cervejas' },
      { id: 13, data: '2023-10-07 11:25', tipo: 'saida', produto: 'Cerveja Budweiser American Lager 350ml', quantidade: 12, funcionario: 'Carlos Santos', observacao: 'Venda atacado' },
      { id: 14, data: '2023-10-07 16:15', tipo: 'entrada', produto: 'Água Mineral Minalba 510ml Sem Gás', quantidade: 20, funcionario: 'Ana Oliveira', observacao: 'Compra semanal' },
      { id: 15, data: '2023-10-08 09:05', tipo: 'saida', produto: 'Água Mineral Com Gás Garrafa 500ml Crystal', quantidade: 6, funcionario: 'Pedro Costa', observacao: 'Venda delivery' }
    ];
    setMovimentacoes(movimentacoesIniciais);
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.email === 'nextiscontato@gmail.com' && loginForm.password === 'nextis' && loginForm.cargo) {
      setIsAuthenticated(true);
      const usuarioLogado = {
        nome: 'João Alberto',
        email: loginForm.email,
        cargo: loginForm.cargo
      };
      setCurrentUser(usuarioLogado);
      setLoginError('');
    } else {
      setLoginError('Credenciais incorretas ou cargo não selecionado');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginForm({ email: '', password: '', cargo: '' });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value
    });
  };

  const hasPermission = (tab) => {
    if (!currentUser || !currentUser.cargo) return false;
    return rolePermissions[currentUser.cargo]?.includes(tab) || false;
  };

  const registrarMovimentacao = (tipo, produto, quantidade, observacao = '') => {
    const novaMovimentacao = {
      id: movimentacoes.length + 1,
      data: new Date().toISOString().slice(0, 16).replace('T', ' '),
      tipo,
      produto,
      quantidade,
      funcionario: currentUser?.nome || 'Sistema',
      observacao
    };
    setMovimentacoes(prev => [novaMovimentacao, ...prev]);
  };

  const vendasChartData = {
    labels: vendasData[activeMetric].map(item => activeMetric === 'dia' ? `${item.hora}h` : activeMetric === 'mes' ? item.dia : `Mês ${item.mes}`),
    datasets: [
      {
        label: 'Vendas',
        data: vendasData[activeMetric].map(item => item.valor),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const estoqueChartData = {
    labels: produtos.slice(0, 5).map(produto => produto.nome.split(' ')[0]),
    datasets: [
      {
        label: 'Quantidade em Estoque',
        data: produtos.slice(0, 5).map(produto => produto.quantidade),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (e.target.type === "number") {
      newValue = value.replace(/^0+(?=\d)/, "");
    }

    setNovoProduto(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleFornecedorChange = (e) => {
    const { name, value } = e.target;
    setNovoFornecedor({
      ...novoFornecedor,
      [name]: value
    });
  };

  const handleUsuarioChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoUsuario({
      ...novoUsuario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleConfiguracaoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfiguracoes({
      ...configuracoes,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleConfiguracaoNestedChange = (section, field, value) => {
    setConfiguracoes(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNovoProduto({
        ...novoProduto,
        imagem: file
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calcularShots = (capacidade, shotMl) => {
    return Math.floor(capacidade / shotMl);
  };

  const adicionarProduto = (e) => {
    e.preventDefault();
    const shotsCalculados = calcularShots(novoProduto.capacidade, novoProduto.shotMl);
    const produto = {
      id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
      nome: novoProduto.nome,
      quantidade: parseInt(novoProduto.quantidade),
      shots: shotsCalculados,
      validade: novoProduto.validade,
      imagem: previewImagem,
      fornecedorId: novoProduto.fornecedorId,
      capacidade: parseInt(novoProduto.capacidade),
      shotMl: parseInt(novoProduto.shotMl),
      categoria: novoProduto.categoria,
      preco: parseFloat(novoProduto.preco),
      precoDose: parseFloat(novoProduto.precoDose)
    };

    setProdutos([produto, ...produtos]);
    registrarMovimentacao('entrada', novoProduto.nome, parseInt(novoProduto.quantidade), 'Novo produto cadastrado');

    setNovoProduto({
      nome: '',
      quantidade: 0,
      shots: 0,
      validade: '',
      imagem: null,
      fornecedorId: '',
      capacidade: 0,
      shotMl: 50,
      categoria: '',
      preco: 0,
      precoDose: 0
    });
    setPreviewImagem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const adicionarFornecedor = (e) => {
    e.preventDefault();
    const fornecedor = {
      id: fornecedores.length + 1,
      ...novoFornecedor
    };
    setFornecedores([...fornecedores, fornecedor]);
    registrarMovimentacao('sistema', `Fornecedor: ${novoFornecedor.nome}`, 0, 'Novo fornecedor cadastrado');
    setNovoFornecedor({
      nome: '',
      contato: '',
      email: '',
      telefone: ''
    });
  };

  const adicionarUsuario = (e) => {
    e.preventDefault();
    const usuario = {
      id: usuarios.length + 1,
      ...novoUsuario
    };
    setUsuarios([...usuarios, usuario]);
    registrarMovimentacao('sistema', `Usuário: ${novoUsuario.nome}`, 0, 'Novo usuário cadastrado');
    setNovoUsuario({
      nome: '',
      cargo: '',
      email: '',
      notificacoesEmail: true
    });
  };

  const editarFornecedor = (fornecedor) => {
    setEditandoFornecedor({ ...fornecedor });
  };

  const salvarEdicaoFornecedor = () => {
    setFornecedores(fornecedores.map(f =>
      f.id === editandoFornecedor.id ? editandoFornecedor : f
    ));
    registrarMovimentacao('sistema', `Fornecedor: ${editandoFornecedor.nome}`, 0, 'Fornecedor atualizado');
    setEditandoFornecedor(null);
  };

  const editarUsuario = (usuario) => {
    setEditandoUsuario({ ...usuario });
  };

  const salvarEdicaoUsuario = () => {
    setUsuarios(usuarios.map(u =>
      u.id === editandoUsuario.id ? editandoUsuario : u
    ));
    registrarMovimentacao('sistema', `Usuário: ${editandoUsuario.nome}`, 0, 'Usuário atualizado');
    setEditandoUsuario(null);
  };

  const editarProduto = (produto) => {
    setEditandoProduto({ ...produto });
  };

  const salvarEdicaoProduto = () => {
    setProdutos(produtos.map(p =>
      p.id === editandoProduto.id ? editandoProduto : p
    ));
    registrarMovimentacao('ajuste', editandoProduto.nome, editandoProduto.quantidade, 'Produto atualizado');
    setEditandoProduto(null);
  };

  const removerProduto = (id) => {
    const produto = produtos.find(p => p.id === id);
    setProdutos(produtos.filter(produto => produto.id !== id));
    registrarMovimentacao('sistema', produto.nome, 0, 'Produto removido do sistema');
  };

  const removerFornecedor = (id) => {
    const fornecedor = fornecedores.find(f => f.id === id);
    setFornecedores(fornecedores.filter(fornecedor => fornecedor.id !== id));
    registrarMovimentacao('sistema', `Fornecedor: ${fornecedor.nome}`, 0, 'Fornecedor removido');
  };

  const removerUsuario = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    registrarMovimentacao('sistema', `Usuário: ${usuario.nome}`, 0, 'Usuário removido');
  };

  const atualizarQuantidade = (id, novaQuantidade) => {
    const produto = produtos.find(p => p.id === id);
    const quantidadeAnterior = produto.quantidade;
    const diferenca = parseInt(novaQuantidade) - quantidadeAnterior;
    
    setProdutos(produtos.map(produto =>
      produto.id === id ? { ...produto, quantidade: parseInt(novaQuantidade) } : produto
    ));

    if (diferenca > 0) {
      registrarMovimentacao('entrada', produto.nome, diferenca, 'Ajuste de estoque');
    } else if (diferenca < 0) {
      registrarMovimentacao('saida', produto.nome, Math.abs(diferenca), 'Ajuste de estoque');
    }
  };

  const atualizarShots = (id, novosShots) => {
    setProdutos(produtos.map(produto =>
      produto.id === id ? { ...produto, shots: parseInt(novosShots) } : produto
    ));
  };

  const atualizarShotMl = (id, novoShotMl) => {
    setProdutos(produtos.map(produto =>
      produto.id === id ? {
        ...produto,
        shotMl: parseInt(novoShotMl),
        shots: calcularShots(produto.capacidade, parseInt(novoShotMl))
      } : produto
    ));
  };

  const atualizarPreco = (id, novoPreco) => {
    const produto = produtos.find(p => p.id === id);
    setProdutos(produtos.map(produto =>
      produto.id === id ? { ...produto, preco: parseFloat(novoPreco) } : produto
    ));
    registrarMovimentacao('ajuste', produto.nome, 0, `Preço alterado para R$ ${parseFloat(novoPreco).toFixed(2)}`);
  };

  const calcularTotalVendas = () => {
    return vendasData[activeMetric].reduce((total, item) => total + item.valor, 0);
  };

  const calcularTotalProdutos = () => {
    return produtos.reduce((total, produto) => total + produto.quantidade, 0);
  };

  const calcularTotalShots = () => {
    return produtos.reduce((total, produto) => total + (produto.quantidade * produto.shots), 0);
  };

  const getFornecedorNome = (id) => {
    const fornecedor = fornecedores.find(f => f.id === id);
    return fornecedor ? fornecedor.nome : 'Fornecedor não encontrado';
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="estock-login-container">
        <div className="estock-login-card">
          <div className="estock-login-header">
            <img src="/images/logo-estock.png" alt="Logo Estock" />
            <h2>Estock - Sistema de Gestão</h2>
            <p>Faça login para acessar o sistema</p>
          </div>

          <form onSubmit={handleLogin} className="estock-login-form">
            {loginError && <div className="error-message">{loginError}</div>}

            <div className="estock-form-group">
              <label className="white-label">Email:</label>
              <div className="estock-input-with-icon">
                <FaUser className="estock-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  placeholder="Seu email"
                  className="white-input"
                />
              </div>
            </div>

            <div className="estock-form-group">
              <label className="white-label">Senha:</label>
              <div className="estock-input-with-icon">
                <FaLock className="estock-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  placeholder="Sua senha"
                  className="white-input"
                />
                <button
                  type="button"
                  className="estock-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="estock-form-group">
              <label className="white-label">Cargo:</label>
              <div className="comandou-input-with-icon">
                <FaUserTie className="comandou-input-icon" />
                <select
                  name="cargo"
                  value={loginForm.cargo}
                  onChange={handleLoginChange}
                  required
                  className="comandou-white-input"
                >
                  <option value="">Selecione sua função</option>
                  <option value="administrador">Administrador</option>
                  <option value="gerente">Gerente</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="funcionario">Funcionário/Operador</option>
                  <option value="financeiro">Financeiro</option>
                </select>
              </div>
            </div>

            <button type="submit" className="estock-login-btn">
              Entrar no Sistema
            </button>
          </form>

          <div className="estock-login-footer">
            <p>Entre com suas credenciais de administrador</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="estock-container">
      {isMobile && (
        <div className="estock-mobile-header">
          <button className="estock-mobile-menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
      )}

      <aside className={`estock-sidebar ${sidebarCollapsed && !isMobile ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="estock-sidebar-header">
          {(!sidebarCollapsed || isMobile) && (
            <div className="estock-sidebar-logo">
              <img src="/images/logo-estock.png" alt="Logo Estock" />
            </div>
          )}
          {!isMobile && (
            <button className="estock-sidebar-toggle" onClick={toggleSidebar}>
              {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          )}
        </div>

        {(!sidebarCollapsed || isMobile) && (
          <>
            <p className="estock-sidebar-title">Menu Principal</p>

            <nav className="estock-sidebar-nav">
              {hasPermission('dashboard') && (
                <button className={`estock-sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); closeMobileSidebar(); }}>
                  <FaTachometerAlt className="estock-icon" /> <span>Dashboard</span>
                </button>
              )}
              {hasPermission('produtos') && (
                <button className={`estock-sidebar-btn ${activeTab === 'produtos' ? 'active' : ''}`} onClick={() => { setActiveTab('produtos'); closeMobileSidebar(); }}>
                  <FaBoxes className="estock-icon" /> <span>Produtos</span>
                </button>
              )}
              {hasPermission('estoque') && (
                <button className={`estock-sidebar-btn ${activeTab === 'estoque' ? 'active' : ''}`} onClick={() => { setActiveTab('estoque'); closeMobileSidebar(); }}>
                  <FaWarehouse className="estock-icon" /> <span>Estoque</span>
                </button>
              )}
              {hasPermission('fornecedores') && (
                <button className={`estock-sidebar-btn ${activeTab === 'fornecedores' ? 'active' : ''}`} onClick={() => { setActiveTab('fornecedores'); closeMobileSidebar(); }}>
                  <FaTruck className="estock-icon" /> <span>Fornecedores</span>
                </button>
              )}
              {hasPermission('movimentacoes') && (
                <button className={`estock-sidebar-btn ${activeTab === 'movimentacoes' ? 'active' : ''}`} onClick={() => { setActiveTab('movimentacoes'); closeMobileSidebar(); }}>
                  <FaExchangeAlt className="estock-icon" /> <span>Movimentações</span>
                </button>
              )}
            </nav>

            <p className="estock-sidebar-title">Configurações</p>

            <nav className="estock-sidebar-nav">
              {hasPermission('sistema') && (
                <button className={`estock-sidebar-btn ${activeTab === 'sistema' ? 'active' : ''}`} onClick={() => { setActiveTab('sistema'); closeMobileSidebar(); }}>
                  <FaCog className="estock-icon" /> <span>Sistema</span>
                </button>
              )}
              {hasPermission('usuarios') && (
                <button className={`estock-sidebar-btn ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => { setActiveTab('usuarios'); closeMobileSidebar(); }}>
                  <FaUsers className="estock-icon" /> <span>Usuários</span>
                </button>
              )}
            </nav>

            <div className="estock-user-info">
              <img src="/images/user-avatar.png" alt="Usuário" className="estock-user-avatar" />
              <div>
                <p className="estock-user-name">{currentUser?.nome || 'Usuário'}</p>
                <p className="estock-user-role">
                  {currentUser?.cargo ? currentUser.cargo.charAt(0).toUpperCase() + currentUser.cargo.slice(1) : 'Administrador'}
                </p>
              </div>
              <button className="estock-logout-btn" onClick={handleLogout} title="Sair">
                <FaSignOutAlt />
              </button>
            </div>
          </>
        )}
      </aside>

      {isMobile && mobileSidebarOpen && (
        <div className="estock-sidebar-overlay" onClick={closeMobileSidebar}></div>
      )}

      <main className={`estock-main ${sidebarCollapsed && !isMobile ? 'collapsed' : ''}`}>
        {activeTab === 'dashboard' && (
          <div className="estock-dashboard">
            {isMobile && (
              <div className="estock-mobile-logo-above-metrics">
                <img src="/images/logo-estock.png" alt="Logo Estock" />
              </div>
            )}

            <div className="estock-metrics-container">
              <div className="estock-metric-card compact">
                <div className="estock-metric-header">
                  <h3>Total de Produtos</h3>
                </div>
                <div className="estock-metric-value">{calcularTotalProdutos()}</div>
              </div>

              <div className="estock-metric-card compact">
                <div className="estock-metric-header">
                  <h3>Vendas</h3>
                  <div className="estock-metric-selector">
                    <button className={activeMetric === 'dia' ? 'active' : ''} onClick={() => setActiveMetric('dia')}>
                      Dia
                    </button>
                    <button className={activeMetric === 'mes' ? 'active' : ''} onClick={() => setActiveMetric('mes')}>
                      Mês
                    </button>
                    <button className={activeMetric === 'ano' ? 'active' : ''} onClick={() => setActiveMetric('ano')}>
                      Ano
                    </button>
                  </div>
                </div>
                <div className="estock-metric-value">R$ {calcularTotalVendas().toLocaleString()}</div>
              </div>

              <div className="estock-metric-card compact">
                <div className="estock-metric-header">
                  <h3>Total de Shots</h3>
                </div>
                <div className="estock-metric-value">{calcularTotalShots()}</div>
              </div>
            </div>

            <div className="estock-chart-container">
              <div className="estock-chart-card">
                <h3>Vendas por Período</h3>
                <div className="estock-chart-content">
                  <Line
                    data={vendasChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="estock-chart-card">
                <h3>Top 5 Produtos em Estoque</h3>
                <div className="estock-chart-content">
                  <Bar
                    data={estoqueChartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="estock-activity-card">
              <h3>Atividades Recentes</h3>
              <ul className="estock-activity-list">
                {movimentacoes.slice(0, 5).map(mov => (
                  <li key={mov.id}>
                    {mov.data} - {mov.produto} - {mov.tipo} - {mov.quantidade} unidades - {mov.funcionario}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'produtos' && (
          <div className="estock-produtos">
            <h2>Gerenciamento de Produtos</h2>

            <div className="estock-produtos-form">
              <h3>{editandoProduto ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
              <form onSubmit={editandoProduto ? salvarEdicaoProduto : adicionarProduto}>
                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Nome do Produto:</label>
                    <input
                      type="text"
                      name="nome"
                      value={editandoProduto ? editandoProduto.nome : novoProduto.nome}
                      onChange={editandoProduto ? 
                        (e) => setEditandoProduto({ ...editandoProduto, nome: e.target.value }) : 
                        handleInputChange}
                      required
                    />
                  </div>
                  <div className="estock-form-group compact">
                    <label>Quantidade:</label>
                    <input
                      type="number"
                      name="quantidade"
                      value={editandoProduto ? editandoProduto.quantidade : novoProduto.quantidade}
                      onChange={editandoProduto ? 
                        (e) => setEditandoProduto({ ...editandoProduto, quantidade: parseInt(e.target.value) }) : 
                        handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Capacidade (ml):</label>
                    <input
                      type="number"
                      name="capacidade"
                      value={editandoProduto ? editandoProduto.capacidade : novoProduto.capacidade}
                      onChange={editandoProduto ? 
                        (e) => setEditandoProduto({ ...editandoProduto, capacidade: parseInt(e.target.value) }) : 
                        handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="estock-form-group compact">
                    <label>Tamanho do Shot (ml):</label>
                    <input
                      type="number"
                      name="shotMl"
                      value={editandoProduto ? editandoProduto.shotMl : novoProduto.shotMl}
                      onChange={editandoProduto ? 
                        (e) => setEditandoProduto({ ...editandoProduto, shotMl: parseInt(e.target.value) }) : 
                        handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Shots calculados:</label>
                    <input
                      type="text"
                      value={calcularShots(
                        editandoProduto ? editandoProduto.capacidade : novoProduto.capacidade, 
                        editandoProduto ? editandoProduto.shotMl : novoProduto.shotMl
                      )}
                      disabled
                      className="shots-calculados"
                    />
                  </div>
                  <div className="estock-form-group compact">
                    <label>Data de Validade:</label>
                    <input
                      type="date"
                      name="validade"
                      value={editandoProduto ? editandoProduto.validade : novoProduto.validade}
                      onChange={editandoProduto ? 
                        (e) => setEditandoProduto({ ...editandoProduto, validade: e.target.value }) : 
                        handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Categoria:</label>
                    <input
                      type="text"
                      name="categoria"
                      value={editandoProduto ? editandoProduto.categoria : novoProduto.categoria}
                      onChange={editandoProduto ? 
                        (e) => setEditandoProduto({ ...editandoProduto, categoria: e.target.value }) : 
                        handleInputChange}
                      placeholder="Ex: vinho, destilado, cerveja..."
                    />
                  </div>
                  <div className="estock-form-group compact">
                    <label>Preço (R$):</label>
                    <input
                      type="number"
                      name="preco"
                      step="0.01"
                      value={editandoProduto ? editandoProduto.preco : novoProduto.preco}
                      onChange={editandoProduto ? 
                        (e) => setEditandoProduto({ ...editandoProduto, preco: parseFloat(e.target.value) }) : 
                        handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Fornecedor:</label>
                    <select
                      name="fornecedorId"
                      value={editandoProduto ? editandoProduto.fornecedorId : novoProduto.fornecedorId}
                      onChange={editandoProduto ? 
                        (e) => setEditandoProduto({ ...editandoProduto, fornecedorId: e.target.value }) : 
                        handleInputChange}
                      required
                      className="gray-select"
                    >
                      <option value="">Selecione um fornecedor</option>
                      {fornecedores.map(fornecedor => (
                        <option key={fornecedor.id} value={fornecedor.id}>
                          {fornecedor.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!editandoProduto && (
                  <div className="estock-form-row">
                    <div className="estock-form-group compact estock-form-full-width">
                      <label>Imagem do Produto:</label>
                      <div className="estock-image-upload">
                        <button
                          type="button"
                          className="estock-upload-btn"
                          onClick={() => fileInputRef.current.click()}
                        >
                          <FaUpload /> Selecionar Imagem
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                        {previewImagem && (
                          <img
                            src={previewImagem}
                            alt="Preview"
                            className="estock-image-preview"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="estock-form-buttons-container">
                  <div className="estock-form-buttons">
                    {editandoProduto ? (
                      <>
                        <button type="submit" className="estock-salvar-btn">
                          <FaSave /> Salvar
                        </button>
                        <button type="button" className="estock-cancelar-btn" onClick={() => setEditandoProduto(null)}>
                          <FaTimes /> Cancelar
                        </button>
                      </>
                    ) : (
                      <button type="submit" className="estock-adicionar-btn">
                        <FaPlus /> Adicionar Produto
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="estock-produtos-grid">
              {produtos.map(produto => (
                <div key={produto.id} className="estock-produto-card">
                  {produto.imagem ? (
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="estock-produto-imagem"
                    />
                  ) : (
                    <div className="estock-produto-sem-imagem">
                      <FaBoxes />
                    </div>
                  )}
                  <div className="estock-produto-info">
                    <h3>{produto.nome}</h3>
                    <p>Categoria: {produto.categoria || 'Não definida'}</p>
                    <p>Quantidade: {produto.quantidade}</p>
                    <p>Preço: R$ {produto.preco?.toFixed(2) || '0.00'}</p>
                    <p>Capacidade: {produto.capacidade}ml</p>
                    <p>Tamanho do shot: {produto.shotMl}ml</p>
                    <p>Shots por unidade: {produto.shots}</p>
                    <p>Total de shots: {produto.quantidade * produto.shots}</p>
                    <p>Validade: {new Date(produto.validade).toLocaleDateString()}</p>
                    <p>Fornecedor: {getFornecedorNome(produto.fornecedorId)}</p>
                    <div className="estock-produto-acoes">
                      <div className="estock-produto-controles">
                        <label>Quantidade:</label>
                        <input
                          type="number"
                          value={produto.quantidade}
                          onChange={(e) => atualizarQuantidade(produto.id, e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="estock-produto-controles">
                        <label>Preço:</label>
                        <input
                          type="number"
                          step="0.01"
                          value={produto.preco || 0}
                          onChange={(e) => atualizarPreco(produto.id, e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="estock-produto-controles">
                        <label>Shot (ml):</label>
                        <input
                          type="number"
                          value={produto.shotMl}
                          onChange={(e) => atualizarShotMl(produto.id, e.target.value)}
                          min="1"
                        />
                      </div>
                      <div className="estock-produto-buttons">
                        <button className="estock-editar-btn" onClick={() => editarProduto(produto)}>
                          <FaEdit /> Editar
                        </button>
                        <button className="estock-remover-btn-small" onClick={() => removerProduto(produto.id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'estoque' && (
          <div className="estock-estoque">
            <h2>Gestão de Estoque</h2>
            <div className="estock-estoque-content">
              <div className="estock-estoque-card">
                <h3>Níveis de Estoque</h3>
                <div className="estock-estoque-chart">
                  {produtos.map(produto => (
                    <div key={produto.id} className="estock-estoque-item">
                      <span>{produto.nome}</span>
                      <div className="estock-estoque-bar-container">
                        <div
                          className="estock-estoque-bar"
                          style={{ width: `${Math.min(100, (produto.quantidade / 30) * 100)}%` }}
                        ></div>
                      </div>
                      <span>{produto.quantidade}/30</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="estock-estoque-alertas">
                <h3>Alertas</h3>
                <ul>
                  {produtos.filter(p => p.quantidade < configuracoes.parametrosEstoque.estoqueMinimo).map(produto => (
                    <li key={produto.id} className="estock-alerta-item">
                      <FaExclamationTriangle className="estock-alerta-icon" />
                      Estoque baixo: {produto.nome} ({produto.quantidade} unidades)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fornecedores' && (
          <div className="estock-fornecedores">
            <h2>Fornecedores</h2>

            <div className="estock-fornecedores-form">
              <h3>{editandoFornecedor ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</h3>
              <form onSubmit={editandoFornecedor ? salvarEdicaoFornecedor : adicionarFornecedor}>
                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Nome do Fornecedor:</label>
                    <input
                      type="text"
                      name="nome"
                      value={editandoFornecedor ? editandoFornecedor.nome : novoFornecedor.nome}
                      onChange={editandoFornecedor ?
                        (e) => setEditandoFornecedor({ ...editandoFornecedor, nome: e.target.value }) :
                        handleFornecedorChange}
                      required
                    />
                  </div>
                  <div className="estock-form-group compact">
                    <label>Pessoa de Contato:</label>
                    <input
                      type="text"
                      name="contato"
                      value={editandoFornecedor ? editandoFornecedor.contato : novoFornecedor.contato}
                      onChange={editandoFornecedor ?
                        (e) => setEditandoFornecedor({ ...editandoFornecedor, contato: e.target.value }) :
                        handleFornecedorChange}
                      required
                    />
                  </div>
                </div>

                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={editandoFornecedor ? editandoFornecedor.email : novoFornecedor.email}
                      onChange={editandoFornecedor ?
                        (e) => setEditandoFornecedor({ ...editandoFornecedor, email: e.target.value }) :
                        handleFornecedorChange}
                      required
                    />
                  </div>
                  <div className="estock-form-group compact">
                    <label>Telefone:</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={editandoFornecedor ? editandoFornecedor.telefone : novoFornecedor.telefone}
                      onChange={editandoFornecedor ?
                        (e) => setEditandoFornecedor({ ...editandoFornecedor, telefone: e.target.value }) :
                        handleFornecedorChange}
                      required
                    />
                  </div>
                </div>

                <div className="estock-form-buttons-container">
                  <div className="estock-form-buttons">
                    {editandoFornecedor ? (
                      <>
                        <button type="submit" className="estock-salvar-btn">
                          <FaSave /> Salvar
                        </button>
                        <button type="button" className="estock-cancelar-btn" onClick={() => setEditandoFornecedor(null)}>
                          <FaTimes /> Cancelar
                        </button>
                      </>
                    ) : (
                      <button type="submit" className="estock-adicionar-btn">
                        <FaPlus /> Adicionar Fornecedor
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="estock-fornecedores-list">
              {fornecedores.map(fornecedor => (
                <div key={fornecedor.id} className="estock-fornecedor-card">
                  <div className="estock-fornecedor-info">
                    <h3>{fornecedor.nome}</h3>
                    <p>Contato: {fornecedor.contato}</p>
                    <p>Email: {fornecedor.email}</p>
                    <p>Telefone: {fornecedor.telefone}</p>
                  </div>
                  <div className="estock-fornecedor-acoes">
                    <button className="estock-editar-btn" onClick={() => editarFornecedor(fornecedor)}>
                      <FaEdit /> Editar
                    </button>
                    <button className="estock-remover-btn-small" onClick={() => removerFornecedor(fornecedor.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'movimentacoes' && (
          <div className="estock-movimentacoes">
            <h2>Movimentações</h2>
            <div className="estock-movimentacoes-content">
              <table className="estock-movimentacoes-table">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Produto</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                    <th>Funcionário</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {movimentacoes.map(movimentacao => (
                    <tr key={movimentacao.id}>
                      <td>{movimentacao.data}</td>
                      <td>{movimentacao.produto}</td>
                      <td>
                        <span className={`estock-movimentacao-tipo ${movimentacao.tipo}`}>
                          {movimentacao.tipo}
                        </span>
                      </td>
                      <td>{movimentacao.quantidade}</td>
                      <td>{movimentacao.funcionario}</td>
                      <td>{movimentacao.observacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sistema' && (
          <div className="estock-sistema">
            <h2>Configurações do Sistema</h2>
            <div className="estock-sistema-content">

              <div className="estock-sistema-section">
                <h3>Parâmetros do Estoque</h3>
                <div className="estock-form-group compact">
                  <label>Estoque Mínimo:</label>
                  <input
                    type="number"
                    value={configuracoes.parametrosEstoque.estoqueMinimo}
                    onChange={(e) => handleConfiguracaoNestedChange('parametrosEstoque', 'estoqueMinimo', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="estock-config-item compact">
                  <label>Permitir Estoque Negativo:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.parametrosEstoque.permitirEstoqueNegativo}
                      onChange={(e) => handleConfiguracaoNestedChange('parametrosEstoque', 'permitirEstoqueNegativo', e.target.checked)}
                      className="estock-checkbox"
                      id="permitirEstoqueNegativo"
                    />
                    <label htmlFor="permitirEstoqueNegativo" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.parametrosEstoque.permitirEstoqueNegativo && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="estock-form-group compact">
                  <label>Unidade Padrão:</label>
                  <select
                    value={configuracoes.parametrosEstoque.unidadePadrao}
                    onChange={(e) => handleConfiguracaoNestedChange('parametrosEstoque', 'unidadePadrao', e.target.value)}
                  >
                    <option value="unidade">Unidade</option>
                    <option value="kg">Kg</option>
                    <option value="litro">Litro</option>
                    <option value="pacote">Pacote</option>
                    <option value="caixa">Caixa</option>
                  </select>
                </div>
              </div>

              <div className="estock-sistema-section">
                <h3>Notificações e Alertas</h3>
                <div className="estock-config-item compact">
                  <label>Notificações por Email:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.notificacoes.email}
                      onChange={(e) => handleConfiguracaoNestedChange('notificacoes', 'email', e.target.checked)}
                      className="estock-checkbox"
                      id="notificacoesEmail"
                    />
                    <label htmlFor="notificacoesEmail" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.notificacoes.email && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
                {configuracoes.notificacoes.email && (
                  <div className="estock-form-group compact">
                    <label>Email para notificações:</label>
                    <input
                      type="email"
                      value={configuracoes.notificacoes.emailContato}
                      onChange={(e) => handleConfiguracaoNestedChange('notificacoes', 'emailContato', e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                )}
                <div className="estock-config-item compact">
                  <label>Notificações por WhatsApp:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.notificacoes.whatsapp}
                      onChange={(e) => handleConfiguracaoNestedChange('notificacoes', 'whatsapp', e.target.checked)}
                      className="estock-checkbox"
                      id="notificacoesWhatsapp"
                    />
                    <label htmlFor="notificacoesWhatsapp" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.notificacoes.whatsapp && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
                {configuracoes.notificacoes.whatsapp && (
                  <div className="estock-form-group compact">
                    <label>Número WhatsApp:</label>
                    <input
                      type="tel"
                      value={configuracoes.notificacoes.whatsappNumero}
                      onChange={(e) => handleConfiguracaoNestedChange('notificacoes', 'whatsappNumero', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                )}
                <div className="estock-config-item compact">
                  <label>Popup no Sistema:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.notificacoes.popup}
                      onChange={(e) => handleConfiguracaoNestedChange('notificacoes', 'popup', e.target.checked)}
                      className="estock-checkbox"
                      id="notificacoesPopup"
                    />
                    <label htmlFor="notificacoesPopup" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.notificacoes.popup && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="estock-sistema-section">
                <h3>Movimentações e Controle</h3>
                <div className="estock-config-item compact">
                  <label>Permitir edição de movimentações:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.movimentacoes.permitirEdicao}
                      onChange={(e) => handleConfiguracaoNestedChange('movimentacoes', 'permitirEdicao', e.target.checked)}
                      className="estock-checkbox"
                      id="permitirEdicao"
                    />
                    <label htmlFor="permitirEdicao" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.movimentacoes.permitirEdicao && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="estock-form-group compact">
                  <label>Tempo limite para editar movimentações (horas):</label>
                  <input
                    type="number"
                    value={configuracoes.movimentacoes.tempoLimiteEdicao}
                    onChange={(e) => handleConfiguracaoNestedChange('movimentacoes', 'tempoLimiteEdicao', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="estock-config-item compact">
                  <label>Mostrar histórico detalhado de movimentações:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.movimentacoes.mostrarHistorico}
                      onChange={(e) => handleConfiguracaoNestedChange('movimentacoes', 'mostrarHistorico', e.target.checked)}
                      className="estock-checkbox"
                      id="mostrarHistorico"
                    />
                    <label htmlFor="mostrarHistorico" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.movimentacoes.mostrarHistorico && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="estock-config-item compact">
                  <label>Confirmar exclusão de produtos/movimentações:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.movimentacoes.confirmarExclusao}
                      onChange={(e) => handleConfiguracaoNestedChange('movimentacoes', 'confirmarExclusao', e.target.checked)}
                      className="estock-checkbox"
                      id="confirmarExclusao"
                    />
                    <label htmlFor="confirmarExclusao" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.movimentacoes.confirmarExclusao && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="estock-sistema-section">
                <h3>Alertas Automáticos</h3>
                <div className="estock-form-group compact">
                  <label>Enviar alerta se estoque atingir X% do mínimo:</label>
                  <input
                    type="number"
                    value={configuracoes.alertas.alertaPercentual}
                    onChange={(e) => handleConfiguracaoNestedChange('alertas', 'alertaPercentual', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                  <span style={{marginLeft: '5px'}}>%</span>
                </div>
                <div className="estock-config-item compact">
                  <label>Avisar sobre produtos vencidos:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.alertas.produtosVencidos}
                      onChange={(e) => handleConfiguracaoNestedChange('alertas', 'produtosVencidos', e.target.checked)}
                      className="estock-checkbox"
                      id="produtosVencidos"
                    />
                    <label htmlFor="produtosVencidos" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.alertas.produtosVencidos && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="estock-config-item compact">
                  <label>Avisar sobre fornecedores inativos:</label>
                  <div className="estock-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={configuracoes.alertas.fornecedoresInativos}
                      onChange={(e) => handleConfiguracaoNestedChange('alertas', 'fornecedoresInativos', e.target.checked)}
                      className="estock-checkbox"
                      id="fornecedoresInativos"
                    />
                    <label htmlFor="fornecedoresInativos" className="estock-checkbox-label">
                      <span className="estock-checkbox-icon">
                        {configuracoes.alertas.fornecedoresInativos && <FaCheck />}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="estock-usuarios">
            <h2>Gerenciamento de Usuários</h2>

            <div className="estock-usuarios-form">
              <h3>{editandoUsuario ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h3>
              <form onSubmit={editandoUsuario ? salvarEdicaoUsuario : adicionarUsuario}>
                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Nome:</label>
                    <input
                      type="text"
                      name="nome"
                      value={editandoUsuario ? editandoUsuario.nome : novoUsuario.nome}
                      onChange={editandoUsuario ?
                        (e) => setEditandoUsuario({ ...editandoUsuario, nome: e.target.value }) :
                        handleUsuarioChange}
                      required
                    />
                  </div>
                  <div className="estock-form-group compact">
                    <label>Cargo:</label>
                    <select
                      name="cargo"
                      value={editandoUsuario ? editandoUsuario.cargo : novoUsuario.cargo}
                      onChange={editandoUsuario ?
                        (e) => setEditandoUsuario({ ...editandoUsuario, cargo: e.target.value }) :
                        handleUsuarioChange}
                      required
                    >
                      <option value="">Selecione o cargo</option>
                      <option value="administrador">Administrador</option>
                      <option value="gerente">Gerente</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="funcionario">Funcionário/Operador</option>
                      <option value="financeiro">Financeiro</option>
                    </select>
                  </div>
                </div>

                <div className="estock-form-row">
                  <div className="estock-form-group compact">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={editandoUsuario ? editandoUsuario.email : novoUsuario.email}
                      onChange={editandoUsuario ?
                        (e) => setEditandoUsuario({ ...editandoUsuario, email: e.target.value }) :
                        handleUsuarioChange}
                      required
                    />
                  </div>
                  <div className="estock-form-group compact">
                    <label>Receber notificações por email:</label>
                    <div className="estock-checkbox-wrapper">
                      <input
                        type="checkbox"
                        name="notificacoesEmail"
                        checked={editandoUsuario ? editandoUsuario.notificacoesEmail : novoUsuario.notificacoesEmail}
                        onChange={editandoUsuario ?
                          (e) => setEditandoUsuario({ ...editandoUsuario, notificacoesEmail: e.target.checked }) :
                          handleUsuarioChange}
                        className="estock-checkbox"
                        id="notificacoesUsuario"
                      />
                      <label htmlFor="notificacoesUsuario" className="estock-checkbox-label">
                        <span className="estock-checkbox-icon">
                          {(editandoUsuario ? editandoUsuario.notificacoesEmail : novoUsuario.notificacoesEmail) && <FaCheck />}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="estock-form-buttons-container">
                  <div className="estock-form-buttons">
                    {editandoUsuario ? (
                      <>
                        <button type="submit" className="estock-salvar-btn">
                          <FaSave /> Salvar
                        </button>
                        <button type="button" className="estock-cancelar-btn" onClick={() => setEditandoUsuario(null)}>
                          <FaTimes /> Cancelar
                        </button>
                      </>
                    ) : (
                      <button type="submit" className="estock-adicionar-btn">
                        <FaPlus /> Adicionar Usuário
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="estock-usuarios-list">
              {usuarios.map(usuario => (
                <div key={usuario.id} className="estock-usuario-card">
                  <div className="estock-usuario-info">
                    <h3>{usuario.nome}</h3>
                    <p>Cargo: {usuario.cargo}</p>
                    <p>Email: {usuario.email}</p>
                    <p>Notificações: {usuario.notificacoesEmail ? 'Ativadas' : 'Desativadas'}</p>
                  </div>
                  <div className="estock-usuario-acoes">
                    <button className="estock-editar-btn" onClick={() => editarUsuario(usuario)}>
                      <FaEdit /> Editar
                    </button>
                    <button className="estock-remover-btn-small" onClick={() => removerUsuario(usuario.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Estock;