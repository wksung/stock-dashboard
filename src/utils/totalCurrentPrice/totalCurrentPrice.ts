import { CompanyQuote } from '../../types/companyquote';
import { MyStock } from '../../types/mystock';

export const totalCurrentPrice = (
    myStocks: MyStock[],
    myQuotes: CompanyQuote[],
) => {
    return myStocks.reduce((a, b, i) => a + +b.quantity * +myQuotes[i]?.c, 0);
};
