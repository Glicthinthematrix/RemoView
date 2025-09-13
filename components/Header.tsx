import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-purple-300 text-glow-purple">
                RemoView
            </h1>
            <p className="text-lg text-gray-400 mt-2">Remote Viewing Training</p>
        </header>
    );
};

export default Header;