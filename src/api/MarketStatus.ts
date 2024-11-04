import { MarketStatus } from '../types/marketstatus';

export const MarketStatusState = {
    exchange: 'US',
    holiday: null,
    isOpen: false,
    session: null,
    t: 0,
    timezone: 'America/New_York',
};

export const getMarketStatus = async (): Promise<MarketStatus> => {
    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/stock/market-status?exchange=US&token=${process.env.REACT_APP_API_KEY}`,
    );

    if (!response.ok) {
        throw new Error('Failed to fetch ticker quote');
    }

    const data: MarketStatus = await response.json();
    return data;
};
