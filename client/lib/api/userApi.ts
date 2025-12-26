const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNo: string;
  password: string;
  role: string;
}

export interface UserRole {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNo: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Create a new user
export const createUser = async (
  authToken: string | null,
  userData: CreateUserData,
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=random&size=128`,
        ...userData,
      }),
    });

    const result = (await response.json()) as ApiResponse<User>;

    if (!response.ok) {
      throw new Error(result.message ?? "Failed to create user");
    }

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create user",
    );
  }
};

// Get all user roles
export const getUserRoles = async (
  authToken: string | null,
): Promise<UserRole[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-role`, {
      headers: {
        method: "GET",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user roles");
    }

    const roles = await response.json();
    return roles;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user roles",
    );
  }
};

// Get all users
export const getUsers = async (authToken: string | null): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: {
        method: "GET",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API: Error response:", errorText);
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();
    console.log("API: Raw response:", result);

    // Backend returns users directly as an array, not wrapped in data property
    const users = Array.isArray(result) ? result : [];
    console.log("API: Processed users:", users);
    return users;
  } catch (error) {
    console.error("API: Error in getUsers:", error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to connect to the server. Please check if the backend is running on port 8080.",
      );
    }

    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError) {
      throw new Error("Server response error: Invalid response from server.");
    }

    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch users",
    );
  }
};

// Get user by ID
export const getUserById = async (
  authToken: string | null,
  id: string,
): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      headers: {
        method: "GET",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user",
    );
  }
};

// Update user
export const updateUser = async (
  authToken: string | null,
  id: string,
  userData: Partial<CreateUserData>,
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(userData),
    });

    const result = (await response.json()) as ApiResponse<User>;

    if (!response.ok) {
      throw new Error(result.message ?? "Failed to update user");
    }

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to update user",
    );
  }
};

// Update user profile (firstName, lastName, role)
export const updateUserProfile = async (
  authToken: string | null,
  id: string,
  profileData: { firstName?: string; lastName?: string; role?: string },
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}?field=profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(profileData),
    });

    console.log("API: Response status:", response.status);
    console.log("API: Response headers:", response.headers);

    const result = (await response.json()) as ApiResponse<User>;
    console.log("API: Response body:", result);

    if (!response.ok) {
      console.error("API: Response not OK:", response.status, result);
      throw new Error(result.message ?? "Failed to update user profile");
    }

    return result;
  } catch (error) {
    console.error("API: Error updating user profile:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update user profile",
    );
  }
};

// Update user email
export const updateUserEmail = async (
  authToken: string | null,
  id: string,
  email: string,
  password: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}?field=email`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("API: Response status:", response.status);
    console.log("API: Response headers:", response.headers);

    const result = (await response.json()) as ApiResponse<User>;
    console.log("API: Response body:", result);

    if (!response.ok) {
      console.error("API: Response not OK:", response.status, result);
      throw new Error(result.message ?? "Failed to update user email");
    }

    return result;
  } catch (error) {
    console.error("API: Error updating user email:", error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to connect to the server. Please check if the backend is running.",
      );
    }

    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError) {
      throw new Error("Server response error: Invalid response from server.");
    }

    throw new Error(
      error instanceof Error ? error.message : "Failed to update user email",
    );
  }
};

// Update user username
export const updateUserUsername = async (
  authToken: string | null,
  id: string,
  username: string,
  password: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}?field=username`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ username, password }),
    });

    console.log("API: Response status:", response.status);
    console.log("API: Response headers:", response.headers);

    const result = (await response.json()) as ApiResponse<User>;
    console.log("API: Response body:", result);

    if (!response.ok) {
      console.error("API: Response not OK:", response.status, result);
      throw new Error(result.message ?? "Failed to update user username");
    }

    return result;
  } catch (error) {
    console.error("API: Error updating user username:", error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to connect to the server. Please check if the backend is running.",
      );
    }

    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError) {
      throw new Error("Server response error: Invalid response from server.");
    }

    throw new Error(
      error instanceof Error ? error.message : "Failed to update user username",
    );
  }
};

// Update user password
export const updateUserPassword = async (
  authToken: string | null,
  id: string,
  currentPassword: string,
  newPassword: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}?field=password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ password: currentPassword, newPassword }),
    });

    console.log("API: Response status:", response.status);
    console.log("API: Response headers:", response.headers);

    const result = (await response.json()) as ApiResponse<User>;
    console.log("API: Response body:", result);

    if (!response.ok) {
      console.error("API: Response not OK:", response.status, result);
      throw new Error(result.message ?? "Failed to update user password");
    }

    return result;
  } catch (error) {
    console.error("API: Error updating user password:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update user password",
    );
  }
};

// Update user phone number
export const updateUserPhone = async (
  authToken: string | null,
  id: string,
  phoneNo: string,
  password: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}?field=phoneNo`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ phoneNo, password }),
    });

    console.log("API: Response status:", response.status);
    console.log("API: Response headers:", response.headers);

    const result = (await response.json()) as ApiResponse<User>;
    console.log("API: Response body:", result);

    if (!response.ok) {
      console.error("API: Response not OK:", response.status, result);
      throw new Error(result.message ?? "Failed to update user phone number");
    }

    return result;
  } catch (error) {
    console.error("API: Error updating user phone:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to update user phone number",
    );
  }
};

// Update specific user field
export const updateUserField = async (
  authToken: string | null,
  id: string,
  field: "profile" | "email" | "username" | "password" | "phoneNo",
  value: any,
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}?field=${field}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ [field]: value }),
    });

    const result = (await response.json()) as ApiResponse<User>;

    if (!response.ok) {
      throw new Error(result.message ?? `Failed to update user ${field}`);
    }

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : `Failed to update user ${field}`,
    );
  }
};

// Test backend connectivity
export const testBackendConnection = async (
  authToken: string | null,
): Promise<boolean> => {
  try {
    console.log("Testing backend connection to:", API_BASE_URL);

    const response = await fetch(`${API_BASE_URL}/user-role`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    console.log("Backend connection test - Status:", response.status);

    if (response.ok) {
      console.log("✅ Backend is accessible and responding");
      return true;
    } else {
      console.log(
        "⚠️ Backend responded but with error status:",
        response.status,
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Backend connection test failed:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error: Backend server is not accessible");
    }

    return false;
  }
};
