"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase"; 
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <nav className='px-6 py-6 border-b-2 border-white mb-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <Image
                        src="/malamute.png"
                        alt="malamute"
                        quality={100}
                        width={50}
                        height={50}
                    />
                </div>
                <div className='flex items-center gap-3'>
                    <button 
                        onClick={handleLogout}
                        className='text-xl text-white'
                    >
                        <FaSignOutAlt className='text-3xl' />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
