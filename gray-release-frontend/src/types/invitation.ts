export interface InvitationCode {
    id: string;
    code: string;
    channelName: string;
    totalQuota: number;
    usedQuota: number;
    alertThreshold: number;
    status: 'active' | 'disabled';
    createdAt: string;
    updatedAt: string;
}

export interface ChannelConfig {
    id: string;
    channelName: string;
    defaultQuota: number;
    defaultAlertThreshold: number;
    createdAt: string;
}

export interface AlertStatus {
    code: string;
    channelName: string;
    totalQuota: number;
    usedQuota: number;
    remainingQuota: number;
    alertThreshold: number;
    status: string;
}

export interface InvitationCodeFormData {
    code: string;
    channelName: string;
    totalQuota: number;
    alertThreshold: number;
}

export interface PageResult<T> {
    data: T[];
    total: number;
    page: number;
    size: number;
}
