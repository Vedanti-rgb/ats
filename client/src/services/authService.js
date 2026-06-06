const API_URL = 'http://localhost:5000/api/auth';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  localStorage.setItem('pendingEmail', email);
  return data;
};

export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_URL}/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed');
  }

  localStorage.setItem('token', data.token);
  localStorage.removeItem('pendingEmail');
  return data;
};

export const resendOTP = async (email) => {
  const response = await fetch(`${API_URL}/resend-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend OTP');
  }

  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.needsVerification) {
      localStorage.setItem('pendingEmail', data.email);
    }
    throw new Error(data.message || 'Login failed');
  }

  localStorage.setItem('token', data.token);
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('pendingEmail');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      logout();
      return null;
    }

    return response.json();
  } catch {
    logout();
    return null;
  }
};

const USER_API_URL = 'http://localhost:5000/api/user';

export const getAllUsers = async () => {
  const response = await fetch(`${USER_API_URL}/all`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(`${USER_API_URL}/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
};

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.needsVerification) {
      localStorage.setItem('pendingEmail', data.email);
    }
    throw new Error(data.message || 'Failed to send reset OTP');
  }

  localStorage.setItem('pendingEmail', email);
  return data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Password reset failed');
  }

  localStorage.removeItem('pendingEmail');
  return data;
};

// Profile Services
export const isLiveSession = () => {
  return !!localStorage.getItem('token');
};

export const getUserProfile = async () => {
  const response = await fetch(`${USER_API_URL}/profile`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${USER_API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data;
};
