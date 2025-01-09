// src/LoginPage/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/config';
import { FcGoogle } from 'react-icons/fc';
import { AuthService, AuthError } from '../services/AuthService';
import './LoginPage.css';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);

      // Sign in with Firebase
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      try {
        // Check if user exists in our database
        const existingUser = await AuthService.getUserByFirebaseUid(user.uid);
        
        if (!existingUser) {
          // Create new user in our database
          await AuthService.createUser({
            email: user.email,
            firebaseUid: user.uid,
            username: user.displayName || user.email.split('@')[0],
            fullName: user.displayName || '',
            avatarUrl: user.photoURL || '',
            emailVerified: user.emailVerified,
            isActive: true
          });
        }

        // Navigate to documents page
        navigate('/documents');
      } catch (err) {
        if (err instanceof AuthError) {
          setError(`Authentication failed: ${err.message}`);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Auth Error:', err);
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Firebase Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to EssAI</h1>
        <p>Create, edit and collaborate with AI on documents</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button 
          className="google-button"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle className="google-icon" />
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
}