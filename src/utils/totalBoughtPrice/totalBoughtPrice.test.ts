import { totalBoughtPrice } from './totalBoughtPrice';

const MockMyStocks = [
    { stock: 'NVDA', price: 100, quantity: '60' },
    { stock: 'AAPL', price: 100, quantity: '10' },
];

describe('totalBoughtPrice', () => {
    it('should show total bought price of your stocks', () => {
        const totalPrice = totalBoughtPrice(MockMyStocks);
        expect(totalPrice).toBe(7000);
    });

    it("should show 0 dollars as total bought price if there's no stock", () => {
        const totalPrice = totalBoughtPrice([]);
        expect(totalPrice).toBe(0);
    });
});
