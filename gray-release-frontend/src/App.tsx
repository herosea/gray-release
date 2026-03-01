import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import CustomerQuery from './pages/CustomerQuery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/customers" replace />} />
          <Route path="customers" element={<CustomerQuery />} />
          {/* Add more routes here in the future */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
