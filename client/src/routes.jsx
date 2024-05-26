import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './components/auth/NotFound';
import Dashboard from './components/Dashboard';
import Auth from './components/auth/Auth';
import Help from './components/Help';
import Domains from './components/Domains';

const BaseRoute = () => {
  return (
    <Routes>
      <Route path='/user/auth' element={<Auth/>}/>
      <Route path="/dashboard/:domainId" element={<Dashboard />} />
      <Route path="/help" element={<Help />} />
      <Route path="/home" element={<Domains />} />
      <Route path="/" element={<Navigate replace to="/user/auth" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default BaseRoute;
