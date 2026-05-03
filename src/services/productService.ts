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

export const getAllProducts = async (pageNumber = 0) => {
  checkAuth();
  const res = await apiClient.get(API_ENDPOINTS.allProducts, {
    headers: { pageNumber: String(pageNumber) },
  });
  return res.data;
};

export const getProductsBySubCategory = async (subCategoryId: string | number, pageNumber = 0) => {
  checkAuth();
  const res = await apiClient.get(API_ENDPOINTS.product, {
    headers: {
      subCategoryId: String(subCategoryId),
      pageNumber: String(pageNumber),
    },
  });
  return res.data;
};

export const searchProducts = async (keyword: string, pageNumber = 0) => {
  checkAuth();
  const res = await apiClient.get(API_ENDPOINTS.search, {
    headers: {
      keyword,
      pageNumber: String(pageNumber),
    },
  });
  return res.data;
};

export const getAllPrimaryCategories = async () => {
  checkAuth();
  const res = await apiClient.get(API_ENDPOINTS.allPrimaryCategories);
  return res.data;
};

export const getPrimaryCategory = async (id: string | number) => {
  checkAuth();
  const res = await apiClient.get(API_ENDPOINTS.primaryCategories, {
    headers: { primaryCategoryId: String(id) },
  });
  return res.data;
};

export const getSubCategories = async (primaryCategoryId: string | number) => {
  checkAuth();
  const res = await apiClient.get(API_ENDPOINTS.subCategories, {
    headers: { primaryCategoryId: String(primaryCategoryId) },
  });
  return res.data;
};
