import { CompanyQuote } from '../types/companyquote';

export const CompanyQuoteState = {
    c: 0,
    d: 0,
    dp: 0,
    h: 0,
    l: 0,
    o: 0,
    pc: 0,
    t: 0,
};

export const getCompanyQuote = async (
    ticker: string,
): Promise<CompanyQuote> => {
    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_API_KEY}`,
    );

    if (!response.ok) {
        throw new Error('Failed to fetch ticker quote');
    }

    const data: CompanyQuote = await response.json();
    return data;
};
