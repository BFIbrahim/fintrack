import React from 'react';
import { Link } from 'react-router';
import { HiShieldExclamation } from 'react-icons/hi';
import { MdOutlineArrowBack } from 'react-icons/md';

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="relative flex justify-center mb-8">
                    <div className="absolute inset-0 bg-red-200 blur-3xl rounded-full opacity-30 animate-pulse"></div>
                    <div className="relative bg-white p-6 rounded-[2.5rem] shadow-xl shadow-red-100 border border-red-50">
                        <HiShieldExclamation className="text-8xl text-red-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
                    403 - Forbidden
                </h1>
                
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    Access Denied! You don't have the necessary permissions to view this administrative page. 
                    Please contact your system manager if you believe this is an error.
                </p>

                <Link 
                    to="/dashboard" 
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-primary/25 group"
                >
                    <MdOutlineArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                        FinTrack Security System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;