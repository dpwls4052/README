import axios from "axios";

export const getCategories = async ({ mainCategory = "국내도서" } = {}) => {
  const res = await axios.get("/api/categories", {
    params: { mainCategory },
  });

  return res.data;
};
