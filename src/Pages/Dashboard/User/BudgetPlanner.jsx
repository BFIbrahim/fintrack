import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    HiPlus, HiFlag, HiClock, HiTrash, HiCheckCircle, HiTrendingUp
} from "react-icons/hi";
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { RxCross2 } from 'react-icons/rx';

const BudgetPlanner = () => {
    const axiosInstance = useAxiosSecure();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm();

    const [activeGoalId, setActiveGoalId] = useState(null);

    const { data: goals = [], isLoading } = useQuery({
        queryKey: ['savings-goals'],
        queryFn: async () => {
            const res = await axiosInstance.get('/goals');
            return res.data;
        }
    });

    const addGoalMutation = useMutation({
        mutationFn: (newGoal) => axiosInstance.post('/goals', newGoal),
        onSuccess: () => {
            queryClient.invalidateQueries(['savings-goals']);
            document.getElementById('goal_modal').close();
            reset();
            Swal.fire({ title: 'Goal Set!', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        }
    });

    const contributionMutation = useMutation({
        mutationFn: async ({ id, amount }) => {
            return await axiosInstance.patch(`/goals/${id}/contribute`, { amount: parseFloat(amount) });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['savings-goals']);
            setActiveGoalId(null);
            Swal.fire({ title: 'Savings Updated!', icon: 'success', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });

    const deleteGoalMutation = useMutation({
        mutationFn: (id) => axiosInstance.delete(`/goals/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['savings-goals']);
            Swal.fire({ title: 'Deleted!', icon: 'success', toast: true, position: 'top-end', timer: 1500, showConfirmButton: false });
        }
    });

    const onSubmit = (data) => addGoalMutation.mutate(data);

    const handleAddCash = (id, e) => {
        e.preventDefault();
        const amount = e.target.contributionAmount.value;
        if (amount > 0) {
            contributionMutation.mutate({ id, amount });
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This goal and its progress will be permanently removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteGoalMutation.mutate(id);
            }
        });
    };

    const totalTarget = goals.reduce((acc, curr) => acc + curr.targetAmount, 0);
    const totalSaved = goals.reduce((acc, curr) => acc + (curr.currentAmount || 0), 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Savings Goals</h1>
                    <p className="text-slate-500 font-medium">Dream big, save smart.</p>
                </div>
                <button
                    onClick={() => document.getElementById('goal_modal').showModal()}
                    className="btn bg-primary hover:bg-primary/90 text-white border-none px-6 rounded-2xl shadow-lg shadow-primary/20"
                >
                    <HiPlus className="text-xl" /> Create New Goal
                </button>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
                <div className="radial-progress text-primary" style={{ "--value": overallProgress, "--size": "8rem", "--thickness": "12px" }} role="progressbar">
                    <span className="text-xl font-black text-slate-800">{overallProgress.toFixed(0)}%</span>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Goal</p>
                        <h2 className="text-2xl font-black text-slate-800">৳{totalTarget.toLocaleString()}</h2>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Saved</p>
                        <h2 className="text-2xl font-black text-secondary">৳{totalSaved.toLocaleString()}</h2>
                    </div>
                    <div className="space-y-1">
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Remaining</p>
                        <h2 className="text-2xl font-black text-red-500">৳{(totalTarget - totalSaved).toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
                ) : (
                    goals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const remaining = goal.targetAmount - goal.currentAmount;
                        const isAchieved = progress >= 100;

                        return (
                            <div key={goal._id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <HiFlag className="text-2xl" />
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(goal._id)} 
                                        className="p-2 text-slate-300 hover:text-red-500 rounded-xl transition-colors"
                                    >
                                        <HiTrash className="text-xl" />
                                    </button>
                                </div>

                                <h3 className="text-xl font-black text-slate-800 mb-1">{goal.title}</h3>
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                                    <HiClock />
                                    <span>Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Progress</span>
                                        <span className="text-sm font-black text-primary">{progress.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Saved</p>
                                            <p className="font-black text-slate-700">৳{goal.currentAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Needed</p>
                                            <p className="font-black text-red-400">৳{Math.max(remaining, 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-50">
                                    {isAchieved ? (
                                        <div className="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-600 rounded-2xl font-bold text-sm border border-green-100">
                                            <HiCheckCircle className="text-lg" /> Goal Achieved!
                                        </div>
                                    ) : (
                                        <>
                                            {activeGoalId === goal._id ? (
                                                <form
                                                    onSubmit={(e) => handleAddCash(goal._id, e)}
                                                    className="flex items-center gap-1 animate-in fade-in slide-in-from-top-1 w-full"
                                                >
                                                    <input
                                                        name="contributionAmount"
                                                        type="number"
                                                        placeholder="Amount"
                                                        required
                                                        className="min-w-0 flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-2 text-sm focus:border-primary outline-none font-bold"
                                                    />
                                                    <button type="submit" disabled={contributionMutation.isPending} className="btn btn-sm h-9 bg-primary border-none text-white rounded-xl px-3 min-h-0">
                                                        Add
                                                    </button>
                                                    <button type="button" onClick={() => setActiveGoalId(null)} className="btn btn-sm h-9 bg-red-400 text-white rounded-xl px-2 min-h-0">
                                                        <RxCross2 />
                                                    </button>
                                                </form>
                                            ) : (
                                                <button
                                                    onClick={() => setActiveGoalId(goal._id)}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-600 rounded-2xl font-bold text-sm transition-all"
                                                >
                                                    <HiTrendingUp className="text-lg" /> Deposit Cash
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <dialog id="goal_modal" className="modal">
                <div className="modal-box rounded-[2.5rem] p-8 max-w-md">
                    <h3 className="text-2xl font-black text-slate-800 mb-6">Set Savings Goal</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1">What are you saving for?</label>
                            <input type="text" {...register("title", { required: true })} placeholder="e.g. 2026 Hajj Fund" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 outline-none focus:border-primary font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1">Target Amount (BDT)</label>
                            <input type="number" {...register("targetAmount", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 outline-none focus:border-primary font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1">Deadline</label>
                            <input type="date" {...register("deadline", { required: true })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 outline-none focus:border-primary font-bold" />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => document.getElementById('goal_modal').close()} className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl">Cancel</button>
                            <button type="submit" className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20">Set Goal</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default BudgetPlanner;