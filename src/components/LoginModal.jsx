import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import './Register.css';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOTPVerification, setIsOTPVerification] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    usn: '',
    branch: '',
    section: '',
    email: '',
    phone: '',
    otp: ''
  });

  const [error, setError] = useState({ message: '', field: '' });
  const [success, setSuccess] = useState({ message: '' });

  const branches = ['Biotechnology', 'Civil Engineering', 'Construction Technology and Management',
    'Computer Science and Engineering', 'Computer Science and Engineering(AI & ML)',
    'Computer Science and Business System', 'Electronics and Communication Engineering',
    'Information Science and Engineering', 'Mechanical Engineering', 'Bachelor of Computer Applications',
    'Bachelor of Business Administration', 'other'
  ];

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/\d/.test(password)) return 'Password must contain at least one number.';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain a special character (e.g., !@#$%).';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      // Registration logic with validation
      setError({ message: '', field: '' });

      // Validation
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key) && String(formData[key]).trim() === '') {
          setError({ message: 'Please fill in all required fields.', field: key });
          return;
        }
      }
      if (!formData.usn.toUpperCase().includes('JST')) {
        setError({ message: 'Invalid USN. It must contain "JST".', field: 'usn' });
        return;
      }
      if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
        setError({ message: 'Please provide a valid @gmail.com email address.', field: 'email' });
        return;
      }
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setError({ message: passwordError, field: 'password' });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError({ message: 'Passwords do not match.', field: 'confirmPassword' });
        return;
      }
      const phoneRegex = /^(91)?[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError({ message: 'Please enter a valid 10 or 12-digit phone number.', field: 'phone' });
        return;
      }

      // API call
      const { confirmPassword, ...submissionData } = formData;

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        const result = await response.json();

        if (!response.ok) {
          setError({ message: result.message || 'An error occurred.', field: '' });
        } else {
          alert('Registration Successful! A confirmation email has been sent.');
          onClose();
        }
      } catch (networkError) {
        setError({ message: 'Could not connect to the server. Please try again later.', field: '' });
      }
    } else {
      // Login logic (simplified)
      onLogin({
        username: 'John Doe',
        email: formData.email,
        phone: '+1 (555) 987-6543',
        usn: '01JST21CS001',
        branch: 'Computer Science and Engineering',
        section: 'A'
      });
      onClose();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error.message) setError({ message: '', field: '' });
    if (success.message) setSuccess({ message: '' });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError({ message: 'Please enter your email address.', field: 'email' });
      return;
    }

    try {
      // Simulate API call to send OTP
      setSuccess({ message: 'OTP sent to your email address!' });
      setIsForgotPassword(false);
      setIsOTPVerification(true);
    } catch (error) {
      setError({ message: 'Failed to send OTP. Please try again.', field: '' });
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setError({ message: 'Please enter the OTP.', field: 'otp' });
      return;
    }

    try {
      // Simulate OTP verification
      if (formData.otp === '123456') { // For demo purposes
        setSuccess({ message: 'OTP verified! You can now reset your password.' });
        // Reset states
        setIsOTPVerification(false);
        setIsForgotPassword(false);
        setIsRegistering(false);
        setFormData({ ...formData, otp: '' });
      } else {
        setError({ message: 'Invalid OTP. Please try again.', field: 'otp' });
      }
    } catch (error) {
      setError({ message: 'OTP verification failed. Please try again.', field: '' });
    }
  };

  const resetStates = () => {
    setIsRegistering(false);
    setIsForgotPassword(false);
    setIsOTPVerification(false);
    setError({ message: '', field: '' });
    setSuccess({ message: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold custom-brown">
              {isRegistering ? 'Register' :
                isForgotPassword ? 'Forgot Password' :
                  isOTPVerification ? 'Verify OTP' : 'Login'}
            </h2>
            <button
              onClick={() => {
                resetStates();
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 custom-brown" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={
            isForgotPassword ? handleForgotPassword :
              isOTPVerification ? handleOTPVerification :
                handleSubmit
          } className="space-y-4">
            {/* Forgot Password Form */}
            {isForgotPassword && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-gray-600">
                    Enter your email address and we'll send you an OTP to reset your password.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'email' ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
            )}

            {/* OTP Verification Form */}
            {isOTPVerification && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-gray-600">
                    We've sent a 6-digit OTP to <strong>{formData.email}</strong>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Please check your email and enter the OTP below.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    required
                    value={formData.otp}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-center text-lg tracking-widest ${error.field === 'otp' ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="000000"
                    maxLength="6"
                    pattern="[0-9]{6}"
                  />
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOTPVerification(false);
                      setIsForgotPassword(true);
                    }}
                    className="text-sm text-accent hover:underline"
                  >
                    Didn't receive OTP? Resend
                  </button>
                </div>
              </div>
            )}

            {isRegistering && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'username' ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Create a username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">
                    USN
                  </label>
                  <input
                    type="text"
                    name="usn"
                    required
                    value={formData.usn}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'usn' ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., 01JST21CS001"
                  />
                </div>
              </div>
            )}

            {/* Regular Login/Register Form - Hide during forgot password flow */}
            {!isForgotPassword && !isOTPVerification && (
              <>
                <div>
                  <label className="block text-sm font-medium custom-brown mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'email' ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={isRegistering ? "your.name@gmail.com" : "Enter your email"}
                  />
                </div>

                <div className={isRegistering ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
                  <div>
                    <label className="block text-sm font-medium custom-brown mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'password' ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder={isRegistering ? "Create a strong password" : "Enter your password"}
                      title={isRegistering ? "Must contain at least 8 characters, including an uppercase, lowercase, number, and special character." : ""}
                    />
                  </div>
                  {isRegistering && (
                    <div>
                      <label className="block text-sm font-medium custom-brown mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'confirmPassword' ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Confirm your password"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {isRegistering && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium custom-brown mb-2">
                      Branch
                    </label>
                    <select
                      name="branch"
                      required
                      value={formData.branch}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'branch' ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Branch</option>
                      {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium custom-brown mb-2">
                      Section
                    </label>
                    <input
                      type="text"
                      name="section"
                      required
                      value={formData.section}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'section' ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium custom-brown mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${error.field === 'phone' ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="10-digit number"
                      pattern="^(91)?[0-9]{10}$"
                      title="Please enter a valid 10 or 12-digit number"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full custom-accent text-brown font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              {isRegistering ? 'Register' :
                isForgotPassword ? 'Send OTP' :
                  isOTPVerification ? 'Verify OTP' : 'Login'}
            </button>

            {error.message && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error.message}
              </div>
            )}

            {success.message && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success.message}
              </div>
            )}
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center space-y-2">
            {/* Forgot Password Link - Only show on login */}
            {!isRegistering && !isForgotPassword && !isOTPVerification && (
              <div>
                <button
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-accent font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Back to Login Links */}
            {(isForgotPassword || isOTPVerification) && (
              <div>
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsOTPVerification(false);
                  }}
                  className="text-sm text-accent font-semibold hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            )}

            {/* Register/Login Toggle */}
            {!isForgotPassword && !isOTPVerification && (
              <p className="custom-brown opacity-70">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="ml-2 text-accent font-semibold hover:underline"
                >
                  {isRegistering ? 'Login' : 'Register'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
