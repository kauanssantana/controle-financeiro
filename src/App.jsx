import { meses } from "./data/meses";
import GraficoPizza from "./components/GraficoPizza";
import GraficoEstimadoReal from "./components/GraficoEstimadoReal";
import ListaCategorias from "./components/ListaCategorias";
import Resumo from "./components/Resumo";
import AbasAno from "./components/AbasAno";
import { useState, useEffect } from "react";
import "./App.css";

function recalcularCategoria(categoria) {
  const totalEstimado = categoria.itens.reduce(
    (soma, i) => soma + i.estimado,
    0,
  );
  const totalReal = categoria.itens.reduce((soma, i) => soma + i.real, 0);
  return { ...categoria, totalEstimado, totalReal };
}

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function App() {
  const [listaMeses, setListaMeses] = useState(() => {
    const salvo = localStorage.getItem("meses");
    return salvo ? JSON.parse(salvo) : meses;
  });

  useEffect(() => {
    localStorage.setItem("meses", JSON.stringify(listaMeses));
  }, [listaMeses]);

  // Lista de anos únicos disponíveis, em ordem (ex: [2025, 2026])
  const anosDisponiveis = [...new Set(listaMeses.map((mes) => mes.ano))].sort();

  const [anoSelecionado, setAnoSelecionado] = useState(
    listaMeses[listaMeses.length - 1].ano,
  );

  // Só os meses do ano selecionado, na ordem certa
  const mesesDoAno = listaMeses
    .filter((mes) => mes.ano === anoSelecionado)
    .sort((a, b) => a.mesNum - b.mesNum);

  const [mesAtualIndex, setMesAtualIndex] = useState(mesesDoAno.length - 1);
  const mesAtual = mesesDoAno[mesAtualIndex];
  const renda = mesAtual.renda;
  const categorias = mesAtual.categorias;

  const totalGastos = categorias.reduce((soma, cat) => soma + cat.totalReal, 0);
  const totalEstimado = categorias.reduce(
    (soma, cat) => soma + cat.totalEstimado,
    0,
  );
  const saldo = renda - totalGastos;

  // Troca de ano: seleciona o novo ano e aponta pro último mês disponível dele
  function trocarAno(novoAno) {
    setAnoSelecionado(novoAno);
    const mesesDoNovoAno = listaMeses.filter((mes) => mes.ano === novoAno);
    setMesAtualIndex(mesesDoNovoAno.length - 1);
  }

  // Identificamos o mês a editar por ano+mesNum (não por índice) — mais seguro
  // agora que existe mais de uma "visão" (lista completa x lista filtrada por ano).
  function atualizarItem(nomeCategoria, nomeItem, campo, novoValor) {
    setListaMeses(
      listaMeses.map((mes) => {
        if (mes.ano !== mesAtual.ano || mes.mesNum !== mesAtual.mesNum)
          return mes;
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
      listaMeses.map((mes) =>
        mes.ano === mesAtual.ano && mes.mesNum === mesAtual.mesNum
          ? { ...mes, renda: novoValor }
          : mes,
      ),
    );
  }

  function mesAnterior() {
    if (mesAtualIndex > 0) setMesAtualIndex(mesAtualIndex - 1);
  }

  function proximoMes() {
    if (mesAtualIndex < mesesDoAno.length - 1)
      setMesAtualIndex(mesAtualIndex + 1);
  }

  function criarProximoMes() {
    const ultimoMes = listaMeses[listaMeses.length - 1];

    let novoMesNum = ultimoMes.mesNum + 1;
    let novoAno = ultimoMes.ano;
    if (novoMesNum > 12) {
      novoMesNum = 1;
      novoAno = ultimoMes.ano + 1;
    }

    const novoMes = {
      ano: novoAno,
      mesNum: novoMesNum,
      mes: NOMES_MESES[novoMesNum - 1],
      renda: ultimoMes.renda,
      categorias: ultimoMes.categorias.map((cat) => ({
        nome: cat.nome,
        itens: cat.itens.map((item) => ({
          nome: item.nome,
          estimado: item.estimado,
          real: 0,
        })),
        totalEstimado: cat.totalEstimado,
        totalReal: 0,
      })),
    };

    // Quantos meses do novo ano já existem ANTES de adicionar o novo —
    // isso vai ser o índice dele dentro da lista filtrada depois.
    const mesesDoNovoAnoAntes = listaMeses.filter(
      (mes) => mes.ano === novoAno,
    ).length;

    setListaMeses([...listaMeses, novoMes]);
    setAnoSelecionado(novoAno);
    setMesAtualIndex(mesesDoNovoAnoAntes);
  }

  const ehUltimoMesGlobal =
    mesAtual.ano === listaMeses[listaMeses.length - 1].ano &&
    mesAtual.mesNum === listaMeses[listaMeses.length - 1].mesNum;

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
        <AbasAno
          anos={anosDisponiveis}
          anoSelecionado={anoSelecionado}
          onSelecionarAno={trocarAno}
        />

        <header className="cabecalho-mes">
          <button onClick={mesAnterior} disabled={mesAtualIndex === 0}>
            ← Anterior
          </button>
          <h2>
            {mesAtual.mes} de {mesAtual.ano}
          </h2>
          <button
            onClick={proximoMes}
            disabled={mesAtualIndex === mesesDoAno.length - 1}
          >
            Próximo →
          </button>
          {ehUltimoMesGlobal && mesAtualIndex === mesesDoAno.length - 1 && (
            <button onClick={criarProximoMes} className="botao-novo-mes">
              + Criar mês
            </button>
          )}
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
