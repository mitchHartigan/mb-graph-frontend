import styled from "styled-components";
import { CriteriaLabelItem } from "./CriteriaLabelItem";

export function CriteriaLabelSelect(props) {
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
          <CriteriaLabelItem
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
