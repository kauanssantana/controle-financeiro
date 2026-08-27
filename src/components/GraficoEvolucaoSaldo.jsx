import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function GraficoEvolucaoSaldo({ listaMeses }) {
  const dados = listaMeses
    .slice()
    .sort((a, b) => a.ano - b.ano || a.mesNum - b.mesNum)
    .map((mes) => {
      const gastoReal = mes.categorias.reduce(
        (soma, cat) => soma + cat.totalReal,
        0,
      );
      const saldo = mes.renda.real.total - gastoReal;
      return {
        label: `${mes.mes.slice(0, 3)}/${String(mes.ano).slice(2)}`,
        Saldo: Number(saldo.toFixed(2)),
      };
    });

  return (
    <ResponsiveContainer width="99%" height={280}>
      <LineChart
        data={dados}
        margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(27, 36, 48, 0.15)" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
        <Line
          type="monotone"
          dataKey="Saldo"
          stroke="#16233f"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GraficoEvolucaoSaldo;
