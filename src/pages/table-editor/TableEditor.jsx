import styled from "styled-components";
import { Cell } from "./Cell";

const sampleCanonData = [
  [
    { name: "State", children: "", height: 3, coords: [1, 4] },
    { name: "State", children: "", height: 3, coords: [4, 7] },
  ],
  [
    { name: "Statute1", children: "", height: 1, coords: [1, 2] },
    { name: "Statute2", children: "", height: 2, coords: [2, 4] },
    { name: "Statute1", children: "", height: 1, coords: [4, 5] },
    { name: "Statute2", children: "", height: 2, coords: [5, 7] },
  ],
  [
    { name: "Activity22", height: 1, children: "", coords: [1, 2] },
    { name: "Activity1", height: 1, children: "", coords: [2, 3] },
    { name: "Another activity", children: "", height: 1, coords: [3, 4] },
    { name: "Activity22", height: 1, children: "", coords: [4, 5] },
    { name: "Activity1", height: 1, children: "", coords: [5, 6] },
    { name: "Another activity", children: "", height: 1, coords: [6, 7] },
  ],
  [
    { name: "null", height: 1, children: "", coords: [1, 2] },
    { name: "null", height: 1, children: "", coords: [2, 3] },
    { name: "Dont do this one", height: 1, children: "", coords: [3, 4] },
    { name: "null", height: 1, children: "", coords: [4, 5] },
    { name: "null", height: 1, children: "", coords: [5, 6] },
    { name: "Dont do this one", height: 1, children: "", coords: [6, 7] },
  ],
];

export function TableEditor() {
  function mapCanonData(canonData) {
    console.log("mapping canon data", canonData);

    const cells = canonData.map((column) => {
      console.log("column", column);
      return column.map((object) => {
        console.log("object", object);
        return <Cell data={object} />;
      });
    });

    console.log("cells", cells);
    return cells;
  }

  console.log("hmm", mapCanonData(sampleCanonData));

  return (
    <Container $canonData={sampleCanonData}>
      {mapCanonData(sampleCanonData)}
    </Container>
  );
}

function genColums(length) {
  let cols = "";

  for (let i = 0; i < length; i++) {
    cols = cols + "1fr ";
  }
  return cols;
}

const Container = styled.div`
  display: grid;
  height: 50vh;
  width: 80vw;
  grid-template-columns: ${({ $canonData }) => genColums($canonData.length)};
  grid-template-rows: ${({ $canonData }) => genColums($canonData.length)};
`;
