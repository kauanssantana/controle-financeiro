import { meses } from "./data/meses";
import GraficoPizza from "./components/GraficoPizza";
import ListaCategorias from "./components/ListaCategorias";
import Resumo from "./components/Resumo";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [mesAtualIndex, setMesAtualIndex] = useState(meses.length - 1);
  const mesAtual = meses[mesAtualIndex];

  // Variável auxiliar para padronizar a chave de busca e salvamento
  const chaveMes = `${mesAtual.ano}_${mesAtual.mesNum}`;

  // 1. Inicializa a renda buscando primeiro no cache específico do mês
  const [renda, setRenda] = useState(() => {
    const salvo = localStorage.getItem(`renda_${chaveMes}`);
    return salvo ? Number(salvo) : mesAtual.renda;
  });

  // 2. Inicializa as categorias buscando primeiro no cache específico do mês
  const [categorias, setCategorias] = useState(() => {
    const salvo = localStorage.getItem(`categorias_${chaveMes}`);
    return salvo ? JSON.parse(salvo) : mesAtual.categorias;
  });

  // 3. ATUALIZAÇÃO CORRETA (Derived State): Substitui o useEffect problemático
  // Compara o mês que estava na tela com o mês que o usuário selecionou agora
  const [mesAnteriorState, setMesAnteriorState] = useState(mesAtualIndex);

  if (mesAtualIndex !== mesAnteriorState) {
    const rendaSalva = localStorage.getItem(`renda_${chaveMes}`);
    setRenda(rendaSalva ? Number(rendaSalva) : mesAtual.renda);

    const categoriasSalvas = localStorage.getItem(`categorias_${chaveMes}`);
    setCategorias(
      categoriasSalvas ? JSON.parse(categoriasSalvas) : mesAtual.categorias,
    );

    // Atualiza o rastreador para indicar que a tela já atualizou
    setMesAnteriorState(mesAtualIndex);
  }

  // 4. Salva no cache usando a chave única do mês/ano
  useEffect(() => {
    localStorage.setItem(`renda_${chaveMes}`, renda);
  }, [renda, chaveMes]);

  useEffect(() => {
    localStorage.setItem(`categorias_${chaveMes}`, JSON.stringify(categorias));
  }, [categorias, chaveMes]);

  const totalGastos = categorias.reduce(
    (acumulador, cat) => acumulador + cat.valor,
    0,
  );
  const saldo = renda - totalGastos;

  function atualizarCategoria(nomeCategoria, novoValor) {
    setCategorias(
      categorias.map((cat) =>
        cat.nome === nomeCategoria ? { ...cat, valor: novoValor } : cat,
      ),
    );
  }

  function mesAnterior() {
    if (mesAtualIndex > 0) {
      setMesAtualIndex(mesAtualIndex - 1);
    }
  }

  function proximoMes() {
    if (mesAtualIndex < meses.length - 1) {
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
            disabled={mesAtualIndex === meses.length - 1}
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
