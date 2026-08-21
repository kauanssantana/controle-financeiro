import { meses } from "./data/meses";
import GraficoPizza from "./components/GraficoPizza";
import GraficoEstimadoReal from "./components/GraficoEstimadoReal";
import ListaCategorias from "./components/ListaCategorias";
import Resumo from "./components/Resumo";
import { useState, useEffect } from "react";
import "./App.css";

// Recalcula totalEstimado/totalReal de uma categoria a partir dos itens.
// Centralizamos essa conta aqui pra não repetir a mesma lógica em vários lugares.
function recalcularCategoria(categoria) {
  const totalEstimado = categoria.itens.reduce(
    (soma, i) => soma + i.estimado,
    0,
  );
  const totalReal = categoria.itens.reduce((soma, i) => soma + i.real, 0);
  return { ...categoria, totalEstimado, totalReal };
}

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

  const totalGastos = categorias.reduce((soma, cat) => soma + cat.totalReal, 0);
  const totalEstimado = categorias.reduce(
    (soma, cat) => soma + cat.totalEstimado,
    0,
  );
  const saldo = renda - totalGastos;

  function atualizarItem(nomeCategoria, nomeItem, campo, novoValor) {
    setListaMeses(
      listaMeses.map((mes, index) => {
        if (index !== mesAtualIndex) return mes;
        return {
          ...mes,
          categorias: mes.categorias.map((cat) => {
            if (cat.nome !== nomeCategoria) return cat;
            const categoriaAtualizada = {
              ...cat,
              itens: cat.itens.map((item) =>
                item.nome === nomeItem ? { ...item, [campo]: novoValor } : item,
              ),
            };
            return recalcularCategoria(categoriaAtualizada);
          }),
        };
      }),
    );
  }

  function atualizarRenda(novoValor) {
    setListaMeses(
      listaMeses.map((mes, index) =>
        index === mesAtualIndex ? { ...mes, renda: novoValor } : mes,
      ),
    );
  }

  function mesAnterior() {
    if (mesAtualIndex > 0) setMesAtualIndex(mesAtualIndex - 1);
  }

  function proximoMes() {
    if (mesAtualIndex < listaMeses.length - 1)
      setMesAtualIndex(mesAtualIndex + 1);
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1>Controle</h1>
        <div className="sidebar-menu">
          <span>📊 Dashboard</span>
          <span>📈 Relatórios</span>
          <span>⚙️ Configurações</span>
        </div>
      </aside>

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

        <div className="dashboard-grid">
          <div className="card card-resumo">
            <h3>Visão Geral</h3>
            <Resumo renda={renda} atualizarRenda={atualizarRenda} />
            <p>
              <span>Gasto real</span>
              <strong>R$ {totalGastos.toFixed(2)}</strong>
            </p>
            <p>
              <span>Gasto estimado</span>
              <strong>R$ {totalEstimado.toFixed(2)}</strong>
            </p>
            <p className={saldo >= 0 ? "linha-positiva" : "linha-negativa"}>
              <span>Saldo</span>
              <strong>R$ {saldo.toFixed(2)}</strong>
            </p>
          </div>

          <div className="card card-grafico">
            <GraficoPizza categorias={categorias} />
          </div>

          <div className="card card-lista">
            <h3>Detalhamento de Gastos</h3>
            <ListaCategorias
              categorias={categorias}
              atualizarItem={atualizarItem}
            />
          </div>

          <div className="card card-comparativo">
            <h3>Estimado x Real por categoria</h3>
            <GraficoEstimadoReal categorias={categorias} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
