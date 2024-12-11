import React from "react";
import styled from "styled-components";

export function Item(props) {
  const { handleUpdate, selected, value, names, type } = props;

  if (!names || names.length < 1) return;

  return (
    <Container>
      <Label htmlFor={value} onClick={() => handleUpdate(value)}>
        <input
          name={value}
          type="checkbox"
          readOnly={true}
          checked={selected[type].includes(value)}
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
