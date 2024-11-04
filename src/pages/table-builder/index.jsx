import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_AUTHORITIES, GET_PATHS_FROM } from "../API";
import { PathSelect } from "./PathSelect";
import { LoadWrapper } from "../LoadWrapper";

export function TableBuilder() {
  const defaultSelected = {
    jurisdiction: "Select a jurisdiction",
    agency: "Select an agency",
    paths: [],
  };

  const defaultAuthorities = {
    jurisdictions: [],
    agencies: [],
  };

  const [authorities, setAuthorities] = useState(defaultAuthorities);
  const [paths, setPaths] = useState([]);
  const [selected, setSelected] = useState(defaultSelected);
  const [loading, setLoading] = useState(true);

  async function fetchPaths(jurisdiction, agency) {
    const result = await GET_PATHS_FROM(jurisdiction, agency);
    setPaths(result.paths);
  }

  async function handleJurisdictionUpdate(value) {
    setLoading(true);
    setSelected({ ...selected, jurisdiction: value });
    setPaths([]);
    await fetchPaths(value, selected.agency);
    setLoading(false);
  }

  async function handleAgencyUpdate(value) {
    setLoading(true);
    setSelected({ ...selected, agency: value });
    setPaths([]);
    await fetchPaths(selected.jurisdiction, value);
    setLoading(false);
  }

  function handleCheckedUpdate(pathId) {
    const spaths = [...selected.paths];

    if (spaths.includes(pathId)) {
      spaths.splice(spaths.indexOf(pathId), 1);
      setSelected({ ...selected, paths: spaths });
      return;
    }

    spaths.push(pathId);
    setSelected({ ...selected, paths: spaths });
  }

  useEffect(() => {
    async function loadData() {
      const authorities = await GET_AUTHORITIES();
      setAuthorities(authorities);
      const { jurisdictions, agencies } = authorities;
      setSelected({
        ...selected,
        jurisdiction: jurisdictions[0],
        agency: agencies[0],
      });
      await fetchPaths(jurisdictions[0], agencies[0]);
      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <Container>
      <Area>
        <label htmlFor="jurisdictions">Choose a Jurisdiction</label>
        <select
          name="jurisdictions"
          value={selected.jurisdiction}
          onChange={(evt) => handleJurisdictionUpdate(evt.target.value)}
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
          onChange={(evt) => handleAgencyUpdate(evt.target.value)}
        >
          {authorities.agencies.map((agency) => {
            return (
              <option value={agency} key={agency}>
                {agency}
              </option>
            );
          })}
        </select>
      </Area>

      <Area>
        <LoadWrapper loading={loading}>
          <SelectContainer>
            <PathSelect
              paths={paths}
              selected={selected}
              handleUpdate={handleCheckedUpdate}
            />
          </SelectContainer>
          <button onClick={() => console.log("spaths", selected.paths)}>
            Log
          </button>
        </LoadWrapper>
      </Area>
      <button onClick={() => console.log({ authorities, paths, selected })}>
        Build Chart
      </button>
    </Container>
  );
}

const Container = styled.div``;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled.div`
  cursor: pointer;
`;

const Area = styled.div``;
