import { totalChangeInPrice } from './totalChangeInPrice';

const MockMyStocks = [
    { stock: 'NVDA', price: 100, quantity: '60' },
    { stock: 'AAPL', price: 100, quantity: '10' },
];
const MockQuotes = [
    {
        c: 140.52,
        d: -1.02,
        dp: -0.7206,
        h: 143.14,
        l: 140.05,
        o: 143,
        pc: 141.54,
        t: 1730145600,
    },
    {
        c: 233.4,
        d: 1.99,
        dp: 0.8599,
        h: 234.73,
        l: 232.55,
        o: 233.32,
        pc: 231.41,
        t: 1730145600,
    },
];

describe('totalChangeInPrice', () => {
    it('should show the correct change in price value', () => {
        const change = totalChangeInPrice(MockMyStocks, MockQuotes);
        expect(change.toFixed(2)).toBe('3765.20');
    });

    it("should show 0 dollars if there's no stock available", () => {
        const change = totalChangeInPrice([], []);
        expect(change).toBe(0);
    });
});
