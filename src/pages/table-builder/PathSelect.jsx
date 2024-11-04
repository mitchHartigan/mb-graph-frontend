import styled from "styled-components";
import { getPathStr } from "../../utils";

export function PathSelect(props) {
  const { paths, selected, handleUpdate } = props;

  console.log("test", { paths, selected });

  if (paths.length === 0)
    return (
      <Container>
        <p>No paths found.</p>
      </Container>
    );

  return (
    <Container>
      {paths.map((path) => {
        const pathStr = getPathStr(path);
        return (
          <Label
            key={pathStr}
            htmlFor={path.id}
            onClick={() => handleUpdate(path.id)}
          >
            <input
              id={path.id}
              name={path.id}
              type="checkbox"
              readOnly={true}
              checked={selected.paths.includes(path.id)}
              value={pathStr}
            />
            {pathStr}
          </Label>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  cursor: pointer;
`;
