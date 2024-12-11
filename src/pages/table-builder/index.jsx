import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  GET_CANON_DATA,
  GET_PATHS,
  GET_CRITERIA_LABELS,
  GET_CONCLUSION_LABELS,
  GET_CRITERIA_NAMES,
  GET_CONCLUSION_NAMES,
} from "../API";
import { PathSelect } from "./PathSelect";
import { LoadWrapper } from "../LoadWrapper";
import { TableEditor } from "../table-editor/TableEditor";
import { LabelSelect } from "./label-select/LabelSelect";

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
    paths: [],
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

  // updates selected criteria labels.
  // clears all options and selected other than criteria by resetting them to default
  // calls GET_CONCLUSION_LABELS, updates conclusion label options with results.
  function onCriteriaLabelSelect(label) {
    const { criteriaLabels } = selected;

    async function updateCriteriaLabels(criteriaLabels) {
      setSelected({ ...defaultSelected, criteriaLabels });
      setLoading({ ...loading, conclusionLabels: true });
      const { conclusionLabels } = await GET_CONCLUSION_LABELS(criteriaLabels);
      setOptions({
        ...defaultOptions,
        criteriaLabels: options.criteriaLabels,
        conclusionLabels,
      });
      setLoading({ ...loading, conclusionLabels: false });
    }

    if (criteriaLabels.includes(label)) {
      criteriaLabels.splice(criteriaLabels.indexOf(label), 1);
      updateCriteriaLabels(criteriaLabels);
      return;
    }

    criteriaLabels.push(label);
    updateCriteriaLabels(criteriaLabels);
  }

  function onConclusionLabelSelect(label) {
    const { criteriaLabels, conclusionLabels } = selected;

    async function updateConclusionLabels(conclusionLabels) {
      setSelected({ ...defaultSelected, criteriaLabels, conclusionLabels });
      setLoading({ ...loading, criteriaNames: true });
      const { criteriaNames } = await GET_CRITERIA_NAMES(
        criteriaLabels,
        conclusionLabels
      );
      setOptions({
        ...defaultOptions,
        criteriaLabels: options.criteriaLabels,
        conclusionLabels: options.conclusionLabels,
        criteriaNames,
      });
      setLoading({ ...loading, criteriaNames: false });
    }

    if (conclusionLabels.includes(label)) {
      conclusionLabels.splice(conclusionLabels.indexOf(label), 1);
      updateConclusionLabels(conclusionLabels);
      return;
    }

    conclusionLabels.push(label);
    updateConclusionLabels(conclusionLabels);
  }

  function onCriteriaNameSelect(name) {
    const { criteriaLabels, conclusionLabels, criteriaNames } = selected;

    async function updateCriteriaNames(criteriaNames) {
      setSelected({
        ...defaultSelected,
        criteriaLabels,
        conclusionLabels,
        criteriaNames,
      });
      setLoading({ ...loading, conclusionNames: true });
      const { conclusionNames } = await GET_CONCLUSION_NAMES(
        criteriaLabels,
        conclusionLabels,
        criteriaNames
      );
      setOptions({
        ...defaultOptions,
        criteriaLabels: options.criteriaLabels,
        conclusionLabels: options.conclusionLabels,
        criteriaNames: options.criteriaNames,
        conclusionNames,
      });
      setLoading({ ...loading, conclusionNames: false });
    }

    if (criteriaNames.includes(name)) {
      criteriaNames.splice(criteriaNames.indexOf(name), 1);
      updateCriteriaNames(criteriaNames);
      return;
    }

    criteriaNames.push(name);
    updateCriteriaNames(criteriaNames);
  }

  function onConclusionNameSelect(name) {
    const { criteriaLabels, conclusionLabels, criteriaNames, conclusionNames } =
      selected;

    async function updateConclusionNames(conclusionNames) {
      setSelected({
        ...defaultSelected,
        criteriaLabels,
        conclusionLabels,
        criteriaNames,
        conclusionNames,
      });
    }

    if (conclusionNames.includes(name)) {
      conclusionNames.splice(conclusionNames.indexOf(name), 1);
      updateConclusionNames(conclusionNames);
      return;
    }

    conclusionNames.push(name);
    updateConclusionNames(conclusionNames);
  }

  async function getPaths() {
    const { criteriaLabels, conclusionLabels, criteriaNames, conclusionNames } =
      selected;

    setLoading({ ...loading, paths: true });
    const { paths } = await GET_PATHS(
      criteriaLabels,
      conclusionLabels,
      criteriaNames,
      conclusionNames
    );

    setOptions({ ...options, paths });
    setSelected({ ...selected, pathItems: paths.map((path) => path.id) });
    setLoading({ ...loading, paths: false });
  }

  function setPathItems(pathItems) {
    setSelected({ ...selected, pathItems });
  }

  async function loadChart() {
    setInvalid(false);
    setLoading({ ...loading, canonData: true });
    const { paths, pathItems } = selected;

    const getSelectedPaths = () => {
      return paths.sort((a, b) => {
        return pathItems.indexOf(a.id) - pathItems.indexOf(b.id);
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

  function onPathSelect(id) {
    const { paths } = selected;

    if (paths.some((path) => path.id === id)) {
      let targetIndex = paths.findIndex((path) => path.id === id);
      paths.splice(targetIndex, 1);
      setSelected({ ...selected, paths });
      return;
    }

    paths.push(options.paths.find((path) => path.id === id));
    setSelected({ ...selected, paths });
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
      <AreaTitle>Criteria Type Select</AreaTitle>
      <Area $show={true}>
        <LoadWrapper loading={loading.criteriaLabels}>
          <LabelSelect
            type="criteriaLabels"
            labels={options.criteriaLabels}
            selected={selected}
            handleUpdate={onCriteriaLabelSelect}
          />
        </LoadWrapper>
      </Area>

      <AreaTitle>Conclusion Type Select</AreaTitle>
      <Area $show={options.conclusionLabels.length > 0}>
        <LoadWrapper loading={loading.conclusionLabels}>
          <LabelSelect
            type="conclusionLabels"
            labels={options.conclusionLabels}
            selected={selected}
            handleUpdate={onConclusionLabelSelect}
          />
        </LoadWrapper>
      </Area>

      <AreaTitle>Criteria Name Select</AreaTitle>
      <Area $show={options.criteriaNames.length > 0}>
        <LoadWrapper loading={loading.criteriaNames}>
          <LabelSelect
            type="criteriaNames"
            labels={options.criteriaNames}
            selected={selected}
            handleUpdate={onCriteriaNameSelect}
          />
        </LoadWrapper>
      </Area>

      <AreaTitle>Conclusion Name Select</AreaTitle>
      <Area $show={options.conclusionNames.length > 0}>
        <LoadWrapper loading={loading.conclusionNames}>
          <LabelSelect
            type="conclusionNames"
            labels={options.conclusionNames}
            selected={selected}
            handleUpdate={onConclusionNameSelect}
          />
        </LoadWrapper>
      </Area>

      <button onClick={getPaths}>Get Paths</button>

      <Area $show={true}>
        <LoadWrapper loading={loading.paths}>
          <PathSelect
            paths={options.paths}
            pathItems={selected.pathItems}
            selected={selected}
            setPathItems={setPathItems}
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

const AreaTitle = styled.p`
  font-weight: bold;
`;

const TableArea = styled(Area)`
  height: 100vh;
`;
