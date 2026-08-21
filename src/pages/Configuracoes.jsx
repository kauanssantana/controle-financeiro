function Configuracoes({ totalMeses }) {
  function limparDados() {
    const confirmou = window.confirm(
      "Isso vai apagar TODOS os dados salvos no navegador e recarregar os dados originais da planilha. Tem certeza?",
    );
    if (confirmou) {
      localStorage.clear();
      window.location.reload();
    }
  }

  return (
    <div className="pagina-configuracoes">
      <h2>Configurações</h2>

      <div className="card">
        <h3>Dados</h3>
        <p>
          <span>Meses salvos</span>
          <strong>{totalMeses}</strong>
        </p>
        <p>
          <span>Armazenamento</span>
          <strong>localStorage do navegador</strong>
        </p>
        <button onClick={limparDados} className="botao-perigo">
          Limpar todos os dados
        </button>
      </div>
    </div>
  );
}

export default Configuracoes;
