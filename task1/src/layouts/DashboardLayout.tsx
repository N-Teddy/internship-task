import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
const DashboardLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <Header />
                <Outlet />
            </main>
        </SidebarProvider>
    );
}

export default DashboardLayout;

