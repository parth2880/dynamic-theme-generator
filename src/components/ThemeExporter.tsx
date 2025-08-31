'use client';

import { useState } from 'react';

interface Theme {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        neutral: string;
        info: string;
        success: string;
        warning: string;
        error: string;
    };
    radius: {
        box: number;
        field: number;
        selector: number;
    };
    effects: {
        depth: boolean;
        noise: boolean;
    };
}

interface ThemeExporterProps {
    theme: Theme;
    token?: string;
    onThemeSaved?: () => void;
}

export default function ThemeExporter({ theme, token, onThemeSaved }: ThemeExporterProps) {
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [themeForm, setThemeForm] = useState({
        name: '',
        description: '',
        isPublic: false,
    });

    const generateCSSVariables = () => {
        return `:root {
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-neutral: ${theme.colors.neutral};
  --color-info: ${theme.colors.info};
  --color-success: ${theme.colors.success};
  --color-warning: ${theme.colors.warning};
  --color-error: ${theme.colors.error};
  --radius-box: ${theme.radius.box}px;
  --radius-field: ${theme.radius.field}px;
  --radius-selector: ${theme.radius.selector}px;
}`;
    };

    const generateTailwindConfig = () => {
        return `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        neutral: 'var(--color-neutral)',
        info: 'var(--color-info)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      borderRadius: {
        box: 'var(--radius-box)',
        field: 'var(--radius-field)',
        selector: 'var(--radius-selector)',
      }
    }
  }
}`;
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const saveTheme = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            alert('Please login to save themes');
            return;
        }

        if (!themeForm.name.trim()) {
            alert('Please enter a theme name');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/themes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: themeForm.name,
                    description: themeForm.description,
                    colors: theme.colors,
                    radius: theme.radius,
                    effects: theme.effects,
                    isPublic: themeForm.isPublic,
                }),
            });

            if (response.ok) {
                setThemeForm({ name: '', description: '', isPublic: false });
                setShowSaveForm(false);
                onThemeSaved?.();
                alert('Theme saved successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to save theme');
            }
        } catch (error) {
            console.error('Error saving theme:', error);
            alert('Failed to save theme');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Export Theme</h2>

            {/* Save Theme Section */}
            {token && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Save Theme</h3>
                        <button
                            onClick={() => setShowSaveForm(!showSaveForm)}
                            className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            {showSaveForm ? 'Cancel' : 'Save Theme'}
                        </button>
                    </div>

                    {showSaveForm && (
                        <form onSubmit={saveTheme} className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Theme Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={themeForm.name}
                                    onChange={(e) => setThemeForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="My Custom Theme"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={themeForm.description}
                                    onChange={(e) => setThemeForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={2}
                                    placeholder="Optional description of your theme"
                                />
                            </div>

                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={themeForm.isPublic}
                                        onChange={(e) => setThemeForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Make theme public (shareable with others)
                                    </span>
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    {saving ? 'Saving...' : 'Save Theme'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            <div className="space-y-4">
                {/* CSS Variables Export */}
                <div>
                    <h3 className="text-sm font-medium mb-2">CSS Variables</h3>
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                            <code>{generateCSSVariables()}</code>
                        </pre>
                    </div>
                    <button
                        onClick={() => copyToClipboard(generateCSSVariables())}
                        className="mt-2 px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors"
                        style={{ backgroundColor: theme.colors.primary }}
                    >
                        {copied ? 'Copied!' : 'Copy CSS Variables'}
                    </button>
                </div>

                {/* Tailwind Config Export */}
                <div>
                    <h3 className="text-sm font-medium mb-2">Tailwind Config</h3>
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                            <code>{generateTailwindConfig()}</code>
                        </pre>
                    </div>
                    <button
                        onClick={() => copyToClipboard(generateTailwindConfig())}
                        className="mt-2 px-3 py-1 bg-secondary text-white text-sm rounded hover:bg-secondary/90 transition-colors"
                        style={{ backgroundColor: theme.colors.secondary }}
                    >
                        {copied ? 'Copied!' : 'Copy Tailwind Config'}
                    </button>
                </div>

                {/* Mini Pusher Demo */}
                <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Theme Pusher Demo</h3>
                    <p className="text-xs text-gray-600 mb-3">
                        Simulate pushing this theme to a connected project
                    </p>
                    <button
                        onClick={() => {
                            // Simulate webhook call
                            alert('Theme pushed successfully! (Demo mode)');
                        }}
                        className="px-4 py-2 bg-accent text-white text-sm rounded hover:bg-accent/90 transition-colors"
                        style={{ backgroundColor: theme.colors.accent }}
                    >
                        Push Theme to Project
                    </button>
                </div>
            </div>
        </div>
    );
}
