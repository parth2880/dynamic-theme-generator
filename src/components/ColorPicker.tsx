interface ColorPickerProps {
    label: string;
    color: string;
    onChange: (color: string) => void;
}

export default function ColorPicker({ label, color, onChange }: ColorPickerProps) {
    return (
        <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                {label}
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                    type="text"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="#000000"
                />
            </div>
        </div>
    );
}
