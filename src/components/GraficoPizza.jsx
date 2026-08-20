import { PieChart, Pie, Cell, Tooltip } from "recharts";

function GraficoPizza({ categorias }) {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={categorias}
        dataKey="valor"
        nameKey="nome"
        cx="50%"
        cy="50%"
        outerRadius={100}
      >
        {categorias.map((cat, index) => (
          <Cell
            key={cat.nome}
            fill={["#3d5a45", "#c9a24b", "#a65d3f"][index % 3]}
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

export default GraficoPizza;
