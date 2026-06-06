import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { register } from '../../services/authService';

const SignupForm = ({ onSignupSuccess, onLoginClick }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      await register(name, formData.email.toLowerCase(), formData.password);
      localStorage.setItem('pendingEmail', formData.email.toLowerCase());
      onSignupSuccess(formData.email.toLowerCase());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="First Name" 
          name="firstName" 
          placeholder="John" 
          value={formData.firstName}
          onChange={handleChange}
          required 
        />
        <Input 
          label="Last Name" 
          name="lastName" 
          placeholder="Doe" 
          value={formData.lastName}
          onChange={handleChange}
          required 
        />
      </div>
      <Input 
        label="Email Address" 
        name="email" 
        type="email" 
        placeholder="john@example.com" 
        value={formData.email}
        onChange={handleChange}
        required 
      />
      <Input 
        label="Password" 
        name="password" 
        type="password" 
        placeholder="••••••••" 
        value={formData.password}
        onChange={handleChange}
        required 
      />
      <Input 
        label="Confirm Password" 
        name="confirmPassword" 
        type="password" 
        placeholder="••••••••" 
        value={formData.confirmPassword}
        onChange={handleChange}
        required 
      />
      
      <Button type="submit" className="w-full py-4 text-lg mt-4 shadow-orange-500/20" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      
      <div className="text-center text-sm font-medium text-stone-500 mt-2">
        Already have an account?{' '}
        <button 
          type="button" 
          onClick={onLoginClick}
          className="text-orange-500 font-bold hover:underline"
        >
          Log in instead
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
