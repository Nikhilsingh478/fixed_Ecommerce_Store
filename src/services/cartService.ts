import apiClient from "./apiClient";
import { API_ENDPOINTS } from "@/config/api";

const checkAuth = () => {
  if (!localStorage.getItem("emailId")) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }
};

export const getCart = async () => {
  checkAuth();
  const res = await apiClient.get(API_ENDPOINTS.viewCart);
  return res.data;
};

export const addToCart = async (subProductId: string | number, quantity = 1) => {
  checkAuth();
  const res = await apiClient.post(API_ENDPOINTS.addToCart, {
    subProductId: Number(subProductId),
    quantity,
  });
  return res.data;
};

export const removeFromCart = async (subProductId: string | number) => {
  checkAuth();
  const res = await apiClient.delete(API_ENDPOINTS.removeFromCart, {
    headers: { subProductId: String(subProductId) },
  });
  return res.data;
};
