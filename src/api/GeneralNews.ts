import { GeneralNews } from "../types/generalnews";

export const getGeneralNews = async (): Promise<GeneralNews[]> => {
    const response = await fetch(`${ process.env.REACT_APP_API_URL }/api/v1/news?category=general&token=${ process.env.REACT_APP_API_KEY }`);

    if ( !response.ok ) {
        throw new Error("Failed to fetch ticker quote");
    }
    
    const data: GeneralNews[] = await response.json();
    return data;
}