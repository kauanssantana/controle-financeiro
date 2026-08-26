function BarraProgresso({ totalEstimado, totalReal }) {
  const estourou = totalReal > totalEstimado;

  // Se não há orçamento definido (estimado = 0) mas já existe gasto,
  // consideramos "estourado" de cara (não dá pra calcular % de algo sobre zero)
  const percentual =
    totalEstimado > 0
      ? Math.min((totalReal / totalEstimado) * 100, 100)
      : totalReal > 0
        ? 100
        : 0;

  return (
    <div className="barra-progresso-wrap">
      <div className="barra-progresso-trilho">
        <div
          className={
            estourou
              ? "barra-progresso-preenchida estourada"
              : "barra-progresso-preenchida"
          }
          style={{ width: `${percentual}%` }}
        />
      </div>
      <span
        className={
          estourou ? "barra-progresso-texto estourada" : "barra-progresso-texto"
        }
      >
        {totalEstimado > 0
          ? `${((totalReal / totalEstimado) * 100).toFixed(0)}%`
          : "—"}
      </span>
    </div>
  );
}

function ListaCategorias({ categorias, atualizarItem }) {
  return (
    <div className="lista-categorias">
      {categorias.map((cat) => (
        <div key={cat.nome} className="categoria-bloco">
          <div className="categoria-cabecalho">
            <h4>{cat.nome}</h4>
            <span className="categoria-totais">
              Estimado: R$ {cat.totalEstimado.toFixed(2)} · Real: R${" "}
              {cat.totalReal.toFixed(2)}
            </span>
            <BarraProgresso
              totalEstimado={cat.totalEstimado}
              totalReal={cat.totalReal}
            />
          </div>

          <table className="tabela-itens">
            <thead>
              <tr>
                <th>Item</th>
                <th>Estimado</th>
                <th>Real</th>
              </tr>
            </thead>
            <tbody>
              {cat.itens.map((item) => (
                <tr key={item.nome}>
                  <td>{item.nome}</td>
                  <td>
                    <input
                      type="number"
                      value={item.estimado}
                      onChange={(e) =>
                        atualizarItem(
                          cat.nome,
                          item.nome,
                          "estimado",
                          Number(e.target.value),
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.real}
                      onChange={(e) =>
                        atualizarItem(
                          cat.nome,
                          item.nome,
                          "real",
                          Number(e.target.value),
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ListaCategorias;
