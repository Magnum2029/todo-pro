import React from "react";
import styled from "styled-components";

/* ===========================
   Estilos (CSS-in-JS)
   =========================== */
const Card = styled.article`
  width: 100%;
  max-width: 320px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  display: grid;
  gap: 12px;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
`;

const Price = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #334155;
`;

const AddButton = styled.button`
  appearance: none;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform .05s ease, opacity .2s ease;

  /* Estilização dinâmica pela prop $adicionada */
  background: ${({ $adicionada }) => ($adicionada ? "#198754" : "#6c757d")};
  color: #fff;

  &:hover { opacity: .95; }
  &:active { transform: translateY(1px); }
`;

/* ===========================
   Componente
   =========================== */
export default function CardProduto({ nome, preco, adicionada, onToggle }) {
  return (
    <Card>
      <ProductName>{nome}</ProductName>
      <Price>{preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Price>
      <AddButton
        $adicionada={adicionada}
        onClick={onToggle}
        aria-pressed={adicionada}
      >
        {adicionada ? "Remover do carrinho" : "Adicionar ao carrinho"}
      </AddButton>
    </Card>
  );
}
