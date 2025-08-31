interface RadiusControlProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

export default function RadiusControl({ label, value, onChange }: RadiusControlProps) {
    return (
        <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                {label}
            </label>
            <div className="flex items-center space-x-3 flex-1">
                <input
                    type="range"
                    min="0"
                    max="24"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                    type="number"
                    min="0"
                    max="24"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-xs text-gray-500">px</span>
            </div>
        </div>
    );
}
