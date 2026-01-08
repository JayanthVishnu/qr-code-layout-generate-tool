import React from 'react';
import type { StickerLayout } from 'qrlayout-ui';
import { Edit2, Trash2, Plus, QrCode, Layout, Smartphone } from 'lucide-react';

interface LabelListProps {
    labels: StickerLayout[];
    onCreateNew: () => void;
    onEdit: (label: StickerLayout) => void;
    onDelete: (id: string) => void;
}

export const LabelList: React.FC<LabelListProps> = ({
    labels,
    onCreateNew,
    onEdit,
    onDelete
}) => {
    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Label Templates</h1>
                    <p className="text-gray-500 mt-1">Design and manage your QR code layouts</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                >
                    <Plus size={20} />
                    <span>Create New Label</span>
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider">Template Name</th>
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider">Target Entity</th>
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider">Dimensions</th>
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider">Elements</th>
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {labels.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                                            <QrCode size={32} className="text-gray-300" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">No label templates found</p>
                                        <p className="text-sm">Create your first layout to get started.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            labels.map((label) => (
                                <tr key={label.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Layout size={20} />
                                            </div>
                                            <div className="font-semibold text-gray-900">{label.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize border border-gray-200">
                                            <Smartphone size={12} />
                                            {label.targetEntity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm font-mono">
                                        {label.width}{label.unit} × {label.height}{label.unit}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                            {label.elements.length} items
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(label)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                title="Edit Layout"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to delete "${label.name}"?`)) {
                                                        onDelete(label.id);
                                                    }
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="Delete Layout"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
