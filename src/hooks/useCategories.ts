import { useEffect, useState } from "react";
import api from "@/services/apiClient";

export const useCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/primarycategory", {
        headers: { pageNumber: "1" },
      })
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : res.data?.data || []))
      .catch(console.error);
  }, []);

  return categories;
};
