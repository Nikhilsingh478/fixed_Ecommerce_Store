const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/ecommerce";

export const getProductImage = (id: string | number | null | undefined): string => {
  if (!id) return "";
  return `${API_BASE}/productimage?productImageId=${id}`;
};
