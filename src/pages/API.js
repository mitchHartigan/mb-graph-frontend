const API_ENDPOINT = "http://localhost:4000";

export async function GET_AUTHORITIES() {
  const response = await fetch(`${API_ENDPOINT}/authorities`);
  const result = await response.json();
  return result;
}
