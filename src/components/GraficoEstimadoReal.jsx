import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function GraficoEstimadoReal({ categorias }) {
  const dados = categorias.map((cat) => ({
    nome: cat.nome.length > 10 ? cat.nome.slice(0, 10) + "…" : cat.nome,
    Estimado: cat.totalEstimado,
    Real: cat.totalReal,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={dados}
        margin={{ top: 8, right: 16, left: 0, bottom: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,51,43,0.15)" />
        <XAxis
          dataKey="nome"
          angle={-25}
          textAnchor="end"
          interval={0}
          height={60}
          tick={{ fontSize: 11 }}
        />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="Estimado" fill="#c9a24b" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Real" fill="#3d5a45" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoEstimadoReal;
