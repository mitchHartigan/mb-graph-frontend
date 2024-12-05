import { useEffect, useState } from "react";
import styled from "styled-components";
import { GET_CANON_DATA, GET_PATHS_FROM, GET_CRITERIA_LABELS } from "../API";
import { PathSelect } from "./PathSelect";
import { LoadWrapper } from "../LoadWrapper";
import { TableEditor } from "../table-editor/TableEditor";
import { CriteriaLabelSelect } from "./CriteriaLabelSelect";

export function TableBuilder() {
  const defaultOptions = {
    criteriaLabels: [],
    criteriaNames: [],
    conclusionLabels: [],
    conclusionNames: [],
    paths: [],
  };

  const defaultSelected = {
    criteriaLabels: [],
    criteriaNames: [],
    conclusionLabels: [],
    conclusionNames: [],
    pathItems: [], // should be pathItems? Or like at least this is where we should put the path items.
  };

  const defaultLoading = {
    options: {
      criteriaLabels: true,
      criteriaNames: false,
      conclusionLabels: false,
      conclusionNames: false,
      paths: false,
    },
    canonData: false,
  };

  const [options, setOptions] = useState(defaultOptions);
  const [selected, setSelected] = useState(defaultSelected);

  // const [paths, setPaths] = useState([]);
  // used for the drag and drop re-order. Path items are the ids of each path in an array, which
  // is what our dnd library uses to keep track of where each path is in the list.
  const [canonData, setCanonData] = useState([]);

  // UI State variables
  const [loading, setLoading] = useState(defaultLoading);
  const [invalid, setInvalid] = useState(false);

  // Need to re-write to take all labels and paths.
  // async function loadPaths() {
  //   setLoading({ ...loading, paths: true });
  //   const { paths } = await GET_PATHS_FROM(selected.labels);
  //   setPaths(paths);
  //   setPathItems(paths.map((path) => path.id));
  //   setLoading({ ...loading, paths: false });
  // }

  // Deprecating as selecting individual paths won't be needed anymore. Users will
  // select labels and names instead.
  // function onPathSelect(pathId) {
  //   const spaths = [...selected.paths];

  //   if (spaths.includes(pathId)) {
  //     spaths.splice(spaths.indexOf(pathId), 1);
  //     setSelected({ ...selected, paths: spaths });
  //     return;
  //   }

  //   spaths.push(pathId);
  //   setSelected({ ...selected, paths: spaths });
  // }

  // re-write to be onCriteriaLabelSelect, onConclusionLabelSelect, etc...
  function onCriteriaLabelSelect(label) {
    const selectedLabels = [...selected.criteriaLabels];

    if (selectedLabels.includes(label)) {
      selectedLabels.splice(selectedLabels.indexOf(label), 1);
      setSelected({ ...selected, criteriaLabels: selectedLabels });
      return;
    }

    selectedLabels.push(label);
    setSelected({ ...selected, criteriaLabels: selectedLabels });
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

  useEffect(() => {
    async function loadDefault() {
      const { criteriaLabels } = await GET_CRITERIA_LABELS();
      setOptions({ ...options, criteriaLabels });
      setLoading({ ...loading, criteriaLabels: false });
    }

    loadDefault();
  }, []);

  return (
    <Container>
      {/* <Area $show={true}>
        <LoadWrapper loading={loading.labels}>
          <LabelSelect
            options={options}
            setLabels={setLabels}
            selected={selected}
            handleUpdate={onLabelSelect}
          />
        </LoadWrapper>
      </Area> */}

      <Area $show={true}>
        <LoadWrapper loading={loading.criteriaLabels}>
          <CriteriaLabelSelect
            labels={options.criteriaLabels}
            selected={selected}
            handleUpdate={onCriteriaLabelSelect}
          />
        </LoadWrapper>
      </Area>
      {/* <Area $show={true}>
        <LoadWrapper loading={loading.paths}>
          <PathSelect
            paths={paths}
            pathItems={pathItems}
            setPathItems={setPathItems}
            selected={selected}
            handleUpdate={onPathSelect}
          />
        </LoadWrapper>
      </Area> */}

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
