import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_CANON_DATA, GET_PATHS_FROM, GET_LABELS } from "../API";
import { PathSelect } from "./PathSelect";
import { LoadWrapper } from "../LoadWrapper";
import { TableEditor } from "../table-editor/TableEditor";
import { LabelSelect } from "./LabelSelect";

export function TableBuilder() {
  const defaultSelected = {
    labels: [],
    paths: [],
  };

  const defaultLoading = {
    labels: true,
    paths: false,
    canonData: false,
  };

  const [labels, setLabels] = useState([]);
  const [paths, setPaths] = useState([]);
  const [pathItems, setPathItems] = useState([]); // should change to more intuitive name
  const [canonData, setCanonData] = useState([]);

  const [selected, setSelected] = useState(defaultSelected);
  const [loading, setLoading] = useState(defaultLoading);

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

  async function loadPaths() {
    setLoading({ ...loading, paths: true });
    const { paths } = await GET_PATHS_FROM(selected.labels);
    console.log("paths", paths);
    setPaths(paths);
    setPathItems(paths.map((path) => path.id));
    setLoading({ ...loading, paths: false });
  }

  function onPathSelect(pathId) {
    const spaths = [...selected.paths];

    if (spaths.includes(pathId)) {
      spaths.splice(spaths.indexOf(pathId), 1);
      setSelected({ ...selected, paths: spaths });
      return;
    }

    spaths.push(pathId);
    setSelected({ ...selected, paths: spaths });
  }

  function onLabelSelect(label) {
    const selectedLabels = [...selected.labels];

    if (selectedLabels.includes(label)) {
      selectedLabels.splice(selectedLabels.indexOf(label), 1);
      setSelected({ ...selected, labels: selectedLabels });
      return;
    }

    selectedLabels.push(label);
    setSelected({ ...selected, labels: selectedLabels });
  }

  useEffect(() => {
    async function loadData() {
      const { labels } = await GET_LABELS();
      console.log("labels", labels);
      setLabels(labels);
      setLoading({ ...loading, labels: false });
    }

    loadData();
  }, []);

  return (
    <Container>
      <Area $show={true}>
        <LoadWrapper loading={loading.labels}>
          <LabelSelect
            labels={labels}
            setLabels={setLabels}
            selected={selected}
            handleUpdate={onLabelSelect}
          />
        </LoadWrapper>
      </Area>

      <Area $show={true}>
        <button onClick={() => loadPaths()}>Get Paths</button>
      </Area>

      <Area $show={true}>
        <LoadWrapper loading={loading.paths}>
          <PathSelect
            paths={paths}
            pathItems={pathItems}
            setPathItems={setPathItems}
            selected={selected}
            handleUpdate={onPathSelect}
          />
        </LoadWrapper>
      </Area>

      <Area $show={true}>
        <button onClick={() => loadChart()}>Build Chart</button>
      </Area>

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
