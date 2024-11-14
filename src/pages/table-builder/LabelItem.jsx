import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";

export function LabelItem(props) {
  const { handleUpdate, selected, value, labels } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!labels || labels.length < 1) return;

  return (
    <Container ref={setNodeRef} style={style} {...attributes}>
      <Handle {...listeners} />
      <Label htmlFor={value} onClick={() => handleUpdate(value)}>
        <input
          name={value}
          type="checkbox"
          readOnly={true}
          checked={selected.labels.includes(value)}
          value={value}
        />
        {value}
      </Label>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px;
  background-color: lightred;
`;

const Handle = styled.div`
  width: 15px;
  height: 15px;
  margin-right: 10px;
  background-color: lightblue;
  cursor: pointer;
`;

const Label = styled.div`
  cursor: pointer;
`;
