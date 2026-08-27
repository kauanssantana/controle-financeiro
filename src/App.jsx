import { Routes, Route } from "react-router-dom";
import { meses } from "./data/meses";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
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

  const anosDisponiveis = [...new Set(listaMeses.map((mes) => mes.ano))].sort();

  const [anoSelecionado, setAnoSelecionado] = useState(
    listaMeses[listaMeses.length - 1].ano,
  );

  const mesesDoAno = listaMeses
    .filter((mes) => mes.ano === anoSelecionado)
    .sort((a, b) => a.mesNum - b.mesNum);

  const [mesAtualIndex, setMesAtualIndex] = useState(mesesDoAno.length - 1);
  const mesAtual = mesesDoAno[mesAtualIndex];
  const renda = mesAtual.renda.real; // { projetada: {fixa, extra, total}, real: {fixa, extra, total} }
  const saldo = mesAtual.saldo; // { previsto, real, inicial, final }
  const categorias = mesAtual.categorias;

  const totalGastos = categorias.reduce((soma, cat) => soma + cat.totalReal, 0);
  const totalEstimado = categorias.reduce(
    (soma, cat) => soma + cat.totalEstimado,
    0,
  );

  function trocarAno(novoAno) {
    setAnoSelecionado(novoAno);
    const mesesDoNovoAno = listaMeses.filter((mes) => mes.ano === novoAno);
    setMesAtualIndex(mesesDoNovoAno.length - 1);
  }

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

  // tipo: "projetada" ou "real" | campo: "fixa" ou "extra"
  function atualizarRenda(campo, novoValor) {
    setListaMeses(
      listaMeses.map((mes) => {
        if (mes.ano !== mesAtual.ano || mes.mesNum !== mesAtual.mesNum)
          return mes;
        const rendaAtualizada = { ...mes.renda.real, [campo]: novoValor };
        rendaAtualizada.total = rendaAtualizada.fixa + rendaAtualizada.extra;
        return {
          ...mes,
          renda: { ...mes.renda, real: rendaAtualizada },
        };
      }),
    );
  }

  // campo: "previsto" | "real" | "inicial" | "final"
  function atualizarSaldo(campo, novoValor) {
    setListaMeses(
      listaMeses.map((mes) =>
        mes.ano === mesAtual.ano && mes.mesNum === mesAtual.mesNum
          ? { ...mes, saldo: { ...mes.saldo, [campo]: novoValor } }
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
      renda: {
        projetada: { ...ultimoMes.renda.projetada },
        real: { fixa: 0, extra: 0, total: 0 },
      },
      saldo: { previsto: 0, real: 0, inicial: ultimoMes.saldo.final, final: 0 },
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

  const dadosDashboard = {
    mesAtual,
    categorias,
    renda,
    saldo,
    totalGastos,
    totalEstimado,
  };
  const navegacaoDashboard = {
    anosDisponiveis,
    anoSelecionado,
    trocarAno,
    mesesDoAno,
    mesAtualIndex,
    mesAnterior,
    proximoMes,
    criarProximoMes,
    ehUltimoMesGlobal,
  };
  const acoesDashboard = { atualizarRenda, atualizarSaldo, atualizarItem };

  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="app-layout">
      <button
        className="menu-toggle"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        {menuAberto ? "✕" : "☰"}
      </button>

      <div
        className={`menu-overlay ${menuAberto ? "ativo" : ""}`}
        onClick={() => setMenuAberto(false)}
      ></div>

      <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                dados={dadosDashboard}
                navegacao={navegacaoDashboard}
                acoes={acoesDashboard}
              />
            }
          />
          <Route
            path="/relatorios"
            element={<Relatorios listaMeses={listaMeses} />}
          />
          <Route
            path="/configuracoes"
            element={<Configuracoes totalMeses={listaMeses.length} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
