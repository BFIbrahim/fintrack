import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    HiPlus,
    HiPencil,
    HiTrash,
    HiSearch,
    HiFilter,
    HiArrowCircleUp,   // HiArrowUpCircle এর বদলে
    HiArrowCircleDown  // HiArrowDownCircle এর বদলে
} from "react-icons/hi";
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Transactions = () => {
    const axiosInstance = useAxiosSecure();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    // --- ১. ডাটা ফেচ করা (Get Transactions) ---
    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['transactions', searchTerm, filterType],
        queryFn: async () => {
            const res = await axiosInstance.get(`/api/transactions?search=${searchTerm}&type=${filterType}`);
            return res.data;
        }
    });

    // --- ২. ট্রানজেকশন ডিলিট করা (Delete Mutation) ---
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await axiosInstance.delete(`/api/transactions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            Swal.fire('Deleted!', 'Transaction has been removed.', 'success');
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10B981', // Primary Green
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    // --- ৩. নতুন ট্রানজেকশন অ্যাড করার জন্য মডাল লজিক (Add Transaction) ---
    // নোট: এখানে একটি সিম্পল DaisyUI মডাল ট্রিগার দেখানো হয়েছে।
    const handleAddTransaction = () => {
        document.getElementById('add_modal').showModal();
    };

    return (
        <div className="p-4 md:p-8 bg-white rounded-xl min-h-screen hover:shadow-xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-accent">Transactions</h1>
                    <p className="text-slate-500">Monitor your income and expenses</p>
                </div>
                <button
                    onClick={handleAddTransaction}
                    className="btn btn-primary text-white gap-2 shadow-lg"
                >
                    <HiPlus className="text-xl" /> Add Transaction
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative col-span-1 md:col-span-1">
                    <HiSearch className="absolute left-3 top-3.5 text-slate-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Search notes or category..."
                        className="input input-bordered w-full pl-10 focus:outline-primary"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 col-span-1 md:col-span-2">
                    <select
                        className="select select-bordered w-full md:w-48 focus:outline-primary"
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="income">Only Income</option>
                        <option value="expense">Only Expense</option>
                    </select>

                    <button className="btn btn-ghost border-slate-300 gap-2 hidden md:flex">
                        <HiFilter /> More Filters
                    </button>
                </div>
            </div>

            {/* Transactions Table/List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="table w-full table-zebra">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th>Category & Date</th>
                                <th>Note</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span></td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-slate-400">No transactions found.</td></tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                                        <td>
                                            <div className="font-bold text-accent">{t.category}</div>
                                            <div className="text-xs opacity-50">{new Date(t.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="max-w-xs truncate">{t.note || "---"}</td>
                                        <td>
                                            {t.type === 'income' ? (
                                                <div className="badge badge-success gap-1 text-white py-3">
                                                    <HiArrowUpCircle /> Income
                                                </div>
                                            ) : (
                                                <div className="badge badge-error gap-1 text-white py-3">
                                                    <HiArrowDownCircle /> Expense
                                                </div>
                                            )}
                                        </td>
                                        <td className={`font-bold text-lg ${t.type === 'income' ? 'text-primary' : 'text-error'}`}>
                                            {t.type === 'income' ? '+' : '-'} ৳{t.amount.toLocaleString()}
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button className="btn btn-square btn-sm btn-ghost text-secondary hover:bg-blue-50">
                                                    <HiPencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t._id)}
                                                    className="btn btn-square btn-sm btn-ghost text-error hover:bg-red-50"
                                                >
                                                    <HiTrash size={18} />
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

            {/* DaisyUI Modal for Adding/Editing */}
            <dialog id="add_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-accent">Add New Transaction</h3>
                    <p className="py-2 text-sm text-slate-500">Keep track of your spending habits.</p>

                    {/* Add Transaction Form Here */}
                    <div className="space-y-4 mt-4">
                        {/* Form Inputs (Amount, Type, Category etc) */}
                    </div>

                    <div className="modal-action">
                        <form method="dialog" className="flex gap-2">
                            <button className="btn">Close</button>
                            <button className="btn btn-primary text-white">Save Transaction</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Transactions;