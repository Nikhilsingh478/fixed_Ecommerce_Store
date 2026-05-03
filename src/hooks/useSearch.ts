import { useEffect, useState } from "react";
import api from "@/services/apiClient";
import { mapProduct, Product } from "@/hooks/useProducts";

export const useSearch = (keyword: string) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword || keyword.trim().length < 1) {
      setResults([]);
      return;
    }

    setLoading(true);
    api
      .get("/search", {
        headers: {
          keyword: keyword.trim(),
          pageNumber: "1",
        },
      })
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : res.data?.products || res.data?.data || [];
        setResults(raw.map((item: any) => mapProduct(item)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword]);

  return { results, loading };
};
