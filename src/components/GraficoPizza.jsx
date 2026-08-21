import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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

  if (dados.length === 0) {
    return <p className="sem-dados">Sem gastos lançados neste mês ainda.</p>;
  }

  return (
    <PieChart width={380} height={300}>
      <Pie
        data={dados}
        dataKey="totalReal"
        nameKey="nome"
        cx="45%"
        cy="50%"
        outerRadius={100}
      >
        {dados.map((cat, index) => (
          <Cell key={cat.nome} fill={CORES[index % CORES.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
      <Legend
        layout="vertical"
        align="right"
        verticalAlign="middle"
        wrapperStyle={{ fontSize: 12 }}
      />
    </PieChart>
  );
}

export default GraficoPizza;
