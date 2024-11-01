import react, { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_AUTHORITIES } from "./API";

const paths = [];
const newPaths = [
  "Federal -contains-> CFPB -contains-> California <-concludes- License Not Required ",
];

export function TableSelect() {
  const defaultState = {
    jurisdiction: "",
    agency: "",
    paths: [],
  };
  const [selected, setSelected] = useState(defaultState);
  const [authorities, setAuthorities] = useState({
    jurisdictions: [],
    agencies: [],
  });

  useEffect(() => {
    async function loadData() {
      const authorities = await GET_AUTHORITIES();
      setAuthorities(authorities);
      setSelected({
        ...selected,
        jurisdiction: jurisdictions[0],
        agency: agencies[0],
      });
    }

    loadData();
  }, []);

  return (
    <Container>
      <Area show={true}>
        <label htmlFor="jurisdictions">Choose a Jurisdiction</label>
        <select
          name="jurisdictions"
          value={selected.jurisdiction}
          onChange={(evt) =>
            setSelected({ ...selected, jurisdiction: evt.target.value })
          }
        >
          {authorities.jurisdictions.map((jurisdiction) => {
            return (
              <option value={jurisdiction} key={jurisdiction}>
                {jurisdiction}
              </option>
            );
          })}
        </select>

        <label htmlFor="agencies">Choose an Agency</label>
        <select
          name="jurisdictions"
          value={selected.agency}
          onChange={(evt) =>
            setSelected({ ...selected, agency: evt.target.value })
          }
        >
          {authorities.agencies.map((agency) => {
            return (
              <option value={agency} key={agency}>
                {agency}
              </option>
            );
          })}
        </select>
        <button onClick={() => setSelected({ ...selected, paths: newPaths })}>
          Continue
        </button>
      </Area>
    </Container>
  );
}

const Container = styled.div``;

const Area = styled.div`
  display: ${({ show }) => (show ? "flex" : "none")};
`;
