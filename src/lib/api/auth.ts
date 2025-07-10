// src/lib/api/auth.ts
export async function loginUser(username: string, password: string) {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ username, password }),
    });

    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response ok:', response.ok);
    
    const data = await response.json();
    console.log('🔍 Response data:', data);
    
    // Check if the response is successful
    if (response.ok && data.success) {
      console.log('✅ Login successful:', data);
      return { success: true, user: data.user };
    } else {
      console.error('❌ Login failed:', data.message || 'Unknown error');
      return { success: false, message: data.message || 'Login failed' };
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

export async function verifyToken(token: string) {
  try {
    const response = await fetch('http://localhost:5000/api/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    console.log('🔍 Verify token status:', response.status);
    
    const data = await response.json();
    console.log('🔍 Verify token data:', data);
    
    if (response.ok && data.success) {
      return { success: true, user: data };
    } else {
      return { success: false, message: data.message || 'Token verification failed' };
    }
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return { success: false, message: 'Network error occurred' };
  }
}