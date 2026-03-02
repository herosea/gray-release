import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { InvitationCode, ChannelConfig, InvitationCodeFormData } from '../types/invitation';

interface Props {
    code: InvitationCode | null;
    channels: ChannelConfig[];
    onClose: () => void;
    onSubmit: (data: InvitationCodeFormData) => void;
    onGenerateCode: () => Promise<string>;
    onCheckUnique: (code: string) => Promise<boolean>;
}

export default function InvitationCodeModal({
    code,
    channels,
    onClose,
    onSubmit,
    onGenerateCode,
    onCheckUnique,
}: Props) {
    const [formData, setFormData] = useState<InvitationCodeFormData>({
        code: '',
        channelName: '',
        totalQuota: 0,
        alertThreshold: 10,
    });
    const [checking, setChecking] = useState(false);
    const [isUnique, setIsUnique] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const isEdit = code !== null;
    const isUsed = code && code.usedQuota > 0;

    useEffect(() => {
        if (code) {
            setFormData({
                code: code.code,
                channelName: code.channelName,
                totalQuota: code.totalQuota,
                alertThreshold: code.alertThreshold,
            });
            setIsUnique(true);
        } else if (channels.length > 0) {
            const defaultChannel = channels[0];
            setFormData(prev => ({
                ...prev,
                channelName: defaultChannel.channelName,
                totalQuota: defaultChannel.defaultQuota,
                alertThreshold: defaultChannel.defaultAlertThreshold,
            }));
        }
    }, [code, channels]);

    const handleCodeChange = async (value: string) => {
        setFormData(prev => ({ ...prev, code: value.toUpperCase() }));
        if (value.length >= 6) {
            setChecking(true);
            const unique = await onCheckUnique(value.toUpperCase());
            setIsUnique(unique);
            setChecking(false);
        } else {
            setIsUnique(null);
        }
    };

    const handleGenerate = async () => {
        const generatedCode = await onGenerateCode();
        setFormData(prev => ({ ...prev, code: generatedCode }));
        setIsUnique(true);
    };

    const handleChannelChange = (channelName: string) => {
        const channel = channels.find(c => c.channelName === channelName);
        setFormData(prev => ({
            ...prev,
            channelName,
            totalQuota: channel?.defaultQuota || prev.totalQuota,
            alertThreshold: channel?.defaultAlertThreshold || prev.alertThreshold,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isUnique) return;

        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEdit ? '编辑邀请码' : '新建邀请码'}</h2>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>邀请码</label>
                            <div className="code-input-group">
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.code}
                                    onChange={e => handleCodeChange(e.target.value)}
                                    maxLength={6}
                                    placeholder="请输入6位邀请码"
                                    disabled={isEdit}
                                    required
                                />
                                {!isEdit && (
                                    <button
                                        type="button"
                                        className="btn-generate"
                                        onClick={handleGenerate}
                                    >
                                        一键生成
                                    </button>
                                )}
                            </div>
                            {checking && <div className="unique-check">检查中...</div>}
                            {!checking && isUnique === true && formData.code.length >= 6 && (
                                <div className="unique-check success">✓ 邀请码可用</div>
                            )}
                            {!checking && isUnique === false && (
                                <div className="unique-check error">✗ 邀请码已存在</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>渠道</label>
                            <select
                                className="input"
                                value={formData.channelName}
                                onChange={e => handleChannelChange(e.target.value)}
                                disabled={isEdit && isUsed}
                                required
                            >
                                <option value="">请选择渠道</option>
                                {channels.map(ch => (
                                    <option key={ch.id} value={ch.channelName}>
                                        {ch.channelName} (默认额度: {ch.defaultQuota})
                                    </option>
                                ))}
                            </select>
                            {isEdit && isUsed && (
                                <div className="edit-hint">已被使用的邀请码不可修改渠道</div>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>总额度</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.totalQuota}
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        totalQuota: parseInt(e.target.value) || 0
                                    }))}
                                    min={0}
                                    disabled={isEdit && isUsed}
                                    required
                                />
                                {isEdit && isUsed && (
                                    <div className="edit-hint">已使用额度不可修改</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>告警阈值</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.alertThreshold}
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        alertThreshold: parseInt(e.target.value) || 0
                                    }))}
                                    min={0}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            取消
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={submitting || isUnique === false}
                        >
                            {submitting ? '提交中...' : (isEdit ? '保存' : '创建')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
