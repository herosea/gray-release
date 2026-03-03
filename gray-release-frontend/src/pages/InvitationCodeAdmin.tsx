import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Play, Square, RefreshCw } from 'lucide-react';
import './InvitationCodeAdmin.css';

interface InvitationCode {
    id: number;
    code: string;
    channel: string;
    initialQuota: number;
    usedQuota: number;
    alertThreshold: number;
    status: number;
    createTime: string;
}

export default function InvitationCodeAdmin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [codes, setCodes] = useState<InvitationCode[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form states
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formCode, setFormCode] = useState('');
    const [formChannel, setFormChannel] = useState('小红书');
    const [formInitialQuota, setFormInitialQuota] = useState<number>(100);
    const [formAlertThreshold, setFormAlertThreshold] = useState<number>(10);

    // Toast state
    const [toastMessage, setToastMessage] = useState('');

    const fetchCodes = () => {
        fetch('http://localhost:8080/api/admin/invitation-codes?current=1&size=100')
            .then(res => res.json())
            .then(data => {
                if (data.records) {
                    setCodes(data.records);
                } else {
                    setCodes([]);
                }
            })
            .catch(err => console.error('Failed to fetch invitation codes', err));
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Filter
    const filteredCodes = codes.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.channel.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (code: InvitationCode | null = null) => {
        if (code) {
            setEditingId(code.id);
            setFormCode(code.code);
            setFormChannel(code.channel);
            setFormInitialQuota(code.initialQuota);
            setFormAlertThreshold(code.alertThreshold);
        } else {
            setEditingId(null);
            setFormCode('');
            setFormChannel('小红书');
            setFormInitialQuota(100);
            setFormAlertThreshold(10);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const generateRandomCode = () => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormCode(result);
    };

    const handleSave = () => {
        if (!editingId && !formCode) {
            // let server generate
        }

        const payload = {
            code: formCode,
            channel: formChannel,
            initialQuota: formInitialQuota,
            alertThreshold: formAlertThreshold
        };

        const url = editingId
            ? `http://localhost:8080/api/admin/invitation-codes/${editingId}`
            : 'http://localhost:8080/api/admin/invitation-codes';

        const method = editingId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(async (res) => {
                const text = await res.text();
                if (res.ok) {
                    showToast('保存成功');
                    handleCloseModal();
                    fetchCodes();
                } else {
                    showToast(text || '保存失败');
                }
            })
            .catch(err => {
                console.error(err);
                showToast('请求异常');
            });
    };

    const handleStatusChange = (id: number, newStatus: number) => {
        fetch(`http://localhost:8080/api/admin/invitation-codes/${id}/status?status=${newStatus}`, {
            method: 'PUT'
        })
            .then(res => {
                if (res.ok) {
                    showToast(newStatus === 1 ? '启用成功' : '禁用成功');
                    fetchCodes();
                }
            });
    };

    const handleDelete = (id: number) => {
        if (confirm('确定要删除这个邀请码吗？')) {
            fetch(`http://localhost:8080/api/admin/invitation-codes/${id}`, {
                method: 'DELETE'
            })
                .then(res => {
                    if (res.ok) {
                        showToast('删除成功');
                        fetchCodes();
                    }
                });
        }
    };

    return (
        <div className="page-container invitation-page">
            {toastMessage && (
                <div className="toast-message">
                    {toastMessage}
                </div>
            )}

            <div className="page-header">
                <div>
                    <h1 className="page-title">邀请码管理</h1>
                    <p className="page-subtitle">配置和管理 AI 助手灰测体验邀请码</p>
                </div>
                <div className="header-actions">
                    <button className="btn text-white" onClick={() => handleOpenModal(null)}>
                        <Plus size={16} /> 新建邀请码
                    </button>
                </div>
            </div>

            <div className="card query-card">
                <div className="query-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="搜索邀请码或渠道名称..."
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
                                <th>邀请码</th>
                                <th>渠道</th>
                                <th>使用进度</th>
                                <th>额度/阈值</th>
                                <th>状态</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCodes.length > 0 ? (
                                filteredCodes.map(code => (
                                    <tr key={code.id}>
                                        <td className="font-mono font-bold text-lg">{code.code}</td>
                                        <td>
                                            <span className="channel-badge">{code.channel}</span>
                                        </td>
                                        <td>
                                            <div className="progress-container">
                                                <div className="progress-text">
                                                    已使用: {code.usedQuota} / {code.initialQuota}
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div className="progress-bar-fill" style={{ width: `${Math.min(100, (code.usedQuota / code.initialQuota) * 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="quota-info">
                                                <span>总额度: {code.initialQuota}</span>
                                                <span className="text-muted text-sm">告警: <span className="warning-text">&lt;{code.alertThreshold}</span></span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${code.status === 1 ? 'active' : 'inactive'}`}>
                                                {code.status === 1 ? '正常' : '禁用'}
                                            </span>
                                        </td>
                                        <td className="text-sm">{new Date(code.createTime).toLocaleString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="icon-btn-sm" title="编辑" onClick={() => handleOpenModal(code)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                {code.status === 1 ? (
                                                    <button className="icon-btn-sm warning" title="禁用" onClick={() => handleStatusChange(code.id, 0)}>
                                                        <Square size={16} />
                                                    </button>
                                                ) : (
                                                    <button className="icon-btn-sm success" title="启用" onClick={() => handleStatusChange(code.id, 1)}>
                                                        <Play size={16} />
                                                    </button>
                                                )}
                                                {code.usedQuota === 0 && (
                                                    <button className="icon-btn-sm danger" title="删除" onClick={() => handleDelete(code.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="empty-state">
                                        没有找到匹配的邀请码记录
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingId ? '编辑邀请码' : '新建邀请码'}</h2>
                            <button className="close-btn" onClick={handleCloseModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>渠道名称</label>
                                <select
                                    className="input select-input"
                                    value={formChannel}
                                    onChange={e => setFormChannel(e.target.value)}
                                    disabled={!!editingId && (codes.find(c => c.id === editingId)?.usedQuota || 0) > 0}
                                >
                                    <option value="小红书">小红书</option>
                                    <option value="App内">App内</option>
                                    <option value="公司内部">公司内部</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>邀请码 (留空自动生成)</label>
                                <div className="input-with-button">
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="例如: XHS888 或点击随机生成"
                                        value={formCode}
                                        onChange={e => setFormCode(e.target.value.toUpperCase())}
                                        disabled={!!editingId && (codes.find(c => c.id === editingId)?.usedQuota || 0) > 0}
                                        maxLength={10}
                                    />
                                    {!editingId && (
                                        <button type="button" className="btn btn-secondary random-btn" onClick={generateRandomCode} title="随机生成6位码">
                                            <RefreshCw size={16} /> 随机生成
                                        </button>
                                    )}
                                </div>
                                <small className="text-muted">仅支持数字和大写字母组合</small>
                            </div>
                            <div className="form-group row">
                                <div className="col">
                                    <label>初始额度 (人)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min={1}
                                        value={formInitialQuota}
                                        onChange={e => setFormInitialQuota(parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="col">
                                    <label>告警阈值 (人)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        min={0}
                                        value={formAlertThreshold}
                                        onChange={e => setFormAlertThreshold(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                            {editingId && (codes.find(c => c.id === editingId)?.usedQuota || 0) > 0 && (
                                <div className="alert-info">
                                    该邀请码已被使用，仅可修改额度和告警阈值。
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>取消</button>
                            <button className="btn text-white primary-btn" onClick={handleSave}>保存配置</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
