import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isCadastro, setIsCadastro] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    empresa: "",
    senha: "",
    confirmacao: "",
    lembrar: false,
    aceitarTermos: false,
    resetEmail: "",
    resetCode: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (forgotPassword && resetStep === 3) {
      setForgotPassword(false);
      setResetStep(1);
      setFormData({
        ...formData,
        resetEmail: "",
        resetCode: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    } else if (!forgotPassword && !isCadastro) {
      // Salvar informações de login e redirecionar para a home
      localStorage.setItem('nextisLogin', JSON.stringify({ 
        email: formData.email, 
        isLoggedIn: true 
      }));
      navigate('/');
    } else if (isCadastro) {
      // Lógica para cadastro
      localStorage.setItem('nextisLogin', JSON.stringify({ 
        email: formData.email, 
        isLoggedIn: true 
      }));
      navigate('/');
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
    setResetStep(1);
  };

  const handleSendCode = () => {
    setResetStep(2);
  };

  const handleVerifyCode = () => {
    setResetStep(3);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoogleLogin = () => {
    // Simulação de login com Google
    localStorage.setItem('nextisLogin', JSON.stringify({ 
      email: 'usuario@gmail.com', 
      isLoggedIn: true 
    }));
    navigate('/');
  };

  const handleFacebookLogin = () => {
    // Simulação de login com Facebook
    localStorage.setItem('nextisLogin', JSON.stringify({ 
      email: 'usuario@facebook.com', 
      isLoggedIn: true 
    }));
    navigate('/');
  };

  const handleMicrosoftLogin = () => {
    // Simulação de login com Microsoft
    localStorage.setItem('nextisLogin', JSON.stringify({ 
      email: 'usuario@microsoft.com', 
      isLoggedIn: true 
    }));
    navigate('/');
  };

  const hasMinLength = formData.senha.length >= 8;
  const hasLettersAndNumbers = /[a-zA-Z]/.test(formData.senha) && /[0-9]/.test(formData.senha);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <img src="/images/login-estock.png" alt="Pessoa no estoque" />
        </div>

        <div className="login-form">
          <h2 className="logo" onClick={() => navigate('/')}>
            <img src="/images/logo-nextis-ofc.png" alt="NexTIS" className="logo-icon" />
            <span className="logo-green">NexTIS</span>
          </h2>

          {!forgotPassword ? (
            <>
              <p className="subtitle">
                {isCadastro ? "" : "Controle de Estoque Inteligente"}
              </p>

              <form onSubmit={handleSubmit}>
                {!isCadastro ? (
                  <>
                    <div className="login-input-group">
                      <div className="space">
                        <input
                          type="email"
                          placeholder="E-mail"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="black-text"
                        />
                      </div>
                      <div className="password-field">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Senha"
                          name="senha"
                          value={formData.senha}
                          onChange={handleChange}
                          required
                          className="black-text"
                        />
                        <span className="eye-icon" onClick={togglePasswordVisibility}>
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                    </div>
                    <div className="login-options">
                      <label className="checkbox-text">
                        <input
                          type="checkbox"
                          name="lembrar"
                          checked={formData.lembrar}
                          onChange={handleChange}
                          className="small-checkbox"
                        />
                        <p>Lembrar-me</p>
                      </label>
                      <a href="#" className="forgot-link" onClick={handleForgotPassword}>
                        <p>Esqueceu a senha?</p>
                      </a>
                    </div>
                    <button type="submit" className="btn-login">
                      Entrar
                    </button>
                    <p className="ou">Ou entre com</p>
                    <div className="social-login">
                      <button type="button" className="social-btn" onClick={handleGoogleLogin}>
                        <img src="/images/logo-google.png" alt="Google" />
                      </button>
                      <button type="button" className="social-btn" onClick={handleFacebookLogin}>
                        <img src="/images/logo-facebook.png" alt="Facebook" />
                      </button>
                      <button type="button" className="social-btn" onClick={handleMicrosoftLogin}>
                        <img src="/images/logo-microsoft.png" alt="Microsoft" />
                      </button>
                    </div>
                    <p className="register center">
                      Não tem uma conta?{" "}
                      <span onClick={() => setIsCadastro(true)}>Cadastre-se</span>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="double-input">
                      <input
                        type="text"
                        placeholder="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="black-text"
                      />
                      <input
                        type="text"
                        placeholder="Sobrenome"
                        name="sobrenome"
                        value={formData.sobrenome}
                        onChange={handleChange}
                        required
                        className="black-text"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="E-mail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="black-text"
                    />
                    <div className="input-spacing"></div>
                    <input
                      type="text"
                      placeholder="Empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      className="black-text"
                    />
                    <div className="input-spacing"></div>
                    <div className="password-field">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        className="black-text"
                      />
                      <span className="eye-icon" onClick={togglePasswordVisibility}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    {!hasMinLength && (
                      <p className="password-hint">Pelo menos 8 caracteres</p>
                    )}
                    {!hasLettersAndNumbers && (
                      <p className="password-hint">Letras e números</p>
                    )}
                    <div className="password-field">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmação"
                        name="confirmacao"
                        value={formData.confirmacao}
                        onChange={handleChange}
                        required
                        className="black-text"
                      />
                      <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <div className="terms-container">
                      <label className="checkbox-text">
                        <input
                          type="checkbox"
                          name="aceitarTermos"
                          checked={formData.aceitarTermos}
                          onChange={handleChange}
                          className="small-checkbox"
                        />
                        <span className="terms-text">
                          Concordo com os <a href="#">Termos de Serviço</a> e a{" "}
                          <a href="#">Política de Privacidade</a>
                        </span>
                      </label>
                    </div>
                    <button type="submit" className="btn-login">
                      Criar Conta
                    </button>
                    <p className="register center">
                      Já tem uma conta?{" "}
                      <span onClick={() => setIsCadastro(false)}>Entrar</span>
                    </p>
                  </>
                )}
              </form>
            </>
          ) : (
            <div className="forgot-password-flow">
              <h3>Recuperar Senha</h3>

              {resetStep === 1 && (
                <>
                  <p>Digite seu e-mail para receber o código de verificação</p>
                  <input
                    type="email"
                    placeholder="E-mail"
                    name="resetEmail"
                    value={formData.resetEmail}
                    onChange={handleChange}
                    required
                    className="black-text"
                  />
                  <div className="reset-buttons">
                    <button type="button" className="btn-secondary" onClick={() => setForgotPassword(false)}>
                      Voltar
                    </button>
                    <button type="button" className="btn-login" onClick={handleSendCode}>
                      Enviar Código
                    </button>
                  </div>
                </>
              )}

              {resetStep === 2 && (
                <>
                  <p>Digite o código enviado para seu e-mail</p>
                  <input
                    type="text"
                    placeholder="Código de verificação"
                    name="resetCode"
                    value={formData.resetCode}
                    onChange={handleChange}
                    required
                    className="black-text"
                  />
                  <div className="reset-buttons">
                    <button type="button" className="btn-secondary" onClick={() => setResetStep(1)}>
                      Voltar
                    </button>
                    <button type="button" className="btn-login" onClick={handleVerifyCode}>
                      Verificar Código
                    </button>
                  </div>
                </>
              )}

              {resetStep === 3 && (
                <>
                  <p>Digite sua nova senha</p>
                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nova Senha"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                      className="black-text"
                    />
                    <span className="eye-icon" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <div className="password-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmar Nova Senha"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      required
                      className="black-text"
                    />
                    <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <div className="reset-buttons">
                    <button type="button" className="btn-secondary" onClick={() => setResetStep(2)}>
                      Voltar
                    </button>
                    <button type="submit" className="btn-login">
                      Redefinir Senha
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;