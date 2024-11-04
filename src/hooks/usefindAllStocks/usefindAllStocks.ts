import { useEffect, useState } from 'react';

import { getCompanyQuote } from '../../api/CompanyQuote';
import { getCompanyProfile } from '../../api/CompanyProfile';

import { CompanyQuote } from '../../types/companyquote';
import { CompanyProfile } from '../../types/companyprofile';
import { MyStock } from '../../types/mystock';

const useFindAllStocks = (myStocks: MyStock[]) => {
    const [myQuotes, setMyQuotes] = useState<CompanyQuote[]>([]);
    const [myProfile, setMyProfile] = useState<CompanyProfile[]>([]);

    useEffect(() => {
        const findAllInfo = async () => {
            const fetchPromises = myStocks.map(({ stock }) =>
                getCompanyQuote(stock),
            );
            const quotes = await Promise.all(fetchPromises);
            setMyQuotes(quotes);

            const fetchPromises1 = myStocks.map(({ stock }) =>
                getCompanyProfile(stock),
            );
            const profiles = await Promise.all(fetchPromises1);
            setMyProfile(profiles);
        };
        findAllInfo();
    }, [myStocks]);

    return { myQuotes, myProfile };
};

export default useFindAllStocks;
