import React from 'react';
import {Search} from "lucide-react";

interface WebCardsContainerProps {
    children: React.ReactNode;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    placeholder?: string;
}

const WebCardsContainer: React.FC<WebCardsContainerProps> = ({
    children,
    searchValue='',
    onSearchChange,
    placeholder='Search products...'
}) => {
    return (
        <div>
            {onSearchChange && (
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"/>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange((e.target.value))}
                            placeholder={placeholder}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {children}
            </div>
        </div>
    );
};

export default WebCardsContainer;