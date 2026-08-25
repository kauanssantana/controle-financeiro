import { useState } from "react";
import AbasAno from "../components/AbasAno";
import GraficoPizza from "../components/GraficoPizza";
import GraficoEstimadoReal from "../components/GraficoEstimadoReal";
import GraficoEvolucaoSaldo from "../components/GraficoEvolucaoSaldo";

// Soma os totais (e itens) de cada categoria em todos os meses de um ano,
// gerando uma lista de categorias "do ano inteiro" no mesmo formato que os
// gráficos do Dashboard já sabem ler — assim reaproveitamos os componentes
// em vez de duplicar lógica de gráfico.
function agregarCategoriasPorAno(mesesDoAno) {
  const mapa = {};

  mesesDoAno.forEach((mes) => {
    mes.categorias.forEach((cat) => {
      if (!mapa[cat.nome]) {
        mapa[cat.nome] = {
          nome: cat.nome,
          totalEstimado: 0,
          totalReal: 0,
          itensMap: {},
        };
      }
      mapa[cat.nome].totalEstimado += cat.totalEstimado;
      mapa[cat.nome].totalReal += cat.totalReal;

      cat.itens.forEach((item) => {
        if (!mapa[cat.nome].itensMap[item.nome]) {
          mapa[cat.nome].itensMap[item.nome] = {
            nome: item.nome,
            estimado: 0,
            real: 0,
          };
        }
        mapa[cat.nome].itensMap[item.nome].estimado += item.estimado;
        mapa[cat.nome].itensMap[item.nome].real += item.real;
      });
    });
  });

  return Object.values(mapa).map((cat) => ({
    nome: cat.nome,
    totalEstimado: cat.totalEstimado,
    totalReal: cat.totalReal,
    itens: Object.values(cat.itensMap),
  }));
}

function Relatorios({ listaMeses }) {
  const anos = [...new Set(listaMeses.map((mes) => mes.ano))].sort();
  const [anoSelecionado, setAnoSelecionado] = useState(anos[anos.length - 1]);

  const resumoPorAno = anos.map((ano) => {
    const mesesDoAno = listaMeses.filter((mes) => mes.ano === ano);
    const rendaTotal = mesesDoAno.reduce(
      (soma, mes) => soma + mes.renda.real.total,
      0,
    );
    const gastoTotal = mesesDoAno.reduce(
      (soma, mes) =>
        soma + mes.categorias.reduce((s, cat) => s + cat.totalReal, 0),
      0,
    );
    return {
      ano,
      quantidadeMeses: mesesDoAno.length,
      rendaTotal,
      gastoTotal,
      saldoTotal: rendaTotal - gastoTotal,
    };
  });

  const mesesDoAnoSelecionado = listaMeses.filter(
    (mes) => mes.ano === anoSelecionado,
  );
  const categoriasDoAno = agregarCategoriasPorAno(mesesDoAnoSelecionado);

  return (
    <div className="pagina-relatorios">
      <h2>Relatórios</h2>

      <div className="card">
        <h3>Evolução do saldo (histórico completo)</h3>
        <GraficoEvolucaoSaldo listaMeses={listaMeses} />
      </div>

      <h3 className="secao-relatorio-titulo">Resumo por ano</h3>
      <div className="tabela-relatorio-wrap">
        <table className="tabela-relatorio">
          <thead>
            <tr>
              <th>Ano</th>
              <th>Meses registrados</th>
              <th>Renda total</th>
              <th>Gasto total</th>
              <th>Saldo total</th>
            </tr>
          </thead>
          <tbody>
            {resumoPorAno.map((r) => (
              <tr key={r.ano}>
                <td>{r.ano}</td>
                <td>{r.quantidadeMeses}</td>
                <td>R$ {r.rendaTotal.toFixed(2)}</td>
                <td>R$ {r.gastoTotal.toFixed(2)}</td>
                <td
                  className={
                    r.saldoTotal >= 0 ? "linha-positiva" : "linha-negativa"
                  }
                >
                  R$ {r.saldoTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="secao-relatorio-titulo">Gastos por categoria no ano</h3>
      <AbasAno
        anos={anos}
        anoSelecionado={anoSelecionado}
        onSelecionarAno={setAnoSelecionado}
      />

      <div className="dashboard-grid">
        <div className="card card-grafico">
          <GraficoPizza categorias={categoriasDoAno} />
        </div>
        <div className="card card-comparativo">
          <h3>Estimado x Real por categoria — {anoSelecionado}</h3>
          <GraficoEstimadoReal categorias={categoriasDoAno} />
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
