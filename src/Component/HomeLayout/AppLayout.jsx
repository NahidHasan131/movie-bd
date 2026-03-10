import HomeNav from './HomeNav';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    return (
        <div>
          <HomeNav/>
           <Outlet/>
        </div>
    );
};

export default AppLayout;