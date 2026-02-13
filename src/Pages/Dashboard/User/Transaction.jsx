import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    HiPlus, HiPencil, HiTrash, HiSearch, HiFilter,
    HiArrowCircleUp, HiArrowCircleDown, HiViewGrid, HiEye, HiChatAlt2
} from "react-icons/hi";
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Transactions = () => {
    const axiosInstance = useAxiosSecure();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");

    const [editId, setEditId] = useState(null);
    const [viewData, setViewData] = useState(null);

    const { register, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: { type: 'expense' }
    });
    const selectedType = watch("type");

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axiosInstance.get('/categories');
            return res.data;
        }
    });

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['transactions', searchTerm, filterType, filterCategory],
        queryFn: async () => {
            const res = await axiosInstance.get(`/transactions?search=${searchTerm}&type=${filterType}&category=${filterCategory}`);
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (newData) => {
            if (editId) {
                return await axiosInstance.patch(`/transactions/${editId}`, newData);
            }
            return await axiosInstance.post('/transactions', newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            Swal.fire({
                title: 'Success!',
                text: `Transaction ${editId ? 'updated' : 'added'}.`,
                icon: 'success',
                toast: true,
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false
            });
            handleCloseModal();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await axiosInstance.delete(`/transactions/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            Swal.fire({ title: 'Deleted!', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        }
    });

    const onSubmit = (data) => {
        data.amount = parseFloat(data.amount);
        mutation.mutate(data);
    };

    const handleEdit = (transaction) => {
        setEditId(transaction._id);
        setValue('amount', transaction.amount);
        setValue('type', transaction.type);
        setValue('category', transaction.category);
        setValue('note', transaction.note || "");
        setValue('date', new Date(transaction.date).toISOString().split('T')[0]);
        document.getElementById('add_modal').showModal();
    };

    const handleView = (transaction) => {
        setViewData(transaction);
        document.getElementById('view_modal').showModal();
    };

    const handleCloseModal = () => {
        setEditId(null);
        reset({ type: 'expense', amount: '', category: '', note: '', date: '' });
        document.getElementById('add_modal').close();
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(id);
        });
    };

    return (
        <div className="p-4 md:p-8 bg-white rounded-xl min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Transactions</h1>
                    <p className="text-slate-500 font-medium">Manage your financial history</p>
                </div>
                <button
                    onClick={() => document.getElementById('add_modal').showModal()}
                    className="btn bg-primary hover:bg-primary/90 text-white border-none gap-2 shadow-xl shadow-primary/20 px-6 rounded-2xl"
                >
                    <HiPlus className="text-xl" /> Add Transaction
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative group col-span-1">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                    <input type="text" placeholder="Search notes or keywords..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="relative">
                    <HiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none appearance-none font-bold text-slate-600" onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div className="relative">
                    <HiViewGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                    <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none appearance-none font-bold text-slate-600" onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
                        <option value="all">All Categories</option>
                        {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-slate-50">
                            <tr className="text-slate-400 uppercase text-[11px] tracking-widest font-black border-none">
                                <th className="py-5 pl-8">Category & Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th className="text-center pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></td></tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="pl-8 py-4 font-bold text-slate-800">
                                            {t.category}
                                            <div className="text-[11px] text-slate-400">{new Date(t.date).toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            <span className={`flex items-center gap-1.5 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full w-fit ${t.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-500'}`}>
                                                {t.type === 'income' ? <HiArrowCircleUp /> : <HiArrowCircleDown />} {t.type}
                                            </span>
                                        </td>
                                        <td className={`font-black text-lg ${t.type === 'income' ? 'text-secondary' : 'text-red-500'}`}>
                                            ৳{t.amount.toLocaleString()}
                                        </td>
                                        <td className="pr-8 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleView(t)} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all" title="View Details">
                                                    <HiEye className="text-xl" />
                                                </button>
                                                <button onClick={() => handleEdit(t)} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                                                    <HiPencil className="text-xl" />
                                                </button>
                                                <button onClick={() => handleDelete(t._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                                                    <HiTrash className="text-xl" />
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

            <dialog id="add_modal" className="modal">
                <div className="modal-box rounded-3xl p-8 max-w-md">
                    <h3 className="text-2xl font-black text-slate-800 mb-6">{editId ? 'Edit' : 'Add'} Transaction</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                            <input type="number" step="0.01" {...register("amount", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 outline-none focus:border-primary font-bold" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setValue('type', 'expense')} className={`py-3 rounded-2xl font-bold border-2 transition-all ${selectedType === 'expense' ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>Expense</button>
                            <button type="button" onClick={() => setValue('type', 'income')} className={`py-3 rounded-2xl font-bold border-2 transition-all ${selectedType === 'income' ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>Income</button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select {...register("category", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 outline-none font-bold text-slate-700 appearance-none">
                                <option value="">Choose a category</option>
                                {categories.filter(c => c.type === selectedType).map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Note</label>
                            <div className="relative">
                                <HiChatAlt2 className="absolute left-4 top-4 text-slate-400 text-xl" />
                                <textarea {...register("note")} rows="2" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-primary font-medium" placeholder="Describe this transaction..."></textarea>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                            <input type="date" {...register("date", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 outline-none font-bold" />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={handleCloseModal} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl">Cancel</button>
                            <button type="submit" className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20">{editId ? 'Update' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            </dialog>

            <dialog id="view_modal" className="modal">
                <div className="modal-box rounded-3xl p-8 max-w-sm">
                    <h3 className="text-2xl font-black text-slate-800 mb-6">Details</h3>
                    {viewData && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center py-6 bg-slate-50 rounded-3xl">
                                <span className={`text-4xl font-black ${viewData.type === 'income' ? 'text-secondary' : 'text-red-500'}`}>
                                    ৳{viewData.amount.toLocaleString()}
                                </span>
                                <span className="text-xs font-black uppercase text-slate-400 tracking-widest mt-2">{viewData.category}</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-400 font-bold text-xs uppercase">Type</span>
                                    <span className={`text-xs font-black uppercase ${viewData.type === 'income' ? 'text-secondary' : 'text-red-500'}`}>{viewData.type}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-400 font-bold text-xs uppercase">Date</span>
                                    <span className="text-xs font-black text-slate-700">{new Date(viewData.date).toLocaleDateString()}</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-slate-400 font-bold text-xs uppercase">Note</span>
                                    <p className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 font-medium min-h-[60px]">
                                        {viewData.note || "No notes provided for this transaction."}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => document.getElementById('view_modal').close()} className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl">Close</button>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Transactions;