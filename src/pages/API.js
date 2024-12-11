// TODO: Add better error handling.
const API_ENDPOINT = "http://localhost:4000";

export async function GET_OPTIONS() {
  const response = await fetch(`${API_ENDPOINT}/options`);
  const result = await response.json();
  return result;
}

export async function GET_CRITERIA_LABELS() {
  const response = await fetch(`${API_ENDPOINT}/options/criteria/labels`);
  const result = await response.json();
  return result;
}

export async function GET_CONCLUSION_LABELS(criteriaLabels) {
  const response = await fetch(`${API_ENDPOINT}/options/conclusion/labels`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ criteriaLabels }),
  });
  const result = await response.json();
  console.log("result", result);
  return result;
}

export async function GET_CRITERIA_NAMES(criteriaLabels, conclusionLabels) {
  const response = await fetch(`${API_ENDPOINT}/options/criteria/names`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ criteriaLabels, conclusionLabels }),
  });
  const result = await response.json();
  return result;
}

export async function GET_CONCLUSION_NAMES(
  criteriaLabels,
  conclusionLabels,
  criteriaNames
) {
  const response = await fetch(`${API_ENDPOINT}/options/conclusion/names`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ criteriaLabels, conclusionLabels, criteriaNames }),
  });
  const result = await response.json();
  return result;
}

export async function GET_PATHS_FROM(labels) {
  const response = await fetch(`${API_ENDPOINT}/paths`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ labels }),
  });

  const result = await response.json();
  return result;
}

export async function GET_CANON_DATA(paths, options) {
  const response = await fetch(`${API_ENDPOINT}/canonData`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paths, options }),
  });

  const result = await response.json();
  return result;
}
