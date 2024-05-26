import axios from "axios";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL_AUTH;

export const createSession = async (idToken) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/create-session-cookie`,
      { idToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return true;
    } else {
      console.error("Failed to create session:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error creating session:", error);
    toast.error("Network Error has occurred ! Please Try Again");
    return false;
  }
};

export const sessionLogout = async () => {
  const token = "_logout_token_";
  try {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    toast.warning("Something went wrong !");
  }
};

export const checkCookieSession = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/check-session`, {
      withCredentials: true,
    });
    if (response && response.data) {
      return response.data;
    } else {
      console.error("No data found in response");
      return null;
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Error checking session:", error.response.data);
    } else {
      console.error("Error checking session:", error.message);
    }
    return null;
  }
};
