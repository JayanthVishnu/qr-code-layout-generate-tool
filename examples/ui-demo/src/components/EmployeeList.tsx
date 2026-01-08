
import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Plus, X, Search, Printer, Eye, User } from 'lucide-react';
import type { Employee } from '../modules/storage';
import { StickerPrinter, type StickerLayout, type EntitySchema } from 'qrlayout-ui';
import { EmployeeForm } from './EmployeeForm';

interface EmployeeListProps {
    employees: Employee[];
    layouts: StickerLayout[];
    schema: EntitySchema;
    onAdd: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (id: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
    employees,
    layouts,
    schema,
    onAdd,
    onEdit,
    onDelete
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string>('');


    const canvasRef = useRef<HTMLCanvasElement>(null);
    const printerRef = useRef<StickerPrinter | null>(null);

    useEffect(() => {
        printerRef.current = new StickerPrinter();
    }, []);

    useEffect(() => {
        if (isPrintModalOpen && selectedLayoutId && selectedEmployee && canvasRef.current && printerRef.current) {
            const layout = layouts.find(l => l.id === selectedLayoutId);
            if (layout) {
                printerRef.current.renderToCanvas(layout, selectedEmployee as any, canvasRef.current);
            }
        }
    }, [isPrintModalOpen, selectedLayoutId, selectedEmployee, layouts]);

    const handleOpenModal = (employee?: Employee) => {
        if (employee) {
            setEditingEmployee(employee);
        } else {
            setEditingEmployee(null);
        }
        setIsModalOpen(true);
    };

    const handleOpenPrintModal = (employee: Employee) => {
        setSelectedEmployee(employee);
        // Default to first available layout if any
        if (layouts.length > 0) {
            setSelectedLayoutId(layouts[0].id);
        }
        setIsPrintModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEmployee(null);
    };

    const handleClosePrintModal = () => {
        setIsPrintModalOpen(false);
        setSelectedEmployee(null);
        setSelectedLayoutId('');
    };

    const handleFormSubmit = (data: any) => {
        const employeeData = {
            ...data,
            id: editingEmployee?.id || crypto.randomUUID(),
        };

        if (editingEmployee) {
            onEdit(employeeData);
        } else {
            onAdd(employeeData);
        }
        handleCloseModal();
    };

    const filteredEmployees = employees.filter(emp =>
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Employee Directory</h1>
                    <p className="text-gray-500 mt-1">Manage and organize your workforce data</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flexItems-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer flex"
                >
                    <Plus size={20} />
                    <span>Add Employee</span>
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search employees by name, ID, or department..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider">Employee Info</th>
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider">Department</th>
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider">Join Date</th>
                            <th className="px-6 py-5 font-semibold text-gray-900 text-sm uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                                            <User size={32} className="text-gray-300" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">No employees found</p>
                                        <p className="text-sm">Try adjusting your search or add a new employee.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="group hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                                                {emp.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{emp.fullName}</div>
                                                <div className="text-sm text-gray-500 font-mono">{emp.employeeId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {emp.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {new Date(emp.joinDate).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenPrintModal(emp)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                                title="Print Label"
                                            >
                                                <Printer size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(emp)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                                title="Edit Details"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Remove ${emp.fullName} from directory?`)) {
                                                        onDelete(emp.id);
                                                    }
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="Remove Employee"
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

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="bg-white px-6 pt-6 pb-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold leading-6 text-gray-900" id="modal-title">
                                        {editingEmployee ? 'Edit Employee' : 'New Employee'}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer rounded-full p-1 hover:bg-gray-100"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <EmployeeForm
                                    schema={schema}
                                    initialData={editingEmployee}
                                    onSubmit={handleFormSubmit}
                                    onCancel={handleCloseModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Preview Modal */}
            {isPrintModalOpen && selectedEmployee && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="print-modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={handleClosePrintModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-xl font-bold leading-6 text-gray-900" id="print-modal-title">
                                        Print Label for {selectedEmployee.fullName}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleClosePrintModal}
                                        className="text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Layout Template
                                        </label>
                                        <select
                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                                            value={selectedLayoutId}
                                            onChange={(e) => setSelectedLayoutId(e.target.value)}
                                        >
                                            {layouts.length === 0 && <option value="">No templates available</option>}
                                            {layouts.map(layout => (
                                                <option key={layout.id} value={layout.id}>
                                                    {layout.name} ({layout.width}x{layout.height}{layout.unit})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-center min-h-[300px] border border-gray-200">
                                        {selectedLayoutId ? (
                                            <div className="shadow-lg">
                                                <canvas ref={canvasRef} className="max-w-full h-auto" />
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <Eye size={48} className="mx-auto mb-2 opacity-50" />
                                                <p>Select a layout to see preview</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                                    onClick={() => {
                                        // Simple print trigger for now
                                        const win = window.open('', 'Print', 'height=600,width=800');
                                        if (win && canvasRef.current) {
                                            win.document.write(`<img src="${canvasRef.current.toDataURL()}" onload="window.print();window.close()" />`);
                                            win.document.close();
                                        }
                                    }}
                                    disabled={!selectedLayoutId}
                                >
                                    <Printer size={16} className="mr-2" />
                                    Print Label
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                                    onClick={handleClosePrintModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
