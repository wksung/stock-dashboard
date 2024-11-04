import { calculateStockScore } from './calculateStockScore';

const MockTrends = [
    [
        {
            buy: 41,
            hold: 6,
            period: '2024-10-01',
            sell: 0,
            strongBuy: 23,
            strongSell: 0,
            symbol: 'NVDA',
        },
        {
            buy: 41,
            hold: 6,
            period: '2024-09-01',
            sell: 0,
            strongBuy: 20,
            strongSell: 0,
            symbol: 'NVDA',
        },
        {
            buy: 39,
            hold: 6,
            period: '2024-08-01',
            sell: 0,
            strongBuy: 20,
            strongSell: 0,
            symbol: 'NVDA',
        },
        {
            buy: 37,
            hold: 6,
            period: '2024-07-01',
            sell: 0,
            strongBuy: 21,
            strongSell: 0,
            symbol: 'NVDA',
        },
    ],
];
const MockMyStock = [{ stock: 'NVDA', price: 100, quantity: '60' }];

describe('calculateStockScore', () => {
    it('should show the correct score when you add the recommended data', () => {
        const score = calculateStockScore(MockTrends, MockMyStock);
        expect(score.toFixed(2)).toBe('74.76');
    });

    it('should show 0 if you add in the incorrect data', () => {
        const score = calculateStockScore([], []);
        expect(score.toFixed(2)).toBe('0.00');
    });
});
