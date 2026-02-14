import React, { useState, useContext, useEffect } from 'react'; 
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiChartBar, HiShieldCheck } from "react-icons/hi";
import { MdTrendingUp } from "react-icons/md";
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../../hooks/useAxios';
import { AuthContext } from '../../Context/AuthContext';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { user, loading, loginUser, refetchUser } = useContext(AuthContext); 
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const loginMutation = useMutation({
        mutationFn: async (loginData) => {
            const response = await axiosInstance.post('/login', loginData);
            return response.data;
        },
        onSuccess: (data) => {
            loginUser(data.user, data.token);
            refetchUser();

            Swal.fire({
                title: 'Welcome Back!',
                text: 'Login successful.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });

            navigate('/dashboard'); 
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || "Invalid Email or Password!";
            Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
        }
    });

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
            <div className="hidden md:flex md:w-1/2 bg-primary text-white p-16 flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-12">
                        <div className="bg-white p-2 rounded-xl shadow-lg">
                            <MdTrendingUp className="text-primary text-2xl" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight italic">
                            Fin<span className="text-accent">Track</span>
                        </h1>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-6xl font-black leading-[1.1] tracking-tighter">
                            Control your <br />
                            <span className="text-secondary italic">financial</span> destiny.
                        </h2>
                        <p className="text-lg text-white max-w-md leading-relaxed">
                            Join thousands of users managing their wealth with bank-grade security and real-time insights.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-8 pt-12 border-t border-white/10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-secondary">
                            <HiChartBar className="text-xl" />
                            <span className="font-bold tracking-wide uppercase text-xs">Analytics</span>
                        </div>
                        <p className="text-sm text-blue-50">Visual profit & expense tracking.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-secondary">
                            <HiShieldCheck className="text-xl" />
                            <span className="font-bold tracking-wide uppercase text-xs">Security</span>
                        </div>
                        <p className="text-sm text-blue-50">256-bit AES data encryption.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-white">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-8 md:hidden">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <MdTrendingUp className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-black tracking-tight italic text-primary">FinTrack</span>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Please enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    {...register("email", { required: "Email is required" })} 
                                    className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 ${errors.email ? 'border-red-400' : ''}`} 
                                />
                            </div>
                            {errors.email && <span className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                            </div>
                            <div className="relative group">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 ${errors.password ? 'border-red-400' : ''}`} 
                                {...register("password", { required: "Password is required" })} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors text-xl"
                                >
                                    {showPassword ? <HiEyeOff /> : <HiEye />}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-500 text-xs font-bold ml-1">{errors.password.message}</span>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loginMutation.isPending} 
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 text-lg mt-8"
                        >
                            {loginMutation.isPending ? <span className="loading loading-spinner loading-md"></span> : "Sign In to Account"}
                        </button>
                    </form>

                    <p className="text-center mt-10 text-slate-500 font-semibold">
                        Don't have an account? <Link to="/signup" className="text-secondary font-black hover:underline underline-offset-4">Create one for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;