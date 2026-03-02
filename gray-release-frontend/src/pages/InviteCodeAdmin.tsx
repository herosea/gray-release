import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Search, WandSparkles } from 'lucide-react';
import './InviteCodeAdmin.css';

type InviteStatus = 'ENABLED' | 'DISABLED';

interface InviteCodeItem {
  id: number;
  channel: string;
  code: string;
  sourceType: 'MANUAL' | 'RANDOM';
  totalQuota: number;
  usedQuota: number;
  remainingQuota: number;
  alertThreshold: number;
  alert: boolean;
  status: InviteStatus;
  createdAt: string;
  updatedAt: string;
}

interface PagedResult<T> {
  page: number;
  size: number;
  total: number;
  items: T[];
}

interface InviteForm {
  channel: string;
  code: string;
  totalQuota: string;
  alertThreshold: string;
  operator: string;
}

const API_BASE = 'http://localhost:8080/api/admin/invite-codes';

const EMPTY_FORM: InviteForm = {
  channel: '',
  code: '',
  totalQuota: '',
  alertThreshold: '',
  operator: 'admin',
};

export default function InviteCodeAdmin() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InviteCodeItem[]>([]);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<InviteCodeItem | null>(null);
  const [form, setForm] = useState<InviteForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const modalTitle = useMemo(() => (editing ? '编辑邀请码' : '新建邀请码'), [editing]);

  useEffect(() => {
    loadInviteCodes();
  }, []);

  async function loadInviteCodes() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: '1', size: '50' });
      if (keyword.trim()) {
        params.set('keyword', keyword.trim());
      }
      const res = await fetch(`${API_BASE}?${params.toString()}`);
      const data: PagedResult<InviteCodeItem> | { message?: string } = await res.json();
      if (!res.ok) {
        throw new Error((data as { message?: string }).message || '查询失败');
      }
      setItems((data as PagedResult<InviteCodeItem>).items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '查询失败');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(item: InviteCodeItem) {
    setEditing(item);
    setForm({
      channel: item.channel,
      code: item.code,
      totalQuota: String(item.totalQuota),
      alertThreshold: String(item.alertThreshold),
      operator: 'admin',
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      channel: form.channel.trim(),
      code: form.code.trim() || undefined,
      totalQuota: Number(form.totalQuota),
      alertThreshold: Number(form.alertThreshold),
      operator: form.operator.trim() || 'admin',
    };

    if (!payload.channel || Number.isNaN(payload.totalQuota) || Number.isNaN(payload.alertThreshold)) {
      alert('请完整填写渠道、额度和告警阈值');
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `${API_BASE}/${editing.id}` : API_BASE;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || '保存失败');
      }
      closeModal();
      await loadInviteCodes();
    } catch (e) {
      alert(e instanceof Error ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function generateCode() {
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || '生成失败');
      }
      const code = data.codes?.[0] || '';
      setForm((prev) => ({ ...prev, code }));
    } catch (e) {
      alert(e instanceof Error ? e.message : '生成失败');
    }
  }

  async function toggleStatus(item: InviteCodeItem) {
    const targetStatus: InviteStatus = item.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    try {
      const res = await fetch(`${API_BASE}/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus, operator: 'admin' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || '状态更新失败');
      }
      await loadInviteCodes();
    } catch (e) {
      alert(e instanceof Error ? e.message : '状态更新失败');
    }
  }

  async function deleteInviteCode(item: InviteCodeItem) {
    if (!confirm(`确认删除邀请码 ${item.code} 吗？`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || '删除失败');
      }
      await loadInviteCodes();
    } catch (e) {
      alert(e instanceof Error ? e.message : '删除失败');
    }
  }

  const usedLocked = Boolean(editing && editing.usedQuota > 0);

  return (
    <div className="page-container invite-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">邀请码管理</h1>
          <p className="page-subtitle">维护渠道邀请码、额度与告警阈值</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={loadInviteCodes}>
            <RefreshCw size={16} /> 刷新
          </button>
          <button className="btn" onClick={openCreate}>
            <Plus size={16} /> 新建邀请码
          </button>
        </div>
      </div>

      <div className="card query-card">
        <div className="query-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              className="input search-input-large"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索邀请码或渠道..."
            />
          </div>
          <button className="btn btn-secondary" onClick={loadInviteCodes}>查询</button>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>渠道</th>
                <th>邀请码</th>
                <th>额度</th>
                <th>阈值</th>
                <th>状态</th>
                <th>告警</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="empty-state">加载中...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="empty-state">暂无数据</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono text-sm">{item.id}</td>
                    <td>{item.channel}</td>
                    <td className="font-mono">{item.code}</td>
                    <td>{item.usedQuota} / {item.totalQuota}（剩余 {item.remainingQuota}）</td>
                    <td>{item.alertThreshold}</td>
                    <td>
                      <span className={`status-badge ${item.status === 'ENABLED' ? 'active' : 'inactive'}`}>
                        {item.status === 'ENABLED' ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td>
                      {item.alert ? <span className="alert-tag">低库存</span> : <span className="ok-tag">正常</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn-mini" onClick={() => openEdit(item)}>编辑</button>
                        <button className="btn-mini" onClick={() => toggleStatus(item)}>
                          {item.status === 'ENABLED' ? '禁用' : '启用'}
                        </button>
                        <button className="btn-mini danger" onClick={() => deleteInviteCode(item)}>删除</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <div className="modal-mask" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{modalTitle}</h3>
            <form onSubmit={submitForm} className="invite-form">
              <label>
                渠道名称
                <input
                  className="input"
                  value={form.channel}
                  onChange={(e) => setForm((prev) => ({ ...prev, channel: e.target.value }))}
                  disabled={usedLocked}
                  placeholder="例如 XHS / APP"
                />
              </label>

              <label>
                邀请码
                <div className="inline-row">
                  <input
                    className="input"
                    value={form.code}
                    onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    disabled={usedLocked}
                    placeholder="留空则自动生成"
                    maxLength={6}
                  />
                  <button type="button" className="btn btn-secondary" onClick={generateCode} disabled={usedLocked}>
                    <WandSparkles size={14} /> 生成
                  </button>
                </div>
              </label>

              <label>
                总额度
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.totalQuota}
                  onChange={(e) => setForm((prev) => ({ ...prev, totalQuota: e.target.value }))}
                />
              </label>

              <label>
                告警阈值
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.alertThreshold}
                  onChange={(e) => setForm((prev) => ({ ...prev, alertThreshold: e.target.value }))}
                />
              </label>

              <label>
                操作人
                <input
                  className="input"
                  value={form.operator}
                  onChange={(e) => setForm((prev) => ({ ...prev, operator: e.target.value }))}
                />
              </label>

              {usedLocked ? <p className="muted">该邀请码已被使用，渠道和邀请码不可修改。</p> : null}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>取消</button>
                <button type="submit" className="btn" disabled={saving}>{saving ? '保存中...' : '保存'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
