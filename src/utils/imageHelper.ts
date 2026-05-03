const API_BASE = (import.meta.env.VITE_API_URL as string) || "http://localhost:8080/ecommerce";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=200&h=200&fit=crop&auto=format&q=80";

export const getProductImage = (id: string | number | null | undefined): string => {
  if (!id) return FALLBACK_IMAGE;
  return `${API_BASE}/productimage?productImageId=${id}`;
};

export { FALLBACK_IMAGE };
