import { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, Trash2, Edit, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import type { InvitationCode, ChannelConfig, AlertStatus, PageResult, InvitationCodeFormData } from '../types/invitation';
import InvitationCodeModal from '../components/InvitationCodeModal';
import './CustomerQuery.css';
import './InvitationCodeManage.css';

export default function InvitationCodeManage() {
    const [codes, setCodes] = useState<InvitationCode[]>([]);
    const [channels, setChannels] = useState<ChannelConfig[]>([]);
    const [alerts, setAlerts] = useState<AlertStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterChannel, setFilterChannel] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCode, setEditingCode] = useState<InvitationCode | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [size] = useState(10);

    useEffect(() => {
        fetchChannels();
        fetchAlerts();
    }, []);

    useEffect(() => {
        fetchCodes();
    }, [page, filterChannel, filterStatus]);

    const fetchChannels = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/channels');
            const data = await res.json();
            setChannels(data);
        } catch (err) {
            console.error('Failed to fetch channels', err);
        }
    };

    const fetchAlerts = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/alerts/status');
            const data = await res.json();
            setAlerts(data);
        } catch (err) {
            console.error('Failed to fetch alerts', err);
        }
    };

    const fetchCodes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());
            if (filterChannel) params.append('channelName', filterChannel);
            if (filterStatus) params.append('status', filterStatus);

            const res = await fetch(`http://localhost:8080/api/invitation-codes?${params}`);
            const data: PageResult<InvitationCode> = await res.json();
            setCodes(data.data);
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to fetch codes', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCode = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/invitation-codes/generate');
            const data = await res.json();
            return data.code;
        } catch (err) {
            console.error('Failed to generate code', err);
            return '';
        }
    };

    const handleCheckUnique = async (code: string): Promise<boolean> => {
        try {
            const res = await fetch(`http://localhost:8080/api/invitation-codes/check/${code}`);
            const data = await res.json();
            return data.unique;
        } catch (err) {
            console.error('Failed to check code', err);
            return false;
        }
    };

    const handleSubmit = async (formData: InvitationCodeFormData) => {
        try {
            if (editingCode) {
                await fetch(`http://localhost:8080/api/invitation-codes/${editingCode.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('http://localhost:8080/api/invitation-codes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }
            setShowModal(false);
            setEditingCode(null);
            fetchCodes();
            fetchAlerts();
        } catch (err) {
            console.error('Failed to save code', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('确定要删除该邀请码吗？')) return;
        try {
            await fetch(`http://localhost:8080/api/invitation-codes/${id}`, {
                method: 'DELETE',
            });
            fetchCodes();
            fetchAlerts();
        } catch (err) {
            console.error('Failed to delete code', err);
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await fetch(`http://localhost:8080/api/invitation-codes/${id}/toggle`, {
                method: 'POST',
            });
            fetchCodes();
            fetchAlerts();
        } catch (err) {
            console.error('Failed to toggle status', err);
        }
    };

    const openCreateModal = () => {
        setEditingCode(null);
        setShowModal(true);
    };

    const openEditModal = (code: InvitationCode) => {
        setEditingCode(code);
        setShowModal(true);
    };

    const filteredCodes = codes.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.channelName.includes(searchTerm)
    );

    const getAlertCodes = () => {
        return alerts.map(a => a.code);
    };

    const alertCodeSet = new Set(getAlertCodes());

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">邀请码管理</h1>
                    <p className="page-subtitle">管理和查看系统内的邀请码</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={fetchCodes}>
                        <RefreshCw size={16} /> 刷新
                    </button>
                    <button className="btn text-white" onClick={openCreateModal}>
                        <Plus size={16} /> 新建邀请码
                    </button>
                </div>
            </div>

            {alerts.length > 0 && (
                <div className="alert-banner">
                    <AlertTriangle size={18} />
                    <span>以下渠道库存不足告警：</span>
                    {alerts.map((alert, idx) => (
                        <span key={idx} className="alert-item">
                            {alert.channelName}({alert.code}): 剩余 {alert.remainingQuota} (阈值: {alert.alertThreshold})
                        </span>
                    ))}
                </div>
            )}

            <div className="card query-card">
                <div className="query-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="搜索邀请码或渠道..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input search-input-large"
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            className="input select"
                            value={filterChannel}
                            onChange={(e) => setFilterChannel(e.target.value)}
                        >
                            <option value="">全部渠道</option>
                            {channels.map(ch => (
                                <option key={ch.id} value={ch.channelName}>{ch.channelName}</option>
                            ))}
                        </select>
                        <select
                            className="input select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">全部状态</option>
                            <option value="active">启用</option>
                            <option value="disabled">禁用</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>邀请码</th>
                                <th>渠道</th>
                                <th>总额度</th>
                                <th>已使用</th>
                                <th>剩余</th>
                                <th>告警阈值</th>
                                <th>状态</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="empty-state">加载中...</td>
                                </tr>
                            ) : filteredCodes.length > 0 ? (
                                filteredCodes.map(code => {
                                    const remaining = code.totalQuota - code.usedQuota;
                                    const isUsed = code.usedQuota > 0;
                                    const isAlert = remaining < code.alertThreshold;
                                    return (
                                        <tr key={code.id} className={isAlert ? 'alert-row' : ''}>
                                            <td className="font-mono font-medium">{code.code}</td>
                                            <td>{code.channelName}</td>
                                            <td>{code.totalQuota}</td>
                                            <td>{code.usedQuota}</td>
                                            <td className={isAlert ? 'text-danger' : ''}>
                                                {remaining}
                                                {isAlert && <AlertTriangle size={14} className="alert-icon" />}
                                            </td>
                                            <td>{code.alertThreshold}</td>
                                            <td>
                                                <span className={`status-badge ${code.status}`}>
                                                    {code.status === 'active' ? '启用' : '禁用'}
                                                </span>
                                            </td>
                                            <td className="text-sm">{code.createdAt}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button
                                                        className="icon-btn-sm"
                                                        title="编辑"
                                                        onClick={() => openEditModal(code)}
                                                        disabled={isUsed}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="icon-btn-sm"
                                                        title={code.status === 'active' ? '禁用' : '启用'}
                                                        onClick={() => handleToggle(code.id)}
                                                    >
                                                        {code.status === 'active' ?
                                                            <ToggleRight size={16} /> :
                                                            <ToggleLeft size={16} />
                                                        }
                                                    </button>
                                                    <button
                                                        className="icon-btn-sm text-danger"
                                                        title="删除"
                                                        onClick={() => handleDelete(code.id)}
                                                        disabled={isUsed}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={9} className="empty-state">
                                        暂无邀请码数据
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <span className="text-muted text-sm">
                        显示 {(page - 1) * size + 1} 到 {Math.min(page * size, total)} 条，共 {total} 条
                    </span>
                    <div className="pagination-controls">
                        <button
                            className="btn-page"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            上一页
                        </button>
                        <button className="btn-page active">{page}</button>
                        <button
                            className="btn-page"
                            disabled={page * size >= total}
                            onClick={() => setPage(p => p + 1)}
                        >
                            下一页
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <InvitationCodeModal
                    code={editingCode}
                    channels={channels}
                    onClose={() => {
                        setShowModal(false);
                        setEditingCode(null);
                    }}
                    onSubmit={handleSubmit}
                    onGenerateCode={handleGenerateCode}
                    onCheckUnique={handleCheckUnique}
                />
            )}
        </div>
    );
}
