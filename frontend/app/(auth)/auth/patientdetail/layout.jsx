import React from 'react';
import AuthNav from '../../../components/authnavbar'
export default function RegisterLayout({ children }) {
    return (
        <>
            <AuthNav />
            <div className="min-h-screen bg-indigo-100">
                <div className='mt-20' >
                    {children}
                </div>
            </div>
        </>
    );
}