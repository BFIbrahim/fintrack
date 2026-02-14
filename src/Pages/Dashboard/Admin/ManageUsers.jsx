import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineMail, HiOutlineCalendar } from 'react-icons/hi';

const ManageUsers = () => {
    const axiosInstance = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const res = await axiosInstance.get('/users');
            return res.data;
        }
    });

    const { mutate: handleMakeAdmin } = useMutation({
        mutationFn: async (userId) => {
            return await axiosInstance.patch(`/users/admin/${userId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['all-users']);
            Swal.fire({
                title: 'Success!',
                text: 'User has been promoted to Admin.',
                icon: 'success',
                confirmButtonColor: '#6366f1'
            });
        },
        onError: (error) => {
            Swal.fire('Error!', error.response?.data?.message || 'Something went wrong', 'error');
        }
    });

    const confirmAdmin = (user) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to make ${user.name} an admin?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, promote!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleMakeAdmin(user._id);
            }
        });
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    );

    return (
        <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <HiOutlineUserGroup className="text-primary" /> Manage Users
                    </h1>
                    <p className="text-slate-500 font-medium">Total Registered Members: {users.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full border-separate border-spacing-y-2 px-4">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-widest">
                            <tr>
                                <th className="py-5">Member</th>
                                <th>Contact & Role</th>
                                <th>Joined Date</th>
                                <th className="text-center">Permissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/80 transition-all duration-300">
                                    <td className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-2xl ring-2 ring-primary/10">
                                                    <img src={user.profileImage} alt={user.name} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-700">{user.name}</div>
                                                <div className="text-[10px] text-primary font-bold uppercase tracking-widest">ID: {user._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-1 text-slate-500 text-sm">
                                                <HiOutlineMail /> {user.email}
                                            </span>
                                            <span className={`badge border-none font-bold py-3 px-4 rounded-lg text-[10px] ${
                                                user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                                            }`}>
                                                {user.role.toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-slate-600 font-semibold">
                                        <div className="flex items-center gap-2">
                                            <HiOutlineCalendar className="text-slate-400" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {user.role === 'admin' ? (
                                            <div className="flex items-center justify-center gap-1 text-indigo-600 font-black italic text-sm">
                                                <HiOutlineShieldCheck className="text-xl" /> Authorized
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => confirmAdmin(user)}
                                                className="btn btn-sm bg-white border-slate-200 text-slate-700 hover:bg-primary hover:text-white rounded-xl shadow-sm normal-case font-bold"
                                            >
                                                Promote
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;