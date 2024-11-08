import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";

export function Item(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Container ref={setNodeRef} style={style} {...attributes}>
      <Handle {...listeners} />
      <Name>Name: {props.name}</Name>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Handle = styled.div`
  width: 15px;
  height: 15px;
  margin-right: 10px;
  background-color: lightblue;
  cursor: pointer;
`;

const Name = styled.p`
  margin: 7px 0px 7px 0px;
`;
