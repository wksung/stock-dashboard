import { CompanyQuote } from '../../types/companyquote';
import { MyStock } from '../../types/mystock';
import { totalBoughtPrice } from '../totalBoughtPrice/totalBoughtPrice';
import { totalCurrentPrice } from '../totalCurrentPrice/totalCurrentPrice';

export const totalChangeInPrice = (
    myStocks: MyStock[],
    myQuotes: CompanyQuote[],
) => {
    return totalCurrentPrice(myStocks, myQuotes) - totalBoughtPrice(myStocks);
};
