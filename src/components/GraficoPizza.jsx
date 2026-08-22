import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

function GraficoPizza({ categorias }) {
  const dados = categorias.filter((cat) => cat.totalReal > 0);
  const total = dados.reduce((soma, cat) => soma + cat.totalReal, 0);

  if (dados.length === 0) {
    return <p className="sem-dados">Sem gastos lançados neste mês ainda.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="totalReal"
          nameKey="nome"
          cx="50%"
          cy="45%"
          outerRadius={110}
        >
          {dados.map((cat, index) => (
            <Cell key={cat.nome} fill={CORES[index % CORES.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => {
            const porcentagem = ((value / total) * 100).toFixed(1);
            return [`R$ ${value.toFixed(2)} (${porcentagem}%)`, ""];
          }}
        />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ fontSize: 14, paddingTop: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default GraficoPizza;
