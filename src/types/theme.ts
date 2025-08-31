export interface Theme {
    id: string;
    name: string;
    description?: string;
    colors: string; // JSON string
    radius: string; // JSON string
    effects: string; // JSON string
    isPublic: boolean;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface ThemeData {
    colors: Record<string, string>;
    radius: Record<string, number>;
    effects: Record<string, boolean>;
}

export interface ParsedTheme extends Omit<Theme, 'colors' | 'radius' | 'effects'> {
    colors: Record<string, string>;
    radius: Record<string, number>;
    effects: Record<string, boolean>;
}
