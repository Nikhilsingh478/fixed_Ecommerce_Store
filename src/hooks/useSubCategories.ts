import { useEffect, useState } from "react";
import api from "@/services/apiClient";

export const useSubCategories = (primaryCategoryId: number | string) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!primaryCategoryId) return;

    api
      .get("/subcategory", {
        headers: {
          primaryCategoryId: primaryCategoryId.toString(),
          pageNumber: "1",
        },
      })
      .then((res) => setData(Array.isArray(res.data) ? res.data : res.data?.data || []))
      .catch(console.error);
  }, [primaryCategoryId]);

  return data;
};
