import { calculateStockPercentage } from "./calculateStockPercentage";

describe("calculateStockPercentage", () => {
    
    it("shows the correct percentage when the price is added", () => {
        const percentage = calculateStockPercentage(7000, 10765.2);
        expect(percentage.toFixed(2)).toBe('34.98');
    });

    it("shows 0 percentage when the stock price is 0", () => {
        const percentage = calculateStockPercentage(7000, 0);
        expect(percentage.toFixed(2)).toBe('0.00');
    });

});