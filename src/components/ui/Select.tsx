import React from "react";

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    className?: string;
}

export const Select: React.FC<SelectProps> = ({
    options,
    label,
    placeholder,
    className = "",
    id,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2)}`;

    return (
        <div className="flex flex-col gap-2 w-full ">
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                {...props}
                className={`h-10 w-full rounded-xl border border-slate-300 bg-white px-2 text-sm 
                            focus:border-blue-100 focus:ring-2 focus:ring-blue-200 outline-none ${className} disabled:cursor-not-allowed disabled:bg-gray-100`}
            >
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
