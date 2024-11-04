import { CompanyNews } from '../types/companynews';

export const getCompanyNews = async (
    ticker: string,
    fromDate: string,
    endDate: string,
): Promise<CompanyNews[]> => {
    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/company-news?symbol=${ticker}&from=${fromDate}&to=${endDate}&token=${process.env.REACT_APP_API_KEY}`,
    );

    if (!response.ok) {
        return [];
    }

    const data: CompanyNews[] = await response.json();
    return data;
};
