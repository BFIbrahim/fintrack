import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiUser, HiCamera, HiChartBar, HiShieldCheck, HiEye, HiEyeOff } from "react-icons/hi";
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxios from '../../hooks/useAxios';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../Context/AuthContext';

const SignUp = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const { loginUser, refetchUser } = useContext(AuthContext);
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    
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
                timer: 2000
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

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 bg-[#2563EB] text-white p-12 flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#grid)" /><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" /></pattern></defs></svg>
                </div>
                <div className="relative z-10 space-y-8">
                    <h2 className="text-5xl font-extrabold leading-tight">Start Your Journey <br /> <span className="text-[#10B981]">With FinTrack.</span></h2>
                    <div className="space-y-6 pt-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl text-2xl"><HiChartBar /></div>
                            <div><p className="font-bold text-lg">Real-time Analytics</p><p className="text-sm text-blue-100 opacity-80">Watch your net worth grow.</p></div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/10 rounded-xl text-2xl"><HiShieldCheck /></div>
                            <div><p className="font-bold text-lg">Secure Encryption</p><p className="text-sm text-blue-100 opacity-80">Private and encrypted data.</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 bg-base-100">
                <div className="card w-full max-w-md bg-base-100">
                    <div className="card-body p-0 md:p-8">
                        <div className="mb-6 text-center md:text-left">
                            <h1 className="text-3xl font-bold italic text-primary">FinTrack</h1>
                            <h2 className="text-3xl font-bold">Create Account</h2>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex flex-col items-center mb-4">
                                <div className="relative">
                                    <div className="avatar">
                                        <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-2 overflow-hidden bg-gray-100">
                                            {preview ? <img src={preview} alt="Profile" /> : <div className="flex items-center justify-center h-full text-gray-400"><HiUser size={48} /></div>}
                                        </div>
                                    </div>
                                    <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-secondary/85 p-2 rounded-full text-white cursor-pointer hover:bg-secondary transition-all shadow-lg">
                                        <HiCamera size={18} />
                                        <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label-text font-semibold mb-2">Full Name</label>
                                <div className="relative">
                                    <HiUser className="absolute left-3 top-3.5 text-xl text-gray-400 z-10" />
                                    <input type="text" placeholder="John Doe" className="input input-bordered w-full pl-10" {...register("fullName", { required: "Name is required" })} />
                                </div>
                                {errors.fullName && <span className="text-error text-xs">{errors.fullName.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label-text font-semibold mb-2">Email</label>
                                <div className="relative">
                                    <HiMail className="absolute left-3 top-3.5 text-xl text-gray-400 z-10" />
                                    <input type="email" placeholder="name@company.com" className="input input-bordered w-full pl-10" {...register("email", { required: "Email is required" })} />
                                </div>
                                {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label-text font-semibold mb-2">Password</label>
                                <div className="relative">
                                    <HiLockClosed className="absolute left-3 top-3.5 text-xl text-gray-400 z-10" />
                                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="input input-bordered w-full pl-10" {...register("password", { required: "Min 6 chars", minLength: 6 })} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 text-xl">{showPassword ? <HiEyeOff /> : <HiEye />}</button>
                                </div>
                                {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
                            </div>
                            <button type="submit" disabled={registerMutation.isPending} className="btn btn-primary w-full text-white mt-4">
                                {registerMutation.isPending ? <span className="loading loading-spinner"></span> : "Sign Up"}
                            </button>
                        </form>
                        <footer className="text-center mt-6 text-sm">
                            Already have an account? <Link to="/" className="font-bold text-[#10B981] hover:underline">Sign In</Link>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;