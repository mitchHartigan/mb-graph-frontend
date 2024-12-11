import styled from "styled-components";
import { Item } from "./Item";

export function LabelSelect(props) {
  const { labels, selected, handleUpdate } = props;

  if (labels.length === 0 || !labels)
    return (
      <Container>
        <p>No types found.</p>
      </Container>
    );

  return (
    <Container>
      {labels.map((label) => {
        return (
          <Item
            handleUpdate={handleUpdate}
            selected={selected}
            labels={labels}
            value={label}
            key={label}
          />
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
