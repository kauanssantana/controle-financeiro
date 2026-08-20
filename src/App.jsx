import { meses } from "./data/meses";
import GraficoPizza from "./components/GraficoPizza";
import ListaCategorias from "./components/ListaCategorias";
import Resumo from "./components/Resumo";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [listaMeses, setListaMeses] = useState(() => {
    const salvo = localStorage.getItem("meses");
    return salvo ? JSON.parse(salvo) : meses;
  });

  useEffect(() => {
    localStorage.setItem("meses", JSON.stringify(listaMeses));
  }, [listaMeses]);

  const [mesAtualIndex, setMesAtualIndex] = useState(listaMeses.length - 1);
  const mesAtual = listaMeses[mesAtualIndex];
  const renda = mesAtual.renda;
  const categorias = mesAtual.categorias;

  const totalGastos = categorias.reduce(
    (acumulador, cat) => acumulador + cat.valor,
    0,
  );
  const saldo = renda - totalGastos;

  function atualizarCategoria(nomeCategoria, novoValor) {
    setListaMeses(
      listaMeses.map((mes, index) => {
        if (index !== mesAtualIndex) return mes;
        return {
          ...mes,
          categorias: mes.categorias.map((cat) =>
            cat.nome === nomeCategoria ? { ...cat, valor: novoValor } : cat,
          ),
        };
      }),
    );
  }

  function mesAnterior() {
    if (mesAtualIndex > 0) {
      setMesAtualIndex(mesAtualIndex - 1);
    }
  }

  function proximoMes() {
    if (mesAtualIndex < listaMeses.length - 1) {
      setMesAtualIndex(mesAtualIndex + 1);
    }
  }

  return (
    <div className="app-layout">
      {/* NOVA BARRA LATERAL */}
      <aside className="sidebar">
        <h1>Controle</h1>
        <div className="sidebar-menu">
          <span>📊 Dashboard</span>
          <span>📈 Relatórios</span>
          <span>⚙️ Configurações</span>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content">
        <header className="cabecalho-mes">
          <button onClick={mesAnterior} disabled={mesAtualIndex === 0}>
            ← Anterior
          </button>
          <h2>
            {mesAtual.mes} de {mesAtual.ano}
          </h2>
          <button
            onClick={proximoMes}
            disabled={mesAtualIndex === listaMeses.length - 1}
          >
            Próximo →
          </button>
        </header>

        {/* O GRID COM OS CARDS */}
        <div className="dashboard-grid">
          <div className="card card-resumo">
            <h3>Visão Geral</h3>
            <br />
            <Resumo renda={renda} />
            <br />
            <h2>Saldo: R$ {saldo}</h2>
          </div>

          <div className="card card-grafico">
            <GraficoPizza categorias={categorias} />
          </div>

          <div className="card card-lista">
            <h3>Detalhamento de Gastos</h3>
            <br />
            <ListaCategorias
              categorias={categorias}
              atualizarCategoria={atualizarCategoria}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
