// src/services/AuthService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/user/v1';

export class AuthError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}

export const AuthService = {
  async createUser(userData) {
    const payload = {
      email: userData.email,
      username: userData.username,
      firebase_uid: userData.firebaseUid,
      full_name: userData.fullName,
      avatar_url: userData.avatarUrl,
      last_login: userData.lastLogin || new Date().toISOString(),
      is_active: userData.isActive || true,
      email_verified: userData.emailVerified || false
    };

    console.log(`POST ${API_BASE_URL}/`);
    console.log('Request payload:', payload);

    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      console.log('Response:', { status: response.status, data });

      if (!response.ok) {
        throw new AuthError(
          `Failed to create user: ${data}`,
          response.status
        );
      }

      return data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error instanceof AuthError ? error : new AuthError(error.message);
    }
  },

  async getUserByFirebaseUid(firebaseUid) {
    console.log(`GET ${API_BASE_URL}/firebase/${firebaseUid}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/firebase/${firebaseUid}`);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      console.log('Get user response:', response.status, data);
      
      if (response.status === 404) return null;
      if (!response.ok) {
        throw new AuthError(`Failed to fetch user: ${data}`, response.status);
      }
      
      return data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error instanceof AuthError ? error : new AuthError(error.message);
    }
  }
};