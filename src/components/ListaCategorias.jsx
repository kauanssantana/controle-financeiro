function ListaCategorias({ categorias, atualizarCategoria }) {
  return (
    <div>
      <p>Gastos:</p>
      {categorias.map((cat) => (
        <p key={cat.nome}>
          {cat.nome}:
          <input
            type="number"
            value={cat.valor}
            onChange={(e) =>
              atualizarCategoria(cat.nome, Number(e.target.value))
            }
          />
        </p>
      ))}
    </div>
  );
}

export default ListaCategorias;
