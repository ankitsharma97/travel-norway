import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, ArrowLeft, Home, LogOut, Settings, Bell } from "lucide-react";
import { gql, useMutation } from "@apollo/client";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// GraphQL mutations
const LOGIN_USER = gql`
  mutation Login($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        blocked
        confirmed
        documentId
        email
        id
        username
        role {
          type
          id
          description
          name
        }
      }
    }
  }
`;

const SIGN_UP_USER = gql`
  mutation Register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
      user {
        blocked
        confirmed
        documentId
        email
        id
        role {
          type
          name
          id
        }
        username
      }
    }
  }
`;

// Validation schemas
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters")
});

const signupSchema = yup.object().shape({
  username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
});

function LoginSignup({ open, setOpen }) {

  const [currentView, setCurrentView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Apollo mutations
  const [LoginUser, { dataLogin, loadingLogin, errorLogin }] = useMutation(LOGIN_USER);
  const [SignUpUser, { dataSignup, loadingSignup, errorSignup }] = useMutation(SIGN_UP_USER);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUserName("");
    setCurrentView("login");
    setIsLoading(false);
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = async (schema, values) => {
    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(e => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const values = { email, password };
    const isValid = await validateForm(loginSchema, values);

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    const input = {
      identifier: email,
      password: password,
    };

    try {
      const res = await LoginUser({
        variables: { input },
      });

      if (res.data?.login?.jwt) {
        // Store JWT in localStorage or secure cookie
        localStorage.setItem('auth_token', res.data.login.jwt);
        localStorage.setItem('user', JSON.stringify(res.data.login.user));
        
        toast.success("Login successful!");
        handleClose();
        
        // Redirect to dashboard after login
        setTimeout(() => {
          // navigate('/dashboard');
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const values = { username, email, password };
    const isValid = await validateForm(signupSchema, values);

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    const input = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const res = await SignUpUser({
        variables: { input }
      });

      if (res.data?.register?.jwt) {
        // Store JWT in localStorage or secure cookie
        localStorage.setItem('auth_token', res.data.register.jwt);
        localStorage.setItem('user', JSON.stringify(res.data.register.user));
        
        toast.success("Account created successfully!");
        handleClose();
        
        // Redirect to dashboard after signup
        setTimeout(() => {
          // navigate('/dashboard');
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
      console.error("Signup failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);

    // Simulate social login
    setTimeout(() => {
      toast.success(`${provider} login initiated`);
      setIsLoading(false);
    }, 800);
  };

  if (!open) return null;

  // Sign in Screen (direct login)
  const loginView = (
    <div className="flex flex-col">
      <button
        onClick={() => setCurrentView("welcome")}
        className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex justify-center mb-8">
        <div className="bg-blue-100 rounded-full p-4">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">Welcome back!</h1>
      <p className="text-gray-500 text-center mb-8">Sign in to your account</p>

      <form onSubmit={handleLoginSubmit} className="w-full">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="email"
            className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3`}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="password"
            className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="relative flex items-center justify-center rounded-lg font-poppins focus:outline-none tracking-wider pointer-events-auto w-full font-semibold text-white bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] h-12 px-12 text-sm pl-1 pr-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}
          Sign in
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or continue with</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => handleSocialLogin("Google")}
          className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        <button
          onClick={() => handleSocialLogin("Facebook")}
          className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16.5 3.75h-9A3.75 3.75 0 003.75 7.5v9a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75v-9a3.75 3.75 0 00-3.75-3.75zm-3 15v-5.25h-3v-3h3v-2.25c0-2.7 1.425-3.75 3.525-3.75 1.05 0 1.95.075 2.25.15v2.7h-1.5c-1.275 0-1.5.675-1.5 1.425v1.725h3.075l-.375 3h-2.7V18.75h-2.775z" />
          </svg>
          Facebook
        </button>
      </div>
      
      <button
        onClick={() => setCurrentView("signup")}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 text-center"
      >
        Don't have an account? Sign up
      </button>

      <div className="text-xs text-gray-400 text-center mt-8">
        By continuing, you agree to Rexby's Terms of Service and Privacy Policy
      </div>
    </div>
  );

  // Signup Screen
  const signupView = (
    <div className="flex flex-col">
      <button
        onClick={() => setCurrentView("welcome")}
        className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex justify-center mb-8">
        <div className="bg-green-100 rounded-full p-4">
          <User className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">
        Create your account
      </h1>
      <p className="text-gray-500 text-center mb-8">
        Fill in your details to get started
      </p>

      <form onSubmit={handleSignupSubmit} className="w-full">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className={`bg-gray-50 border ${errors.username ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3`}
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="email"
            className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3`}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        


        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="password"
            className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="relative flex items-center justify-center rounded-lg font-poppins focus:outline-none tracking-wider pointer-events-auto w-full font-semibold text-white bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] h-12 px-12 text-sm pl-1 pr-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : null}
          Create account
        </button>
      </form>
      
      <button
        onClick={() => setCurrentView("login")}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 text-center"
      >
        Already have an account? Sign in
      </button>

      <div className="text-xs text-gray-400 text-center mt-8">
        By creating an account, you agree to Rexby's Terms of Service and
        Privacy Policy
      </div>
    </div>
  );

  // Define which view to show
  let currentContent;
  switch (currentView) {
    case "login":
      currentContent = loginView;
      break;
    case "signup":
      currentContent = signupView;
      break;
    default:
      currentContent = loginView;
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="fixed top-16 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden animate-fadeIn">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">{currentContent}</div>
        </div>
      </div>
    </>
  );
}

// Dashboard component - page shown after successful login
function Dashboard() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      // Redirect to home if not logged in
      toast.error("Please login to view this page");
      return;
    }
    
    setUser(JSON.parse(userData));
  }, []);
  
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    toast.success("Logged out successfully");
    window.location.href = '/';
    
  };
  
  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Header/Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex items-center justify-between sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] rounded-full flex items-center justify-center">
                  <div className="text-white font-bold text-lg sm:text-xl">
                    @
                  </div>
                </div>
                <span className="ml-1 sm:ml-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#1496BF] to-[#0f6e8c] bg-clip-text text-transparent">
                  Rexby
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  onClick={handleLogout}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-600">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block">{user.username}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h1>
          <p className="text-gray-600">
            You have successfully logged in to your account. This is your personal dashboard where you can manage your profile and settings.
          </p>
        </div>
        
        {/* Dashboard content */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">{user.role?.name || 'Standard'}</p>
              </div>
            </div>
            
            <button className="mt-4 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
              <Settings className="w-4 h-4 mr-1" />
              Edit Profile
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Home className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Update Profile</span>
              </button>
              
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Account Settings</span>
              </button>
              
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium">Notifications</span>
              </button>
              
              <button 
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center"
                onClick={handleLogout}
              >
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Export both components
export { LoginSignup, Dashboard };