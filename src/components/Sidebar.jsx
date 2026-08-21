import { NavLink } from "react-router-dom";

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
          📊 Dashboard
        </NavLink>
        <NavLink
          to="/relatorios"
          className={({ isActive }) => (isActive ? "link-ativo" : "")}
        >
          📈 Relatórios
        </NavLink>
        <NavLink
          to="/configuracoes"
          className={({ isActive }) => (isActive ? "link-ativo" : "")}
        >
          ⚙️ Configurações
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
