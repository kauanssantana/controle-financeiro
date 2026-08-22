import { useState } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";

const CORES = [
  "#3d5a45",
  "#c9a24b",
  "#a65d3f",
  "#6b8f71",
  "#8a9b6e",
  "#5c7a8a",
  "#b0755f",
  "#7a5c8a",
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
        {/* Título padronizado globalmente pelo App.css */}
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
      {/* Título limpo e padronizado! */}
      <h3>Distribuição de Gastos Reais</h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
          flex: 1,
          padding: "10px 0",
        }}
      >
        <div style={{ position: "relative", width: 360, height: 360 }}>
          <PieChart width={360} height={360}>
            <Pie
              data={dados}
              dataKey="totalReal"
              nameKey="nome"
              cx="50%"
              cy="50%"
              innerRadius={110}
              outerRadius={155}
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

          {/* O TEXTO DENTRO DA ROSCA - COM QUEBRA DE LINHA INTELIGENTE */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
              width: "160px", // Margem de segurança para o anel
              color: "var(--tinta)",
            }}
          >
            {indiceAtivo !== null && dados[indiceAtivo] ? (
              <>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "4px",
                    lineHeight: "1.1", // Mantém as linhas da quebra juntinhas
                    wordBreak: "break-word", // Força a quebra
                    overflowWrap: "break-word",
                  }}
                >
                  {/* Troca "/" por "/ " invisível para garantir a quebra */}
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
                    color: "var(--terracota)",
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
                color: "var(--tinta)",
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
