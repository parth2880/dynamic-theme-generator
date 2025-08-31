export interface Project {
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
    themes?: ProjectTheme[];
}

export interface ProjectTheme {
    id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    projectId: string;
    themeId: string;
    theme?: Theme;
}

export interface Theme {
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
