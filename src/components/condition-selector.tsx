
interface ConditionSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function ConditionSelector({ value, onChange }: ConditionSelectorProps) {
    const conditions = ['BRAND_NEW', 'LIKE_NEW', 'USED_GOOD', 'USED_FAIR'];

    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Condition</label>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                {conditions.map((c) => (
                    <label key={c} className={`flex-1 text-center py-2 text-xs font-medium rounded-md cursor-pointer transition-all ${value === c ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}>
                        <input
                            type="radio"
                            name="condition"
                            value={c}
                            className="hidden"
                            defaultChecked={value === c}
                            onChange={(e) => onChange(e.target.value)}
                        />
                        {c.replace('_', ' ')}
                    </label>
                ))}
            </div>
        </div>
    );
}
