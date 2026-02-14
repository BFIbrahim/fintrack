import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { HiLightBulb, HiSparkles, HiTrendingUp, HiShieldCheck } from 'react-icons/hi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

ChartJS.register(
    ArcElement, CategoryScale, LinearScale, BarElement, 
    PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const Analytics = () => {
    const axiosInstance = useAxiosSecure();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['smart-insights'],
        queryFn: async () => {
            const res = await axiosInstance.get('/insights');
            return res.data;
        }
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <span className="loading loading-ring loading-lg text-primary"></span>
            <p className="text-slate-400 font-bold animate-pulse">Analyzing your finances...</p>
        </div>
    );

    const categoryLabels = stats?.categoryData?.map(d => d._id) || [];
    const categoryValues = stats?.categoryData?.map(d => d.value) || [];

    const pieData = {
        labels: categoryLabels,
        datasets: [{
            data: categoryValues,
            backgroundColor: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'],
            borderWidth: 0,
            hoverOffset: 20
        }]
    };

    const barData = {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Amount (৳)',
            data: [stats?.ratio?.income || 0, stats?.ratio?.expense || 0],
            backgroundColor: ['#10b981', '#f43f5e'],
            borderRadius: 12,
            barThickness: 50,
        }]
    };

    const lineData = {
        labels: ['Target', 'Current Savings'],
        datasets: [{
            fill: true,
            label: 'Savings Progress',
            data: [stats?.savings?.totalTarget, stats?.savings?.totalSaved],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4,
            pointRadius: 6,
        }]
    };

    return (
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <HiSparkles className="text-primary text-2xl" />
                        <h1 className="text-3xl font-black text-slate-800">Smart Insights</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Real-time analysis of your spending and savings.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-slate-600">Fintrack Analysis Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats?.insights.map((insight, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all group">
                        <div className="p-3 bg-indigo-50 text-primary rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                            <HiLightBulb className="text-xl" />
                        </div>
                        <p className="font-bold text-slate-700 text-sm leading-relaxed">{insight}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-primary rounded-full"></span> 
                        Top Expenses
                    </h2>
                    <div className="h-64 flex items-center justify-center">
                        <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-secondary rounded-full"></span> 
                        Income Ratio
                    </h2>
                    <div className="h-64">
                        <Bar data={barData} options={{ 
                            plugins: { legend: { display: false } }, 
                            maintainAspectRatio: false,
                            scales: { y: { display: false }, x: { grid: { display: false } } }
                        }} />
                    </div>
                </div>

                <div className="lg:col-span-1 bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                    <HiShieldCheck className="absolute -right-4 -bottom-4 text-white/10 text-9xl rotate-12" />
                    <h2 className="text-lg font-black mb-6">Savings Behavior</h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Total Saved</p>
                            <h3 className="text-4xl font-black">৳{stats?.savings?.totalSaved.toLocaleString()}</h3>
                        </div>
                        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                            <div 
                                className="bg-white h-full transition-all duration-1000" 
                                style={{ width: `${(stats?.savings?.totalSaved / stats?.savings?.totalTarget) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm font-medium text-white/80">
                            Target: ৳{stats?.savings?.totalTarget.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <HiTrendingUp className="text-primary text-xl" />
                    Spending Patterns
                </h2>
                <div className="h-64">
                    <Line data={lineData} options={{ 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
                    }} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;