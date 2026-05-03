import apiClient from "./apiClient";
import { API_ENDPOINTS } from "@/config/api";

export interface AuthUser {
  emailId?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const response = await apiClient.post(
    API_ENDPOINTS.login,
    {},
    {
      headers: {
        emailId: email,
        password,
      },
    },
  );

  const user: AuthUser = response.data;
  localStorage.setItem("emailId", email);
  localStorage.setItem("password", password);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const signup = async (payload: {
  fullname: string;
  emailid: string;
  mobilenumber: string;
  password: string;
  userroleid?: number;
}) => {
  const response = await apiClient.post("/signup", payload, {
    skipAuth: true,
    headers: {
      emailId: payload.emailid,
      password: payload.password,
    },
  } as any);
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
