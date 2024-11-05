import styled from "styled-components";

export function Cell(props) {
  const { properties, coords } = props.data;
  console.log("data", props.data);

  return (
    <Container $coords={coords} $name={properties.name}>
      <p>{properties.name === "null" ? "" : properties.name}</p>
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
