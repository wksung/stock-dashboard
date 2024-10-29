import { useEffect, useState } from "react";

import { MyStock } from "../../types/mystock";
import { MarketStatus } from "../../types/marketstatus";

import { getMarketStatus, MarketStatusState } from "../../api/MarketStatus";
import { getGeneralNews } from "../../api/GeneralNews";
import { GeneralNews } from "../../types/generalnews";

const useMarketData = () => {

    const [ myStocks, setMyStocks ] = useState<MyStock[]>([]);
    const [ marketStatus, setMarketStatus ] = useState<MarketStatus>(MarketStatusState);
    const [ marketNews, setMarketNews ] = useState<GeneralNews[]>([]);

    useEffect(() => {
        const stocks = localStorage.getItem("myStocks");
        if ( stocks !== null ) {
            let temp = JSON.parse(stocks);
            setMyStocks(temp);
        }

        // run API on load
        const getMarketData = async () => {
            const marketStatus = await getMarketStatus();
            setMarketStatus(marketStatus);
            const marketNews = await getGeneralNews();
            setMarketNews(marketNews.slice(0, 2));
        }

        getMarketData();

    }, []);

    return { myStocks, marketStatus, marketNews };
}

export default useMarketData;