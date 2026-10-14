import { getApiBaseUrl } from "./config";

//for the register page
export const registerUser = async (payload) => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Registration failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to register user:", err);
    throw err;
  }
};

export const loginUser = async (payload) => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", // required if using cookies later
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login failed");
    }

    return await res.json(); // expects { token: '...' }
  } catch (err) {
    console.error("Failed to login user:", err);
    throw err;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const API_BASE_URL = await getApiBaseUrl();

    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include", // Send HTTP-only cookies with request
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user details");
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to fetch user info:", err);
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include", // Send cookies with request
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Logout failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Logout failed:", err);
    throw err;
  }
};

// ✅ Fetch all users
export const fetchUsers = async () => {
  const API_BASE_URL = await getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/api/auth/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// ✅ Add new user
export const addUser = async (user) => {
  const API_BASE_URL = await getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
};

// ✅ Update user role
export const updateUserRole = async (userId, role) => {
  const API_BASE_URL = await getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/api/auth/users/${userId}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Failed to update role");
  return res.json();
};

// ✅ Delete user
export const deleteUser = async (userId) => {
  const API_BASE_URL = await getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

export const changePassword = async (payload) => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to change password");
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to change password:", err);
    throw err;
  }
};

// Forgot Password: request OTP
export const requestPasswordReset = async (email) => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send reset link");
    return data;
  } catch (err) {
    console.error("Forgot password failed:", err);
    throw err;
  }
};

// Reset Password with OTP
export const resetPassword = async (payload) => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // { email, otp, newPassword, confirmPassword }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Password reset failed");
    return data;
  } catch (err) {
    console.error("Reset password failed:", err);
    throw err;
  }
};

// ✅ Get current configuration
export const fetchConfigData = async () => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/config`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching config data:", err);
    throw err;
  }
};

// ✅ Update configuration
export const updateConfigData = async (configData) => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/config/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(configData),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error updating config data:", err);
    throw err;
  }
};

export const fetchDashboardCards = async ({ refresh = false } = {}) => {
  try {
    const API_BASE_URL = await getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/api/cards${refresh ? "?refresh=1" : ""}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching dashboard cards:", err);
    throw err;
  }
};