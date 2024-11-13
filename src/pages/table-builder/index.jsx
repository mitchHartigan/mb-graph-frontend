import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_AUTHORITIES, GET_CANON_DATA, GET_PATHS_FROM } from "../API";
import { PathSelect } from "./PathSelect";
import { LoadWrapper } from "../LoadWrapper";
import { TableEditor } from "../table-editor/TableEditor";

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

  const defaultLoading = {
    paths: true,
    canonData: false,
  };

  const [authorities, setAuthorities] = useState(defaultAuthorities);
  const [paths, setPaths] = useState([]);
  const [pathItems, setPathItems] = useState([]);
  const [selected, setSelected] = useState(defaultSelected);
  const [loading, setLoading] = useState(defaultLoading);
  const [canonData, setCanonData] = useState([]);
  const [invalid, setInvalid] = useState(false);

  async function fetchPaths(jurisdiction, agency) {
    const result = await GET_PATHS_FROM(jurisdiction, agency);
    setPaths(result.paths);
    setPathItems(result.paths.map((path) => path.id));
  }

  async function loadChart() {
    setInvalid(false);
    setLoading({ ...loading, canonData: true });

    const getSelectedPaths = () => {
      paths.sort((a, b) => {
        return pathItems.indexOf(a.id) - pathItems.indexOf(b.id);
      });

      return paths.filter((path) => {
        return selected.paths.includes(path.id);
      });
    };

    const selectedPaths = getSelectedPaths();

    const response = await GET_CANON_DATA(selectedPaths, {});
    if (response.success) {
      setCanonData(response.canonData);
      setLoading({ ...loading, canonData: false });
      return;
    }
    setLoading({ ...loading, canonData: false });
  }

  async function handleJurisdictionUpdate(value) {
    setLoading({ ...loading, paths: true });
    setSelected({ ...selected, jurisdiction: value });
    setPaths([]);
    setPathItems([]);
    await fetchPaths(value, selected.agency);
    setLoading({ ...loading, paths: false });
  }

  async function handleAgencyUpdate(value) {
    setLoading({ ...loading, paths: true });
    setSelected({ ...selected, agency: value });
    setPaths([]);
    setPathItems([]);
    await fetchPaths(selected.jurisdiction, value);
    setLoading({ ...loading, paths: false });
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
      setLoading({ ...loading, paths: false });
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

      <Area $show={true}>
        <LoadWrapper loading={loading.paths}>
          <PathSelect
            paths={paths}
            pathItems={pathItems}
            setPathItems={setPathItems}
            selected={selected}
            handleUpdate={handleCheckedUpdate}
          />
        </LoadWrapper>
      </Area>
      <button onClick={() => loadChart()}>Build Chart</button>

      <TableArea $show={canonData.length > 0}>
        <LoadWrapper loading={loading.canonData}>
          <TableEditor canonData={canonData} />
          <Error $show={invalid}>
            Unable to build chart from requested paths.
          </Error>
        </LoadWrapper>
      </TableArea>
    </Container>
  );
}

const Container = styled.div``;

const Error = styled.p`
  display: ${({ $show }) => ($show ? "block" : "none")};
`;

const Area = styled.div`
  display: ${({ $show }) => ($show ? "flex" : "none")};
`;

const TableArea = styled(Area)`
  height: 100vh;
`;
