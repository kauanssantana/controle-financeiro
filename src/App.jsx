import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [renda, setRenda] = useState(() => {
    const salvo = localStorage.getItem("renda");
    return salvo ? Number(salvo) : 2500;
  });

  useEffect(() => {
    localStorage.setItem("renda", renda);
  }, [renda]);

  const [categorias, setCategorias] = useState(() => {
    const salvo = localStorage.getItem("categorias");
    return salvo
      ? JSON.parse(salvo)
      : [
          { nome: "Moradia", valor: 800 },
          { nome: "Transporte", valor: 300 },
          { nome: "Comida", valor: 500 },
        ];
  });

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  const totalGastos = categorias.reduce(
    (acumulador, cat) => acumulador + cat.valor,
    0,
  );
  const saldo = renda - totalGastos;

  function atualizarCategoria(nomeCategoria, novoValor) {
    setCategorias(
      categorias.map((cat) =>
        cat.nome === nomeCategoria ? { ...cat, valor: novoValor } : cat,
      ),
    );
  }

  return (
    <div className="container">
      <h1>Controle Financeiro</h1>

      <div className="resumo">
        <p>
          Renda:
          <input
            type="number"
            value={renda}
            onChange={(e) => setRenda(Number(e.target.value))}
          />
        </p>
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
        <p>Saldo: {saldo}</p>

        <PieChart width={300} height={300}>
          <Pie
            data={categorias}
            dataKey="valor"
            nameKey="nome"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {categorias.map((cat, index) => (
              <Cell
                key={cat.nome}
                fill={["#3d5a45", "#c9a24b", "#a65d3f"][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}

export default App;
