export function getPathStr(path) {
  let pathStr = "";
  const { segments } = path._fields[0];

  let segmentNames = [];

  for (let i = 0; i < segments.length; i++) {
    const { start, end } = segments[i];

    if (i == 0) {
      segmentNames.push(start.properties.name);
      segmentNames.push(end.properties.name);
      continue;
    }

    segmentNames.push(end.properties.name);
  }

  let segmentStr = "";

  for (let segmentName of segmentNames) {
    if (segmentName === segmentNames.at(-1)) {
      segmentStr = segmentStr + segmentName;
    } else {
      segmentStr = segmentStr + segmentName + " -> ";
    }
  }

  pathStr += segmentStr;
  return pathStr;
}
