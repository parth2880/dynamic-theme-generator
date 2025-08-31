'use client';

import { useState } from 'react';
import { Project } from '@/types/project';

interface ProjectManagerProps {
    token: string;
    onProjectAdded: () => void;
}

export default function ProjectManager({ token, onProjectAdded }: ProjectManagerProps) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        webhookUrl: '',
        platform: 'CUSTOM' as const,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({
                    name: '',
                    description: '',
                    webhookUrl: '',
                    platform: 'CUSTOM',
                });
                setShowForm(false);
                onProjectAdded();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Project</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                    {showForm ? 'Cancel' : 'Add Project'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="My Awesome Project"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            placeholder="Optional description of your project"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Webhook URL *
                        </label>
                        <input
                            type="url"
                            required
                            value={formData.webhookUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="https://your-project.com/api/webhook"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This URL will receive theme updates when you push them
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Platform
                        </label>
                        <select
                            value={formData.platform}
                            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="CUSTOM">Custom</option>
                            <option value="VERCEL">Vercel</option>
                            <option value="NETLIFY">Netlify</option>
                            <option value="GITHUB">GitHub</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
