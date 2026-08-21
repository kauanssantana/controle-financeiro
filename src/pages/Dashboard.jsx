import GraficoPizza from "../components/GraficoPizza";
import GraficoEstimadoReal from "../components/GraficoEstimadoReal";
import ListaCategorias from "../components/ListaCategorias";
import Resumo from "../components/Resumo";
import AbasAno from "../components/AbasAno";

function Dashboard({ dados, navegacao, acoes }) {
  const { mesAtual, categorias, renda, totalGastos, totalEstimado, saldo } =
    dados;
  const {
    anosDisponiveis,
    anoSelecionado,
    trocarAno,
    mesesDoAno,
    mesAtualIndex,
    mesAnterior,
    proximoMes,
    criarProximoMes,
    ehUltimoMesGlobal,
  } = navegacao;
  const { atualizarRenda, atualizarItem } = acoes;

  return (
    <>
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
    </>
  );
}

export default Dashboard;
