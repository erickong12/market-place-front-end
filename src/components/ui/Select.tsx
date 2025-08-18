import React from "react";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    label?: string;
}

export const Select: React.FC<SelectProps> = ({ options, label, ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                {...props}
                className={`h-10 w-full rounded-xl border border-slate-300 bg-white px-2 text-sm focus:border-blue-100 focus:ring-2 focus:ring-blue-200 outline-none`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
