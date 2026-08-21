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
