import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Bell, Search, Menu, Key } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <LayoutDashboard className="logo-icon" />
          <h2>Gray Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/customers" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Users size={20} />
            <span>客户查询</span>
          </NavLink>
          <NavLink to="/invitation-codes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Key size={20} />
            <span>邀请码管理</span>
          </NavLink>
          {/* Future sections can be added here */}
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Settings size={20} />
            <span>系统设置</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn">
              <Menu size={20} />
            </button>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="全局搜索..." className="search-input" />
            </div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge"></span>
            </button>
            <div className="user-profile">
              <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="avatar" />
              <span className="user-name">管理员</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
