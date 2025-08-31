'use client';

import { useState, useEffect } from 'react';
import ColorPicker from '@/components/ColorPicker';
import RadiusControl from '@/components/RadiusControl';
import LivePreview from '@/components/LivePreview';
import ThemeExporter from '@/components/ThemeExporter';
import Dashboard from '@/components/Dashboard';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState({
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      neutral: '#6b7280',
      info: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    radius: {
      box: 8,
      field: 6,
      selector: 4,
    },
    effects: {
      depth: true,
      noise: false,
    }
  });

  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
  });

  useEffect(() => {
    // Check for existing token
    const savedToken = localStorage.getItem('theme-pusher-token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      // Verify token is still valid
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch('/api/themes', {
        headers: { Authorization: `Bearer ${tokenToVerify}` },
      });

      if (response.ok) {
        // Token is valid, get user info
        const userResponse = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${tokenToVerify}` },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
      } else {
        // Token is invalid
        localStorage.removeItem('theme-pusher-token');
        setIsAuthenticated(false);
        setToken('');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('theme-pusher-token');
      setIsAuthenticated(false);
      setToken('');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint = showLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('theme-pusher-token', data.token);
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('theme-pusher-token');
  };

  const updateColor = (colorName: string, value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorName]: value
      }
    }));
  };

  const updateRadius = (radiusType: string, value: number) => {
    setTheme(prev => ({
      ...prev,
      radius: {
        ...prev.radius,
        [radiusType]: value
      }
    }));
  };

  const updateEffect = (effectName: string, value: boolean) => {
    setTheme(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectName]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            {showLogin ? 'Login' : 'Register'}
          </h1>

          <form onSubmit={handleAuth} className="space-y-4">
            {!showLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              {showLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="text-sm text-primary hover:underline"
            >
              {showLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Dynamic Theme Generator & Pusher
            </h1>
            <p className="text-gray-600">
              Create themes and push them to your projects in real-time
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard */}
        <Dashboard token={token} />

        {/* Theme Generator */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Theme Generator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme Controls */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4">Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(theme.colors).map(([name, value]) => (
                    <ColorPicker
                      key={name}
                      label={name.charAt(0).toUpperCase() + name.slice(1)}
                      color={value}
                      onChange={(color) => updateColor(name, color)}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4">Radius</h3>
                <div className="space-y-4">
                  {Object.entries(theme.radius).map(([name, value]) => (
                    <RadiusControl
                      key={name}
                      label={name.charAt(0).toUpperCase() + name.slice(1)}
                      value={value}
                      onChange={(val) => updateRadius(name, val)}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold mb-4">Effects</h3>
                <div className="space-y-3">
                  {Object.entries(theme.effects).map(([name, value]) => (
                    <label key={name} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateEffect(name, e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {name} Effect
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <ThemeExporter
                theme={theme}
                token={token}
                onThemeSaved={() => {
                  // Refresh the dashboard to show the new theme
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
              />
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
              <LivePreview theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
