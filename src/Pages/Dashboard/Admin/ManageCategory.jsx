import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiPlus, HiTrash, HiTag, HiOutlineInformationCircle } from "react-icons/hi";
import { MdCategory, MdOutlineAccountBalanceWallet, MdTrendingDown } from "react-icons/md";

import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageCategory = () => {
    const axiosInstance = useAxiosSecure();
    const queryClient = useQueryClient();
    const [filterType, setFilterType] = useState('all');

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axiosInstance.get('/categories');
            return res.data;
        }
    });

    const addMutation = useMutation({
        mutationFn: async (newCategory) => {
            const res = await axiosInstance.post('/categories', newCategory);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            Swal.fire({ title: 'Created!', icon: 'success', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosInstance.delete(`/categories/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            Swal.fire('Deleted!', 'Category has been removed.', 'success');
        }
    });

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const type = form.type.value;

        addMutation.mutate({ name, type });
        form.reset();
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Existing transactions with this category might become 'Uncategorized'.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) deleteMutation.mutate(id);
        });
    };

    const filteredCategories = filterType === 'all' 
        ? categories 
        : categories.filter(cat => cat.type === filterType);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Financial Categories</h2>
                    <p className="text-slate-500 font-medium">Define and manage categories for global user transactions.</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'all' ? 'bg-primary text-white shadow-md' : 'text-slate-500'}`}>All</button>
                    <button onClick={() => setFilterType('income')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'income' ? 'bg-secondary text-white shadow-md' : 'text-slate-500'}`}>Income</button>
                    <button onClick={() => setFilterType('expense')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filterType === 'expense' ? 'bg-red-500 text-white shadow-md' : 'text-slate-500'}`}>Expense</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <HiPlus className="text-xl" />
                            <h3 className="font-black uppercase tracking-widest text-sm">Add New Category</h3>
                        </div>
                        
                        <form onSubmit={handleAddCategory} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                                <div className="relative group">
                                    <HiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input name="name" required placeholder="e.g. Entertainment" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary focus:bg-white transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Flow Type</label>
                                <select name="type" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-700">
                                    <option value="expense">Expense (Outflow)</option>
                                    <option value="income">Income (Inflow)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                                Create Category
                            </button>
                        </form>

                        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                            <HiOutlineInformationCircle className="text-blue-500 text-xl shrink-0" />
                            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                Adding a category here will make it immediately available for all users to select when creating transactions.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCategories.map((category) => (
                                <div key={category._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${category.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-500'}`}>
                                            {category.type === 'income' ? <MdOutlineAccountBalanceWallet size={24} /> : <MdTrendingDown size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{category.name}</h4>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${category.type === 'income' ? 'text-secondary' : 'text-red-400'}`}>
                                                {category.type}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(category._id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <HiTrash size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredCategories.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                            <MdCategory className="mx-auto text-5xl text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold">No categories found in this section.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCategory;