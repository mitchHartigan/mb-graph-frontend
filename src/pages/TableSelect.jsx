import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_AUTHORITIES, GET_PATHS_FROM } from "./API";
import { getPathStr } from "../utils";

export function TableSelect() {
  const defaultSelected = {
    jurisdiction: "Select a jurisdiction",
    agency: "Select an agency",
    paths: [],
  };

  const defaultAuthorities = {
    jurisdictions: [],
    agencies: [],
  };

  const [selected, setSelected] = useState(defaultSelected);
  const [authorities, setAuthorities] = useState(defaultAuthorities);
  const [paths, setPaths] = useState([]);
  const [stage, setStage] = useState(1);

  async function fetchPaths(jurisdiction, agency) {
    const { paths } = await GET_PATHS_FROM(jurisdiction, agency);
    setPaths(paths);
  }

  function handleSelectUpdate(type, value) {
    setSelected({ ...selected, [type]: value });
    setPaths([]);
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
    }

    loadData();
  }, []);

  return (
    <Container>
      <Area $show={true}>
        <label htmlFor="jurisdictions">Choose a Jurisdiction</label>
        <select
          name="jurisdictions"
          value={selected.jurisdiction}
          onChange={(evt) =>
            handleSelectUpdate("jurisdiction", evt.target.value)
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
          onChange={(evt) => handleSelectUpdate("agency", evt.target.value)}
        >
          {authorities.agencies.map((agency) => {
            return (
              <option value={agency} key={agency}>
                {agency}
              </option>
            );
          })}
        </select>
        <button
          onClick={() => fetchPaths(selected.jurisdiction, selected.agency)}
        >
          Continue
        </button>
      </Area>

      <Area $show={paths.length > 0}>
        <SelectContainer>
          {paths.map((path) => {
            const pathStr = getPathStr(path);
            return (
              <Label
                key={pathStr}
                htmlFor={path.id}
                onClick={() => handleCheckedUpdate(path.id)}
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
        </SelectContainer>
        <button onClick={() => console.log("spaths", selected.paths)}>
          Log
        </button>
      </Area>
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

const Area = styled.div`
  display: ${({ $show }) => ($show ? "flex" : "none")};
`;
