import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiChartBar, HiShieldCheck } from "react-icons/hi";
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../../hooks/useAxios';
import { AuthContext } from '../../Context/AuthContext';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { loginUser, refetchUser } = useContext(AuthContext);
    const axiosInstance = useAxios();
    const navigate = useNavigate();

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
                showConfirmButton: false
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

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 bg-[#2563EB] text-white p-12 flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#grid)" /><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" /></pattern></defs></svg>
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-extrabold leading-tight">
                            Smart Money <br />
                            <span className="text-[#10B981]">Management.</span>
                        </h2>
                    </div>
                    <div className="space-y-6 pt-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl text-2xl"><HiChartBar /></div>
                            <div>
                                <p className="font-bold text-lg">Real-time Analytics</p>
                                <p className="text-sm text-blue-100 opacity-80">Watch your net worth grow in real-time.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl text-2xl"><HiShieldCheck /></div>
                            <div>
                                <p className="font-bold text-lg">Secure Encryption</p>
                                <p className="text-sm text-blue-100 opacity-80">Bank-grade security for your peace of mind.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 bg-base-100">
                <div className="card w-full max-w-md bg-base-100">
                    <div className="card-body p-0 md:p-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight italic text-primary">FinTrack</h1>
                            <h2 className="text-3xl font-bold">Welcome Back</h2>
                            <p className="text-gray-500 mt-2 text-sm">Please enter your details to sign in.</p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Email</span></label>
                                <div className="relative">
                                    <HiMail className="absolute left-3 top-3.5 text-xl text-gray-400 z-10" />
                                    <input type="email" placeholder="name@company.com" {...register("email", { required: "Email is required" })} className={`input input-bordered w-full pl-10 focus:outline-none focus:border-[#2563EB] ${errors.email ? 'border-error' : ''}`} />
                                </div>
                                {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-semibold">Password</span></label>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3 top-3.5 text-xl text-gray-400 z-10" />
                                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={`input input-bordered w-full pl-10 pr-10 focus:outline-none focus:border-[#2563EB] ${errors.password ? 'border-error' : ''}`} {...register("password", { required: "Password is required" })} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 text-xl">{showPassword ? <HiEyeOff /> : <HiEye />}</button>
                                </div>
                                {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                            </div>
                            <button type="submit" disabled={loginMutation.isPending} className="btn bg-primary hover:bg-primary/80 text-white border-none w-full normal-case text-base shadow-lg">
                                {loginMutation.isPending ? <span className="loading loading-spinner"></span> : "Sign In"}
                            </button>
                        </form>
                        <footer className="text-center mt-6 text-sm text-gray-600">
                            New here? <Link to="/signup" className="font-bold text-[#10B981] hover:underline">Create an Account</Link>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;