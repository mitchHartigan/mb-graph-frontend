import styled from "styled-components";

export function AuthoritySelect(props) {
  const { authorities, selected } = props;
  return (
    <Container>
      <label htmlFor="jurisdictions">Choose a Jurisdiction</label>
      <select
        name="jurisdictions"
        value={selected.jurisdiction}
        onChange={(evt) => handleSelectUpdate("jurisdiction", evt.target.value)}
      >
        {authorities.jurisdictions.map((jurisdiction) => {
          return (
            <option value={jurisdiction} key={jurisdiction}>
              {jurisdiction}
            </option>
          );
        })}
      </select>
    </Container>
  );
}

const Container = styled.div``;
