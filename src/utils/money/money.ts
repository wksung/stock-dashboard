export const money = ( money: number ): string => {
    const m = (Math.round(money * 100) / 100).toFixed(2);
    return "$" + m.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};