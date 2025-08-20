import React, { useMemo, useState } from "react";
import CardProduto from "./components/CardProduto";
import styled from "styled-components";

/* Layout básico só para organizar os cards */
const Page = styled.main`
  min-height: 100dvh;
  display: grid;
  align-content: start;
  gap: 24px;
  padding: 24px;
  background: #f8fafc;
`;

const Grid = styled.section`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
`;

const Title = styled.h1`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  margin: 0;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #475569;
`;

export default function App() {
  // Dados estáticos (poderia vir de API)
  const produtos = useMemo(
    () => [
      { id: "p1", nome: "Cafeteira Inox 700ml", preco: 219.9 },
      { id: "p2", nome: "Moedor de Café Manual", preco: 159.5 },
      { id: "p3", nome: "Balança de Precisão", preco: 129.0 },
      { id: "p4", nome: "Caneca Térmica 350ml", preco: 89.9 },
    ],
    []
  );

  // Estado: ids adicionados ao carrinho
  const [carrinho, setCarrinho] = useState(() => new Set());

  const toggleCarrinho = (id) => {
    setCarrinho((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Page>
      <header>
        <Title>Loja • CSS-in-JS</Title>
        <Subtitle>Styled Components • Estilo dinâmico por props</Subtitle>
      </header>

      <Grid>
        {produtos.map((p) => (
          <CardProduto
            key={p.id}
            nome={p.nome}
            preco={p.preco}
            adicionada={carrinho.has(p.id)}
            onToggle={() => toggleCarrinho(p.id)}
          />
        ))}
      </Grid>
    </Page>
  );
}
