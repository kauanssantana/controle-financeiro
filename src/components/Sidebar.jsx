import { NavLink } from "react-router-dom";

// Importando as imagens da pasta assets (incluindo o seu novo logo)
import logoImg from "../assets/logo.png";
import iconeDashboard from "../assets/painel-de-controle.png";
import iconeRelatorios from "../assets/relatorio-de-negocios.png";
import iconeConfiguracoes from "../assets/engrenagens.png";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Header da Sidebar com o seu PNG e o Título lado a lado */}
      <div className="sidebar-header">
        <img src={logoImg} alt="Logo Controle" className="logo-marca" />
        <h1>Controle</h1>
      </div>

      <div className="sidebar-menu">
        <NavLink
          to="/"
          end
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
