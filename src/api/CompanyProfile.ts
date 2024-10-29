import { CompanyProfile } from "../types/companyprofile";

export const CompanyProfileState = {
    country: "",
    currency: "",
    estimateCurrency: "",
    exchange: "",
    finnhubIndustry: "",
    ipo: "",
    logo: "",
    marketCapitalization: 0,
    name: "",
    phone: "",
    shareOutstanding: 0,
    ticker: "",
    weburl: ""
}

export const getCompanyProfile = async ( ticker:string ): Promise<CompanyProfile> => {
    const response = await fetch(`${ process.env.REACT_APP_API_URL }/api/v1/stock/profile2?symbol=${ ticker }&token=${ process.env.REACT_APP_API_KEY }`);

    if ( !response.ok ) {
        throw new Error("Failed to fetch ticker quote");
    }
    
    const data: CompanyProfile = await response.json();
    return data;
}