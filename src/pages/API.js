const API_ENDPOINT = "http://localhost:4000";

export async function GET_AUTHORITIES() {
  const response = await fetch(`${API_ENDPOINT}/authorities`);
  const result = await response.json();
  return result;
}

export async function GET_PATHS_FROM(jurisdiction, agency) {
  const response = await fetch(`${API_ENDPOINT}/paths`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jurisdiction, agency }),
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
