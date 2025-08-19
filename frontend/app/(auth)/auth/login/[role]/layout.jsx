import React from 'react';
import AuthNav from '../../../../components/authnavbar'
export default function RegisterLayout({ children }) {
    return (
        <>
            <AuthNav />
            <div className="min-h-screen bg-indigo-100">
                <div >
                    {children}
                </div>
            </div>
        </>
    );
}