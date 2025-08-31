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

interface LivePreviewProps {
    theme: Theme;
}

export default function LivePreview({ theme }: LivePreviewProps) {
    const cssVariables = `
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
  `;

    return (
        <div className="space-y-6">
            {/* CSS Variables Display */}
            <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">CSS Variables</h3>
                <pre className="text-xs text-gray-700 overflow-x-auto">
                    <code>{cssVariables}</code>
                </pre>
            </div>

            {/* Live Preview Components */}
            <div
                className="space-y-4 p-4 border rounded-lg"
                style={{
                    '--color-primary': theme.colors.primary,
                    '--color-secondary': theme.colors.secondary,
                    '--color-accent': theme.colors.accent,
                    '--color-neutral': theme.colors.neutral,
                    '--color-info': theme.colors.info,
                    '--color-success': theme.colors.success,
                    '--color-warning': theme.colors.warning,
                    '--color-error': theme.colors.error,
                    '--radius-box': `${theme.radius.box}px`,
                    '--radius-field': `${theme.radius.field}px`,
                    '--radius-selector': `${theme.radius.selector}px`,
                } as React.CSSProperties}
            >
                {/* Buttons */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Buttons</h4>
                    <div className="flex flex-wrap gap-2">
                        <button
                            className="px-4 py-2 rounded text-white font-medium"
                            style={{
                                backgroundColor: theme.colors.primary,
                                borderRadius: `${theme.radius.field}px`,
                                boxShadow: theme.effects.depth ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            Primary
                        </button>
                        <button
                            className="px-4 py-2 rounded text-white font-medium"
                            style={{
                                backgroundColor: theme.colors.secondary,
                                borderRadius: `${theme.radius.field}px`,
                                boxShadow: theme.effects.depth ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            Secondary
                        </button>
                        <button
                            className="px-4 py-2 rounded text-white font-medium"
                            style={{
                                backgroundColor: theme.colors.accent,
                                borderRadius: `${theme.radius.field}px`,
                                boxShadow: theme.effects.depth ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            Accent
                        </button>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Status Badges</h4>
                    <div className="flex flex-wrap gap-2">
                        <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{
                                backgroundColor: theme.colors.success,
                                borderRadius: `${theme.radius.selector}px`
                            }}
                        >
                            Success
                        </span>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{
                                backgroundColor: theme.colors.warning,
                                borderRadius: `${theme.radius.selector}px`
                            }}
                        >
                            Warning
                        </span>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{
                                backgroundColor: theme.colors.error,
                                borderRadius: `${theme.radius.selector}px`
                            }}
                        >
                            Error
                        </span>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{
                                backgroundColor: theme.colors.info,
                                borderRadius: `${theme.radius.selector}px`
                            }}
                        >
                            Info
                        </span>
                    </div>
                </div>

                {/* Card */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Card</h4>
                    <div
                        className="p-4 border rounded-lg"
                        style={{
                            borderRadius: `${theme.radius.box}px`,
                            boxShadow: theme.effects.depth ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <h5 className="font-semibold mb-2">Sample Card</h5>
                        <p className="text-sm text-gray-600 mb-3">
                            This is a sample card component with your custom theme applied.
                        </p>
                        <button
                            className="px-3 py-1 rounded text-white text-sm"
                            style={{
                                backgroundColor: theme.colors.primary,
                                borderRadius: `${theme.radius.field}px`
                            }}
                        >
                            Action
                        </button>
                    </div>
                </div>

                {/* Input Field */}
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Input Field</h4>
                    <input
                        type="text"
                        placeholder="Enter text here..."
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
                        style={{
                            borderRadius: `${theme.radius.field}px`,
                            borderColor: theme.colors.neutral,
                            '--tw-ring-color': theme.colors.primary
                        } as React.CSSProperties}
                    />
                </div>
            </div>
        </div>
    );
}
