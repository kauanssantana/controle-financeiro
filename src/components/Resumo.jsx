function Resumo({ renda, setRenda }) {
  return (
    <p>
      Renda:
      <input
        type="number"
        value={renda}
        onChange={(e) => setRenda(Number(e.target.value))}
      />
    </p>
  );
}

export default Resumo;
