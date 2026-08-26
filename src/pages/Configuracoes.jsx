import { useRef } from "react";

function Configuracoes({ totalMeses, listaMeses, restaurarBackup }) {
  const inputArquivoRef = useRef(null);

  function limparDados() {
    const confirmou = window.confirm(
      "Isso vai apagar TODOS os dados salvos no navegador e recarregar os dados originais da planilha. Tem certeza?",
    );
    if (confirmou) {
      localStorage.clear();
      window.location.reload();
    }
  }

  // Gera um arquivo .json com todos os dados e força o download no navegador
  function baixarBackup() {
    const conteudo = JSON.stringify(listaMeses, null, 2);
    const blob = new Blob([conteudo], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const dataHoje = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-controle-financeiro-${dataHoje}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function lerArquivoImportado(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result);

        if (!Array.isArray(dados)) {
          throw new Error("Formato inválido: esperava uma lista de meses.");
        }

        const confirmou = window.confirm(
          `Encontrados ${dados.length} meses no arquivo. Isso vai SUBSTITUIR todos os dados atuais. Continuar?`,
        );
        if (confirmou) {
          restaurarBackup(dados);
          alert("Backup restaurado com sucesso!");
        }
      } catch (erro) {
        alert(
          "Não foi possível ler esse arquivo. Confirme se é um backup exportado por este app.\n\n" +
            erro.message,
        );
      }
    };
    leitor.readAsText(arquivo);

    evento.target.value = "";
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

        <div className="acoes-backup">
          <button onClick={baixarBackup} className="botao-primario">
            Baixar backup (.json)
          </button>

          <button
            onClick={() => inputArquivoRef.current.click()}
            className="botao-secundario"
          >
            Restaurar backup
          </button>
          <input
            type="file"
            accept=".json"
            ref={inputArquivoRef}
            onChange={lerArquivoImportado}
            style={{ display: "none" }}
          />
        </div>

        <p className="dica-backup">
          Como os dados ficam salvos só neste navegador, recomendamos baixar um
          backup periodicamente (ex: toda vez que fechar o mês) e guardar em um
          lugar seguro (Google Drive, e-mail, etc.).
        </p>

        <button onClick={limparDados} className="botao-perigo">
          Limpar todos os dados
        </button>
      </div>
    </div>
  );
}

export default Configuracoes;
