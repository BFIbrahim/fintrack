import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiUser, HiCamera, HiChartBar, HiShieldCheck, HiEye, HiEyeOff } from "react-icons/hi";
import { MdTrendingUp } from "react-icons/md";
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../../hooks/useAxios';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const SignUp = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { user, loading, loginUser, refetchUser } = useContext(AuthContext);
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const uploadImageToImgbb = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (!data.success) throw new Error("Image upload failed");
        return data.data.url;
    };

    const registerMutation = useMutation({
        mutationFn: async (formData) => {
            const photoURL = await uploadImageToImgbb(formData.profileImageFile);
            const payload = {
                name: formData.fullName,
                email: formData.email,
                profileImage: photoURL,
                password: formData.password,
            };
            const response = await axiosInstance.post('/register', payload);
            return response.data;
        },
        onSuccess: (data) => {
            loginUser(data.user, data.token);
            refetchUser();
            Swal.fire({
                title: 'Success!',
                text: 'Your account has been created successfully.',
                icon: 'success',
                timer: 2000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
            });
            navigate('/dashboard');
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.message || "Registration failed!";
            Swal.fire({ title: 'Error!', text: errorMsg, icon: 'error' });
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = (data) => {
        if (!selectedFile) {
            Swal.fire('Info', 'Please upload a profile photo', 'info');
            return;
        }
        registerMutation.mutate({ ...data, profileImageFile: selectedFile });
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
                            Start Your <br />
                            <span className="text-secondary italic">Wealth</span> Journey.
                        </h2>
                        <p className="text-lg text-blue-100/80 max-w-md leading-relaxed">
                            Join thousands of smart investors managing their assets with precision and ease.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-8 border-t border-white/10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-secondary">
                            <HiChartBar className="text-xl" />
                            <span className="font-bold tracking-wide uppercase text-xs">Growth</span>
                        </div>
                        <p className="text-sm text-blue-50">Watch your net worth expand.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-secondary">
                            <HiShieldCheck className="text-xl" />
                            <span className="font-bold tracking-wide uppercase text-xs">Privacy</span>
                        </div>
                        <p className="text-sm text-blue-50">Bank-grade data encryption.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-20 bg-white">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-8 md:hidden">
                        <div className="bg-primary p-1.5 rounded-lg text-white">
                            <MdTrendingUp size={20} />
                        </div>
                        <span className="text-2xl font-black tracking-tight italic text-primary">FinTrack</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Create Account</h2>
                        <p className="text-slate-500 font-medium">Join us and start tracking your finances today.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className="avatar ring-offset-base-100 ring-offset-4 ring-2 ring-primary/20 rounded-full transition-all group-hover:ring-primary/40">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 relative">
                                        {preview ? (
                                            <img src={preview} alt="Profile" className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-300">
                                                <HiUser size={48} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-xl cursor-pointer hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 border-4 border-white">
                                    <HiCamera size={18} />
                                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>
                            <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest text-center">Upload Profile Photo</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <div className="relative group">
                                <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    {...register("fullName", { required: "Name is required" })}
                                    className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 ${errors.fullName ? 'border-red-400' : ''}`}
                                />
                            </div>
                            {errors.fullName && <span className="text-red-500 text-xs font-bold ml-1">{errors.fullName.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    {...register("email", { required: "Email is required" })}
                                    className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 ${errors.email ? 'border-red-400' : ''}`}
                                />
                            </div>
                            {errors.email && <span className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative group">
                                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 outline-none transition-all focus:border-primary focus:bg-white focus:shadow-xl focus:shadow-primary/5 ${errors.password ? 'border-red-400' : ''}`}
                                    {...register("password", { required: "Min 6 chars", minLength: 6 })}
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
                            disabled={registerMutation.isPending}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-lg mt-4"
                        >
                            {registerMutation.isPending ? <span className="loading loading-spinner"></span> : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-slate-500 font-semibold">
                        Already have an account? <Link to="/" className="text-secondary font-black hover:underline underline-offset-4">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;