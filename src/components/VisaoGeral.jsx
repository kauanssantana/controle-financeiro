function VisaoGeral({
  renda,
  saldo,
  totalGastos,
  totalEstimado,
  atualizarRenda,
  atualizarSaldo,
}) {
  const saldoCalculado = renda.total - totalGastos;

  return (
    <div className="visao-geral">
      <div className="bloco-renda">
        <h4>Renda</h4>
        <p>
          <span>Renda fixa</span>
          <input
            type="number"
            value={renda.fixa}
            onChange={(e) => atualizarRenda("fixa", Number(e.target.value))}
          />
        </p>
        <p>
          <span>Renda extra</span>
          <input
            type="number"
            value={renda.extra}
            onChange={(e) => atualizarRenda("extra", Number(e.target.value))}
          />
        </p>
        <p className="linha-total">
          <span>Total</span>
          <strong>R$ {renda.total.toFixed(2)}</strong>
        </p>
      </div>

      <div className="saldos-comparativo">
        <p>
          <span>Saldo inicial do mês</span>
          <input
            type="number"
            value={saldo.inicial}
            onChange={(e) => atualizarSaldo("inicial", Number(e.target.value))}
          />
        </p>
        <p>
          <span>Saldo final do mês</span>
          <input
            type="number"
            value={saldo.final}
            onChange={(e) => atualizarSaldo("final", Number(e.target.value))}
          />
        </p>
      </div>

      <div className="totais-gastos">
        <p>
          <span>Gasto real</span>
          <strong>R$ {totalGastos.toFixed(2)}</strong>
        </p>
        <p>
          <span>Gasto estimado</span>
          <strong>R$ {totalEstimado.toFixed(2)}</strong>
        </p>
        <p
          className={saldoCalculado >= 0 ? "linha-positiva" : "linha-negativa"}
        >
          <span>Saldo do mês (renda − gasto real)</span>
          <strong>R$ {saldoCalculado.toFixed(2)}</strong>
        </p>
      </div>
    </div>
  );
}

export default VisaoGeral;
