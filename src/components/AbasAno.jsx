function AbasAno({ anos, anoSelecionado, onSelecionarAno }) {
  return (
    <div className="abas-ano">
      {anos.map((ano) => (
        <button
          key={ano}
          className={ano === anoSelecionado ? "aba-ano ativa" : "aba-ano"}
          onClick={() => onSelecionarAno(ano)}
        >
          {ano}
        </button>
      ))}
    </div>
  );
}

export default AbasAno;
