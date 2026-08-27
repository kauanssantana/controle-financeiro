import { useState } from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";

const CORES = [
  "#16233f",
  "#1f8a8a",
  "#5b6472",
  "#c1443d",
  "#3c5a78",
  "#8aa6c9",
  "#274060",
  "#9aa5b1",
];

function fatiaDestacada(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
}

function GraficoPizza({ categorias }) {
  const [indiceAtivo, setIndiceAtivo] = useState(null);

  const dados = categorias.filter((cat) => cat.totalReal > 0);
  const totalGasto = dados.reduce((acc, cat) => acc + cat.totalReal, 0);

  // Lógica para varrer todos os itens de todas as categorias e achar o maior
  let todosOsItens = [];
  categorias.forEach((cat) => {
    if (cat.itens) {
      cat.itens.forEach((item) => {
        if (item.real > 0) {
          todosOsItens.push({
            nome: item.nome,
            valor: item.real,
            categoria: cat.nome,
          });
        }
      });
    }
  });

  // Ordena os itens do maior para o menor
  todosOsItens.sort((a, b) => b.valor - a.valor);

  // Pega o primeiro item da lista (o mais caro)
  const topItem = todosOsItens.length > 0 ? todosOsItens[0] : null;
  const topItemPercent =
    topItem && totalGasto > 0
      ? ((topItem.valor / totalGasto) * 100).toFixed(1)
      : 0;

  if (dados.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <h3>Distribuição de Gastos Reais</h3>
        <p className="sem-dados">Sem gastos lançados neste mês ainda.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <h3>Distribuição de Gastos Reais</h3>

      {/* Destaque do Maior ITEM do mês com o layout alinhado pelas pontas */}
      {topItem && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "-12px 0 24px 0",
            paddingBottom: "8px",
            borderBottom: "1px solid rgba(27, 36, 48, 0.2)",
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--cor-texto)",
            opacity: 0.9,
          }}
        >
          <span>💡 Maior gasto:</span>
          <span style={{ color: "var(--cor-negativo)", fontWeight: 700 }}>
            {topItem.nome} ({topItemPercent}%)
          </span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
          flex: 1,
          padding: "10px 0",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 360,
            height: 360,
            margin: "0 auto",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dados}
                dataKey="totalReal"
                nameKey="nome"
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                activeIndex={indiceAtivo !== null ? indiceAtivo : -1}
                activeShape={fatiaDestacada}
                onMouseEnter={(_, index) => setIndiceAtivo(index)}
                onMouseLeave={() => setIndiceAtivo(null)}
              >
                {dados.map((cat, index) => (
                  <Cell key={cat.nome} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* O TEXTO DENTRO DA ROSCA */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
              width: "160px",
              color: "var(--cor-texto)",
            }}
          >
            {indiceAtivo !== null && dados[indiceAtivo] ? (
              <>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "4px",
                    lineHeight: "1.1",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {dados[indiceAtivo].nome.replace("/", "/ ")}
                </div>
                <div style={{ fontSize: "17px", fontWeight: 500 }}>
                  {`R$ ${dados[indiceAtivo].totalReal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                </div>
                <div
                  style={{ fontSize: "15px", opacity: 0.8, marginTop: "2px" }}
                >
                  {`(${((dados[indiceAtivo].totalReal / totalGasto) * 100).toFixed(1)}%)`}
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    opacity: 0.6,
                    marginBottom: "4px",
                  }}
                >
                  Total Gasto
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "var(--cor-negativo)",
                  }}
                >
                  {`R$ ${totalGasto.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Legenda */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {dados.map((cat, index) => (
            <div
              key={cat.nome}
              onMouseEnter={() => setIndiceAtivo(index)}
              onMouseLeave={() => setIndiceAtivo(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: indiceAtivo === index ? 700 : 500,
                color: "var(--cor-texto)",
                opacity:
                  indiceAtivo !== null && indiceAtivo !== index ? 0.4 : 1,
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: CORES[index % CORES.length],
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span>{cat.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GraficoPizza;
