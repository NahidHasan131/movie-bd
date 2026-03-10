import { useState } from 'react';
import NavMenu from './NavMenu';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminAppLayout = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            
            <div className="flex-grow-1 d-flex flex-column"
                style={{ 
                    marginLeft: isSidebarExpanded ? '250px' : '80px',
                    transition: 'margin-left 0.3s ease'
                }}>
                <NavMenu />
                
                <main className="flex-grow-1 overflow-auto p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminAppLayout;
