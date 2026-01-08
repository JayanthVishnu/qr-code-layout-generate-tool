
import React, { useState, useEffect } from 'react';
import type { EntitySchema } from 'qrlayout-ui';
import { Save, User, FileText, Calendar, Briefcase, Hash } from 'lucide-react';

interface EmployeeFormProps {
    schema: EntitySchema;
    initialData?: any;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
    schema,
    initialData,
    onSubmit,
    onCancel
}) => {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            const empty: any = {};
            schema.fields.forEach(f => empty[f.name] = '');
            setFormData(empty);
        }
    }, [initialData, schema]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const getIconForField = (fieldName: string) => {
        const lower = fieldName.toLowerCase();
        if (lower.includes('name')) return <User className="h-4 w-4 text-gray-400" />;
        if (lower.includes('date')) return <Calendar className="h-4 w-4 text-gray-400" />;
        if (lower.includes('id')) return <Hash className="h-4 w-4 text-gray-400" />;
        if (lower.includes('department') || lower.includes('role')) return <Briefcase className="h-4 w-4 text-gray-400" />;
        return <FileText className="h-4 w-4 text-gray-400" />;
    };

    const getInputType = (fieldName: string) => {
        const lower = fieldName.toLowerCase();
        if (lower.includes('date')) return 'date';
        if (lower.includes('email')) return 'email';
        return 'text';
    };

    // Helper options for specific fields (could be moved to schema in future)
    const getOptionsForField = (fieldName: string) => {
        if (fieldName === 'department') {
            return ["Engineering", "Design", "Product", "HR", "Marketing", "Sales", "Operations"];
        }
        return null;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schema.fields.map((field) => {
                    const options = getOptionsForField(field.name);

                    return (
                        <div key={field.name} className="col-span-1">
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1.5">
                                {field.label}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500">
                                    {getIconForField(field.name)}
                                </div>
                                {options ? (
                                    <select
                                        id={field.name}
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm hover:bg-slate-100"
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                    >
                                        <option value="">Select {field.label}</option>
                                        {options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={getInputType(field.name)}
                                        id={field.name}
                                        required
                                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all shadow-sm hover:bg-slate-100"
                                        placeholder={`Enter ${field.label}`}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-2.5 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-medium border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </form>
    );
};
