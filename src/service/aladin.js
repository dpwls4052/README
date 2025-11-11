import axios from "axios";

export async function fetchAladinBooks(query, page) {
  const res = await axios.get("/api/aladin", {
    params: { query, page },
  });
  return res.data;
}
