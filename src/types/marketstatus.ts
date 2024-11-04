export interface MarketStatus {
    exchange: string;
    holiday: string | null;
    isOpen: boolean;
    session: string | null;
    t: number;
    timezone: string;
}
