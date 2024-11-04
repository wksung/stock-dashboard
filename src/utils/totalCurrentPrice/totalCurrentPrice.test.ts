import { totalCurrentPrice } from './totalCurrentPrice';

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

describe('totalCurrentPrice', () => {
    it('should show total bought price of your stocks', () => {
        const totalPrice = totalCurrentPrice(MockMyStocks, MockQuotes);
        expect(totalPrice).toBe(10765.2);
    });

    it("should show 0 dollars as total bought price if there's no stock", () => {
        const totalPrice = totalCurrentPrice([], []);
        expect(totalPrice).toBe(0);
    });
});
