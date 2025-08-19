import React from 'react';

export default function RegisterLayout({ children }) {
    return (
        <>
         
            <div className="min-h-screen bg-indigo-100">
                <div >
                    {children}
                </div>
            </div>
        </>
    );
}