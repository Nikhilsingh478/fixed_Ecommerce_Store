import apiClient from "./apiClient";
import { API_ENDPOINTS } from "@/config/api";

export interface AuthUser {
  emailId?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const response = await apiClient.post(API_ENDPOINTS.login, null, {
    headers: {
      emailId: email,
      password,
    },
  });

  const user: AuthUser = response.data;
  localStorage.setItem("emailId", email);
  localStorage.setItem("password", password);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const signup = async (payload: {
  fullName: string;
  emailId: string;
  mobilenumber: string;
  password: string;
  shopName?: string;
}) => {
  console.log("Signup Payload:", payload);
  const response = await apiClient.post(API_ENDPOINTS.applicationUser, payload, { skipAuth: true } as any);
  console.log("Signup Response:", response);
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("emailId");
  localStorage.removeItem("password");
  localStorage.removeItem("user");
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

export const getUser = (): AuthUser | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};
