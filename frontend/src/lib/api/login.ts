import { apiEndpoint } from "./api-endpoints";
import type { User } from "lib/useAuth";

type LoginCredentials = {
  user: {
    email: string;
    password: string;
  };
};

type LoginResponse = {
  status?: {
    code?: number;
    message?: string;
  };
  data?: User;
  message?: string;
};

export async function login(req: LoginCredentials) {
  try {
    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(req),
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.signIn}`, requestOptions);
    const responseData: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.message || responseData?.status?.message || "Login failed");
    }

    return responseData.data;
  } catch (error: any) {
    console.log("Error inside catch: ", error);
    throw new Error(error.message);
  }
}

export async function currentUser() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.currentUser}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 401) {
      return null;
    }

    const responseData: { data?: User; message?: string } = await response.json();
    if (!response.ok) {
      throw new Error(responseData?.message || "Failed to fetch current user");
    }

    return responseData.data || null;
  } catch (error) {
    console.log("Error fetching current user: ", error);
    return null;
  }
}

export async function logout() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/sign_out`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error: any) {
    console.log("Error during logout: ", error);
  }
  return null;
}
