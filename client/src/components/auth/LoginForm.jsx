import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onSignupClick, onForgotPassword, onLoginSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email.toLowerCase(), formData.password);
      if (onLoginSuccess) onLoginSuccess();
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}
      <Input 
        label="Email Address" 
        name="email" 
        type="email" 
        placeholder="name@example.com" 
        value={formData.email}
        onChange={handleChange}
        required 
      />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <label className="text-sm font-bold text-stone-700">Password</label>
          <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
            Forgot Password?
          </button>
        </div>
        <Input 
          name="password" 
          type="password" 
          placeholder="••••••••" 
          value={formData.password}
          onChange={handleChange}
          required 
        />
      </div>

      <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
        {loading ? 'Logging In...' : 'Log In'}
      </Button>
      
      <div className="text-center text-sm font-medium text-stone-500 mt-2">
         Don't have an account?{' '}
        <button 
          type="button" 
          onClick={onSignupClick}
          className="text-orange-500 font-bold hover:underline"
        >
          Sign up for free
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
