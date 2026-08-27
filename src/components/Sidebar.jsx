import { NavLink } from "react-router-dom";

import logoImg from "../assets/logo.png";
import iconeDashboard from "../assets/painel-de-controle.png";
import iconeRelatorios from "../assets/relatorio-de-negocios.png";
import iconeConfiguracoes from "../assets/engrenagens.png";

// NOVO: A Sidebar agora recebe as "props" de menuAberto
function Sidebar({ menuAberto, setMenuAberto }) {
  // Função para fechar a gaveta quando o usuário clica em um link no celular
  const fecharMenu = () => setMenuAberto(false);

  return (
    // Se o menuAberto for true, ele injeta a classe "aberta"
    <aside className={`sidebar ${menuAberto ? "aberta" : ""}`}>
      <div className="sidebar-header">
        <img src={logoImg} alt="Logo Controle" className="logo-marca" />
        <h1>Controle</h1>
      </div>

      <div className="sidebar-menu">
        <NavLink
          to="/"
          end
          onClick={fecharMenu}
          className={({ isActive }) => (isActive ? "link-ativo" : "")}
        >
          <img
            src={iconeDashboard}
            alt="Ícone Dashboard"
            className="icone-sidebar"
          />
          Dashboard
        </NavLink>

        <NavLink
          to="/relatorios"
          onClick={fecharMenu}
          className={({ isActive }) => (isActive ? "link-ativo" : "")}
        >
          <img
            src={iconeRelatorios}
            alt="Ícone Relatórios"
            className="icone-sidebar"
          />
          Relatórios
        </NavLink>

        <NavLink
          to="/configuracoes"
          onClick={fecharMenu}
          className={({ isActive }) => (isActive ? "link-ativo" : "")}
        >
          <img
            src={iconeConfiguracoes}
            alt="Ícone Configurações"
            className="icone-sidebar"
          />
          Configurações
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
