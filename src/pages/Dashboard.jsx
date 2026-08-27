import GraficoPizza from "../components/GraficoPizza";
import GraficoEstimadoReal from "../components/GraficoEstimadoReal";
import ListaCategorias from "../components/ListaCategorias";
import VisaoGeral from "../components/VisaoGeral";
import AbasAno from "../components/AbasAno";

function Dashboard({ dados, navegacao, acoes }) {
  const { mesAtual, categorias, renda, saldo, totalGastos, totalEstimado } =
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
  const { atualizarRenda, atualizarSaldo, atualizarItem } = acoes;

  // NOVA FUNÇÃO: Chama a tela de impressão do navegador para gerar o PDF
  function gerarPDF() {
    window.print();
  }

  return (
    <>
      <AbasAno
        anos={anosDisponiveis}
        anoSelecionado={anoSelecionado}
        onSelecionarAno={trocarAno}
      />

      <header className="cabecalho-mes">
        {/* Lado esquerdo: Botão Anterior */}
        <div style={{ display: "flex", gap: "8px", flex: 1 }}>
          <button onClick={mesAnterior} disabled={mesAtualIndex === 0}>
            ← Anterior
          </button>
        </div>

        {/* Centro: Título do Mês */}
        <h2 style={{ textAlign: "center", flex: 1 }}>
          {mesAtual.mes} de {mesAtual.ano}
        </h2>

        {/* Lado direito: PDF, Próximo e Novo Mês */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flex: 1,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button onClick={gerarPDF}>📄 PDF</button>

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
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="card card-resumo">
          <h3>Visão Geral</h3>
          <VisaoGeral
            renda={renda}
            saldo={saldo}
            totalGastos={totalGastos}
            totalEstimado={totalEstimado}
            atualizarRenda={atualizarRenda}
            atualizarSaldo={atualizarSaldo}
          />
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
