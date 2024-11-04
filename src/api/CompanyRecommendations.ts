import { CompanyRecommendations } from '../types/companyrecommendations';

export const getCompanyRecommendations = async (
    ticker: string,
): Promise<CompanyRecommendations[]> => {
    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/stock/recommendation?symbol=${ticker}&token=${process.env.REACT_APP_API_KEY}`,
    );

    if (!response.ok) {
        throw new Error('Failed to fetch ticker quote');
    }

    const data: CompanyRecommendations[] = await response.json();
    return data;
};
