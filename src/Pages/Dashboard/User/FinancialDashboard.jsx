import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
    HiOutlineTrendingUp,
    HiOutlineTrendingDown,
    HiOutlineClock,
    HiOutlineArrowRight
} from 'react-icons/hi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { CiWallet } from 'react-icons/ci';
import { Link } from 'react-router';

const FinancialDashboard = () => {
    const axiosInstance = useAxiosSecure();

    const { data: dbData, isLoading } = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: async () => {
            const res = await axiosInstance.get('/dashboard-summary');
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-bars loading-lg text-primary"></span>
        </div>
    );

    const { summary, recentTransactions } = dbData || {};

    const chartData = [
        { name: 'Income', amount: summary?.income || 0 },
        { name: 'Expense', amount: summary?.expense || 0 },
    ];

    return (
        <div className="p-4 md:p-8 bg-[#F1F5F9] min-h-screen space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-800">Financial Overview</h1>
                <p className="text-slate-500 font-medium">Welcome back! Here's what's happening with your money.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <CiWallet className="absolute -right-4 -bottom-4 text-white/10 text-9xl" />
                    <p className="text-indigo-100 font-bold uppercase tracking-wider text-xs">Current Balance</p>
                    <h2 className="text-4xl font-black mt-2">৳{summary?.balance.toLocaleString()}</h2>
                    <div className="mt-6 flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                        <span className="font-bold">Active Status</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <HiOutlineTrendingUp className="text-2xl" />
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-400 font-bold text-xs uppercase mt-4">Total Income</p>
                        <h2 className="text-3xl font-black text-slate-800">৳{summary?.income.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                            <HiOutlineTrendingDown className="text-2xl" />
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-400 font-bold text-xs uppercase mt-4">Total Expenses</p>
                        <h2 className="text-3xl font-black text-slate-800">৳{summary?.expense.toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            <div>
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 mb-8">Income vs Expense Analysis</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="amount" radius={[12, 12, 12, 12]} barSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800">Recent Transaction</h3>
                    <HiOutlineClock className="text-slate-400 text-xl" />
                </div>
                <div className="space-y-4">
                    {recentTransactions?.length > 0 ? recentTransactions.map((tx) => (
                        <div key={tx._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                    {tx.category.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700 text-sm">{tx.category}</p>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <p className={`font-black text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {tx.type === 'income' ? '+' : '-'}৳{tx.amount}
                            </p>
                        </div>
                    )) : (
                        <p className="text-center text-slate-400 py-10">No recent transactions</p>
                    )}
                    <Link to='/dashboard/transaction' className="btn btn-ghost btn-block mt-4 text-primary font-bold normal-case">
                        View All History <HiOutlineArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;