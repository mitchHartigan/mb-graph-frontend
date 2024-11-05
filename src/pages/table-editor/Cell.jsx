import styled from "styled-components";

export function Cell(props) {
  const { properties, coords, labels } = props.data;
  console.log("data", props.data);

  return (
    <Container $coords={coords} $name={properties.name} $labels={labels}>
      <p>{properties.name === "null" ? "" : properties.name}</p>
    </Container>
  );
}

function genBackground(name, labels) {
  if (name === "null") return "lightgray";
  if (labels.includes("Conclusion")) return "lightgreen";
  return "lightblue";
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  outline: 1px solid gray;
  grid-row: ${({ $coords }) => `${$coords[0]}/${$coords[1]}`};
  background-color: ${({ $name, $labels }) => genBackground($name, $labels)};
  font-size: medium;
  width: 100%;
  height: 100%;
`;
