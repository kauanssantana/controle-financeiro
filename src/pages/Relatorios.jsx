function Relatorios({ listaMeses }) {
  const anos = [...new Set(listaMeses.map((mes) => mes.ano))].sort();

  const resumoPorAno = anos.map((ano) => {
    const mesesDoAno = listaMeses.filter((mes) => mes.ano === ano);
    const rendaTotal = mesesDoAno.reduce(
      (soma, mes) => soma + mes.renda.real.total,
      0,
    );
    const gastoTotal = mesesDoAno.reduce(
      (soma, mes) =>
        soma + mes.categorias.reduce((s, cat) => s + cat.totalReal, 0),
      0,
    );
    return {
      ano,
      quantidadeMeses: mesesDoAno.length,
      rendaTotal,
      gastoTotal,
      saldoTotal: rendaTotal - gastoTotal,
    };
  });

  return (
    <div className="pagina-relatorios">
      <h2>Relatórios anuais</h2>
      <div className="tabela-relatorio-wrap">
        <table className="tabela-relatorio">
          <thead>
            <tr>
              <th>Ano</th>
              <th>Meses registrados</th>
              <th>Renda total</th>
              <th>Gasto total</th>
              <th>Saldo total</th>
            </tr>
          </thead>
          <tbody>
            {resumoPorAno.map((r) => (
              <tr key={r.ano}>
                <td>{r.ano}</td>
                <td>{r.quantidadeMeses}</td>
                <td>R$ {r.rendaTotal.toFixed(2)}</td>
                <td>R$ {r.gastoTotal.toFixed(2)}</td>
                <td
                  className={
                    r.saldoTotal >= 0 ? "linha-positiva" : "linha-negativa"
                  }
                >
                  R$ {r.saldoTotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Relatorios;
