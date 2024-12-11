import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import { getPathStr } from "../../utils";

export function PathItem(props) {
  const { handleUpdate, id, paths, selected } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!paths || paths.length < 1) return;

  const pathStr = getPathStr(paths.filter((path) => path.id === id)[0]);
  return (
    <Container ref={setNodeRef} style={style} {...attributes}>
      <Handle {...listeners} />
      <Label key={pathStr} htmlFor={id} onClick={() => handleUpdate(id)}>
        <input
          id={id}
          name={id}
          type="checkbox"
          readOnly={true}
          checked={selected.paths.some((path) => path.id == id)}
          value={pathStr}
        />
        {pathStr}
      </Label>
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

const Label = styled.div`
  cursor: pointer;
`;
