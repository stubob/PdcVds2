'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { getAllRiders, getCalendar, getUser } from './prisma-queries';
import { auth } from '../auth';
import { getSession } from 'next-auth/react';

export interface ContextProps {
    isWomen: boolean;
    setIsWomen: (isWomen: boolean) => void;
    riderData: any;
    setRiderData: (data: any) => void;
    session: any;
    setSession: (session: any) => void;
    calendarData: any[];
    setCalendarData: (data: any[]) => void;
}

const initialContextData: Omit<ContextProps, 'setIsWomen' | 'setRiderData' | 'setSession' | 'setCalendarData'> = {
    isWomen: false,
    riderData: [],
    session: null,
    calendarData: [],
};

export const CurrentContext = createContext<ContextProps>({
    ...initialContextData,
    setIsWomen: () => {},
    setRiderData: () => {},
    setSession: () => {},
    setCalendarData: () => {},
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
    const [riderData, setRiderData] = useState(initialContextData.riderData);
    const [session, setSession] = useState(initialContextData.session);
    const [calendarData, setCalendarData] = useState(initialContextData.calendarData);

    useEffect(() => {
        const fetchData = async () => {
          console.log("init session");
            const data = await getCalendar();
            setCalendarData(data);
            const riderData = await getAllRiders();
            setRiderData(riderData);
            const authSession = await getSession();
            if (authSession) {
                console.log('init session: ' + authSession.user?.name);
                const user = await getUser(authSession.user?.email);
                setSession(user);
                console.log('profile user:', user);
            }
        };
        fetchData();
    }, [session?.user?.email]);

    return (
        <CurrentContext.Provider value={{ isWomen, setIsWomen, riderData, setRiderData, session, setSession, calendarData, setCalendarData }}>
            {children}
        </CurrentContext.Provider>
    );
}