import { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreHorizontal } from 'lucide-react';
import './CustomerQuery.css';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    registeredAt: string;
    totalSpent: string;
}

export default function CustomerQuery() {
    const [searchTerm, setSearchTerm] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/customers')
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error('Failed to fetch customers', err));
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.includes(searchTerm) || c.phone.includes(searchTerm) || c.id.includes(searchTerm)
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">客户查询</h1>
                    <p className="page-subtitle">管理和查询系统内的所有客户信息</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary"><Filter size={16} /> 高级筛选</button>
                    <button className="btn btn-secondary"><Download size={16} /> 导出</button>
                    <button className="btn text-white">+ 新建客户</button>
                </div>
            </div>

            <div className="card query-card">
                <div className="query-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="搜索姓名、手机号或客户ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input search-input-large"
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>客户 ID</th>
                                <th>客户姓名</th>
                                <th>联系方式</th>
                                <th>状态</th>
                                <th>注册时间</th>
                                <th>累计消费</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="font-mono text-sm">{customer.id}</td>
                                        <td>
                                            <div className="customer-name-cell">
                                                <div className="avatar-sm">{customer.name.charAt(0)}</div>
                                                <span className="font-medium">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contact-info">
                                                <span>{customer.phone}</span>
                                                <span className="text-muted text-sm">{customer.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${customer.status}`}>
                                                {customer.status === 'active' ? '正常' : '停用'}
                                            </span>
                                        </td>
                                        <td>{customer.registeredAt}</td>
                                        <td><span className="font-medium">{customer.totalSpent}</span></td>
                                        <td>
                                            <button className="icon-btn-sm"><MoreHorizontal size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="empty-state">
                                        没有找到匹配的客户记录
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <span className="text-muted text-sm">显示 1 到 {filteredCustomers.length} 条，共 {filteredCustomers.length} 条</span>
                    <div className="pagination-controls">
                        <button className="btn-page" disabled>上一页</button>
                        <button className="btn-page active">1</button>
                        <button className="btn-page" disabled>下一页</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
