import { MyStock } from "../../types/mystock";

export const totalBoughtPrice = ( myStocks:MyStock[] ): number => {
    return myStocks.reduce((a, b) => a + (+b.quantity * +b.price), 0);
};