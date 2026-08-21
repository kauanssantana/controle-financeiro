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
  const renda = mesAtual.renda;
  const categorias = mesAtual.categorias;

  const totalGastos = categorias.reduce((soma, cat) => soma + cat.totalReal, 0);
  const totalEstimado = categorias.reduce(
    (soma, cat) => soma + cat.totalEstimado,
    0,
  );
  const saldo = renda - totalGastos;

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
    totalGastos,
    totalEstimado,
    saldo,
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
  const acoesDashboard = { atualizarRenda, atualizarItem };

  return (
    <div className="app-layout">
      <Sidebar />
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
