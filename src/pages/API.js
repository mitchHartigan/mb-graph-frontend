// TODO: Add better error handling.
const API_ENDPOINT = "http://localhost:4000";

export async function GET_LABELS() {
  const response = await fetch(`${API_ENDPOINT}/labels`);
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
