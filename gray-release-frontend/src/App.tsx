import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CustomerQuery from './pages/CustomerQuery';
import InvitationCodeManage from './pages/InvitationCodeManage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/customers" replace />} />
          <Route path="customers" element={<CustomerQuery />} />
          <Route path="invitation-codes" element={<InvitationCodeManage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
