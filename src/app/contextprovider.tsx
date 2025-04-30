'use client'

import { createContext, useContext, useState } from 'react';

export interface ContextProps {
    isWomen: boolean;
    setIsWomen: (isWomen: boolean) => void;
}

const initialContextData: Omit<ContextProps, 'setIsWomen' > = {
    isWomen: false,
};

export const CurrentContext = createContext<ContextProps>({
    ...initialContextData,
    setIsWomen: () => {},
});

export const useSessionContext = () => {
    const context = useContext(CurrentContext);
    if (!context) {
        throw new Error('useSessionContext must be used within a SessionProvider');
    }
    return context;
};

export default function ContextProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isWomen, setIsWomen] = useState(initialContextData.isWomen);

    return (
        <CurrentContext.Provider value={{ isWomen, setIsWomen }}>
            {children}
        </CurrentContext.Provider>
    );
}