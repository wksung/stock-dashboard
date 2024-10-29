export const calculateStockPercentage = ( originStockValue:number, stockValue:number ): number => {
    if ( stockValue !== 0 ) return 100 - (originStockValue/stockValue)*100;
    else return 0;
};