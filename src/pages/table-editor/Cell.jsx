import styled from "styled-components";

export function Cell(props) {
  const { name, height, coords } = props.data;
  console.log("rendering cell");

  return (
    <Container $coords={coords} $name={name}>
      <p>{name === "null" ? "" : name}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  outline: 1px solid gray;
  grid-row: ${({ $coords }) => `${$coords[0]}/${$coords[1]}`};
  background-color: ${({ $name }) =>
    $name === "null" ? "lightgray" : "lightblue"};
  font-size: medium;
  width: 100%;
  height: 100%;
`;
