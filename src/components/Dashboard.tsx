'use client';

import { useState, useEffect } from 'react';

interface Theme {
    id: string;
    name: string;
    description?: string;
    colors: string;
    radius: string;
    effects: string;
    isPublic: boolean;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

interface Project {
    id: string;
    name: string;
    description?: string;
    webhookUrl: string;
    apiKey: string;
    platform: 'VERCEL' | 'NETLIFY' | 'CUSTOM' | 'GITHUB';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    themes?: any[];
}

interface DashboardProps {
    token: string;
}

export default function Dashboard({ token }: DashboardProps) {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTheme, setSelectedTheme] = useState<string>('');
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [pushing, setPushing] = useState(false);
    const [pushResult, setPushResult] = useState<any>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        webhookUrl: '',
        platform: 'VERCEL' as const
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [themesRes, projectsRes] = await Promise.all([
                fetch('/api/themes', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch('/api/projects', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (themesRes.ok) {
                const themesData = await themesRes.json();
                setThemes(themesData);
            }

            if (projectsRes.ok) {
                const projectsData = await projectsRes.json();
                setProjects(projectsData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const pushTheme = async () => {
        if (!selectedTheme) {
            alert('Please select a theme to push');
            return;
        }

        setPushing(true);
        setPushResult(null);

        try {
            const response = await fetch(`/api/themes/${selectedTheme}/push`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    projectIds: selectedProjects.length > 0 ? selectedProjects : undefined,
                }),
            });

            const result = await response.json();
            setPushResult(result);
        } catch (error) {
            console.error('Error pushing theme:', error);
            setPushResult({ error: 'Failed to push theme' });
        } finally {
            setPushing(false);
        }
    };

    const addProject = async () => {
        if (!newProject.name || !newProject.webhookUrl) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newProject),
            });

            if (response.ok) {
                setNewProject({ name: '', description: '', webhookUrl: '', platform: 'VERCEL' });
                setShowAddForm(false);
                fetchData();
                alert('Website added successfully!');
            } else {
                const error = await response.json();
                alert(`Failed to add website: ${error.error}`);
            }
        } catch (error) {
            console.error('Error adding project:', error);
            alert('Failed to add website');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Theme Pusher Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Theme Pusher</h2>

                {projects.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No websites connected yet.</p>
                        <p className="text-sm text-gray-400">
                            Connect your website first to start pushing themes and changing its styling.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Theme Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Theme
                                </label>
                                <select
                                    value={selectedTheme}
                                    onChange={(e) => setSelectedTheme(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Choose a theme...</option>
                                    {themes.map((theme) => (
                                        <option key={theme.id} value={theme.id}>
                                            {theme.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Website Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Websites (Optional - pushes to all if none selected)
                                </label>
                                <select
                                    multiple
                                    value={selectedProjects}
                                    onChange={(e) => {
                                        const values = Array.from(e.target.selectedOptions, option => option.value);
                                        setSelectedProjects(values);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                                >
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name} - {project.platform}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Push Button */}
                        <div className="mt-6">
                            <button
                                onClick={pushTheme}
                                disabled={pushing || !selectedTheme}
                                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {pushing ? 'Updating Website...' : 'Push Theme to Website'}
                            </button>
                        </div>

                        {/* Push Result */}
                        {pushResult && (
                            <div className="mt-4 p-4 rounded-md bg-gray-50">
                                <h3 className="font-medium mb-2">Push Result:</h3>
                                {pushResult.error ? (
                                    <div className="text-red-600">{pushResult.error}</div>
                                ) : (
                                    <div>
                                        <div className="text-green-600 mb-2">{pushResult.message}</div>
                                        <details className="text-sm">
                                            <summary className="cursor-pointer">View Details</summary>
                                            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                                                {JSON.stringify(pushResult.results, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Connected Websites Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Connected Websites</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90"
                        >
                            {showAddForm ? 'Cancel' : 'Add Website'}
                        </button>
                        {projects.length === 0 && (
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/api/projects/create-demo', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${token}`,
                                            },
                                            body: JSON.stringify({
                                                name: 'Test Website (Local)',
                                                webhookUrl: 'http://localhost:3000/api/webhook',
                                            }),
                                        });

                                        if (response.ok) {
                                            alert('Demo website created! Make sure your test-website is running on localhost:3000');
                                            fetchData();
                                        } else {
                                            alert('Failed to create demo website');
                                        }
                                    } catch (error) {
                                        console.error('Error creating demo website:', error);
                                        alert('Failed to create demo website');
                                    }
                                }}
                                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                                Add Test Website
                            </button>
                        )}
                    </div>
                </div>

                {/* Add Website Form */}
                {showAddForm && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                        <h3 className="font-medium mb-3">Add New Website</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Website Name *
                                </label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    placeholder="My Portfolio"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Platform
                                </label>
                                <select
                                    value={newProject.platform}
                                    onChange={(e) => setNewProject({ ...newProject, platform: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="VERCEL">Vercel</option>
                                    <option value="NETLIFY">Netlify</option>
                                    <option value="CUSTOM">Custom</option>
                                    <option value="GITHUB">GitHub Pages</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Webhook URL *
                                </label>
                                <input
                                    type="url"
                                    value={newProject.webhookUrl}
                                    onChange={(e) => setNewProject({ ...newProject, webhookUrl: e.target.value })}
                                    placeholder="https://your-website.com/api/webhook"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The webhook endpoint that will receive theme updates
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    placeholder="Brief description of your website"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={addProject}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                            >
                                Add Website
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {projects.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No websites connected yet.</p>
                        <p className="text-sm text-gray-400">
                            Add your website to start pushing themes and changing its styling.
                        </p>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">How to set up your website:</h4>
                            <ol className="text-sm text-blue-800 space-y-1">
                                <li>1. Build and deploy your website (Vercel, Netlify, etc.)</li>
                                <li>2. Add a webhook endpoint to receive theme updates</li>
                                <li>3. Register your website here with the webhook URL</li>
                                <li>4. Start pushing themes to change your website's styling!</li>
                            </ol>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <div key={project.id} className="border rounded-lg p-4">
                                <h3 className="font-medium">{project.name}</h3>
                                <p className="text-sm text-gray-600">{project.description}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                    Platform: {project.platform}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Status: {project.isActive ? '🟢 Live' : '🔴 Inactive'}
                                </div>
                                <div className="mt-1 text-xs text-gray-500 truncate">
                                    Webhook: {project.webhookUrl}
                                </div>
                                <div className="mt-2">
                                    <a
                                        href={project.webhookUrl.replace('/api/webhook', '')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Visit Website →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Themes Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Your Themes</h2>
                {themes.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No themes created yet.</p>
                        <p className="text-sm text-gray-400">
                            Use the theme generator below to create your first theme.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {themes.map((theme) => (
                            <div key={theme.id} className="border rounded-lg p-4">
                                <h3 className="font-medium">{theme.name}</h3>
                                <p className="text-sm text-gray-600">{theme.description}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                    Created: {new Date(theme.createdAt).toLocaleDateString()}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    Public: {theme.isPublic ? 'Yes' : 'No'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
