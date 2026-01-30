import axios from "axios";

export const getCategories = async ({ rootCategory = "국내도서" } = {}) => {
  const res = await axios.get("/api/categories", {
    params: { rootCategory },
  });

  return res.data;
};
