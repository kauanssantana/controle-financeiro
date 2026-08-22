import { NavLink } from "react-router-dom";

// Importando as imagens diretamente da pasta assets
import iconeDashboard from "../assets/painel-de-controle.png";
import iconeRelatorios from "../assets/relatorio-de-negocios.png";
import iconeConfiguracoes from "../assets/engrenagens.png";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>Controle</h1>
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
