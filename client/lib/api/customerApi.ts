const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

console.log("API Base URL:", API_BASE_URL);

export interface Customer {
  _id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNo?: string;
  shippingInfo?: {
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Update customer profile (firstName, lastName)
export const updateCustomerProfile = async (
  customerId: string,
  profileData: { firstName: string; lastName: string },
): Promise<ApiResponse<Customer>> => {
  try {
    console.log("Updating customer profile with data:", profileData);
    const response = await fetch(
      `${API_BASE_URL}/customer/${customerId}?field=profile`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      },
    );

    console.log("Profile update response status:", response.status);
    const result = await response.json();
    console.log("Profile update result:", result);

    if (!response.ok) {
      throw new Error(result.message ?? "Failed to update customer profile");
    }

    return result as ApiResponse<Customer>;
  } catch (error) {
    console.error("Error updating customer profile:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw error;
  }
};

// Update customer email
export const updateCustomerEmail = async (
  customerId: string,
  newEmail: string,
  currentPassword: string,
): Promise<ApiResponse<Customer>> => {
  try {
    console.log("Updating customer email with data:", {
      newEmail,
      currentPassword: "***",
    });
    const response = await fetch(
      `${API_BASE_URL}/customer/${customerId}?field=email`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: currentPassword }),
      },
    );

    console.log("Email update response status:", response.status);
    const result = await response.json();
    console.log("Email update result:", result);

    if (!response.ok) {
      throw new Error(result.message ?? "Failed to update customer email");
    }

    return result as ApiResponse<Customer>;
  } catch (error) {
    console.error("Error updating customer email:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw error;
  }
};

// Update customer username
export const updateCustomerUsername = async (
  customerId: string,
  newUsername: string,
  currentPassword: string,
): Promise<ApiResponse<Customer>> => {
  try {
    console.log("Updating customer username with data:", {
      newUsername,
      currentPassword: "***",
    });
    const response = await fetch(
      `${API_BASE_URL}/customer/${customerId}?field=username`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: currentPassword,
        }),
      },
    );

    console.log("Username update response status:", response.status);
    const result = await response.json();
    console.log("Username update result:", result);

    if (!response.ok) {
      throw new Error(result.message ?? "Failed to update customer username");
    }

    return result as ApiResponse<Customer>;
  } catch (error) {
    console.error("Error updating customer username:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw error;
  }
};

// Update customer password
export const updateCustomerPassword = async (
  customerId: string,
  currentPassword: string,
  newPassword: string,
): Promise<ApiResponse<Customer>> => {
  try {
    console.log("Updating customer password with data:", {
      currentPassword: "***",
      newPassword: "***",
    });
    const response = await fetch(
      `${API_BASE_URL}/customer/${customerId}?field=password`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: currentPassword, newPassword }),
      },
    );

    console.log("Password update response status:", response.status);
    const result = await response.json();
    console.log("Password update result:", result);

    if (!response.ok) {
      throw new Error(result.message ?? "Failed to update customer password");
    }

    return result as ApiResponse<Customer>;
  } catch (error) {
    console.error("Error updating customer password:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw error;
  }
};

// Update customer phone number
export const updateCustomerPhone = async (
  customerId: string,
  phoneNumber: string,
  currentPassword: string,
): Promise<ApiResponse<Customer>> => {
  try {
    console.log("Updating customer phone with data:", {
      phoneNumber,
      currentPassword: "***",
    });
    const response = await fetch(
      `${API_BASE_URL}/customer/${customerId}?field=phoneNo`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNo: phoneNumber,
          password: currentPassword,
        }),
      },
    );

    console.log("Phone update response status:", response.status);
    const result = await response.json();
    console.log("Phone update result:", result);

    if (!response.ok) {
      throw new Error(
        result.message ?? "Failed to update customer phone number",
      );
    }

    return result as ApiResponse<Customer>;
  } catch (error) {
    console.error("Error updating customer phone number:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw error;
  }
};

// Update customer address (shipping info)
export const updateCustomerAddress = async (
  customerId: string,
  shippingInfo: {
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  },
): Promise<ApiResponse<Customer>> => {
  try {
    console.log("Updating customer address with data:", shippingInfo);
    const response = await fetch(
      `${API_BASE_URL}/customer/${customerId}?field=address`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingInfo }),
      },
    );

    console.log("Address update response status:", response.status);
    const result = await response.json();
    console.log("Address update result:", result);

    if (!response.ok) {
      throw new Error(result.message ?? "Failed to update customer address");
    }

    return result as ApiResponse<Customer>;
  } catch (error) {
    console.error("Error updating customer address:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw error;
  }
};

// Test backend connection for customers
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log("Testing backend connection to:", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/customer`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
