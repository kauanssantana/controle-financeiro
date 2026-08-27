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
    // O hack do width "99%" força o recálculo responsivo perfeito
    <ResponsiveContainer width="99%" height={280}>
      <BarChart
        data={dados}
        // Margem esquerda negativa para não desperdiçar espaço valioso no celular
        margin={{ top: 8, right: 0, left: -20, bottom: 24 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(27, 36, 48, 0.15)" />
        <XAxis
          dataKey="nome"
          angle={-25}
          textAnchor="end"
          interval={0}
          height={60}
          tick={{ fontSize: 10 }} // Fonte reduzida para caber os textos
        />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
        <Bar dataKey="Estimado" fill="#1f8a8a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Real" fill="#16233f" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoEstimadoReal;
