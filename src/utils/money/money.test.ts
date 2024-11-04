import { money } from './money';

describe('money', () => {
    it('should show the correct money format when adding the value', () => {
        const cash = money(1000);
        expect(cash).toBe('$1,000.00');
    });

    it('should show the correct money format with the correct comma when adding the value', () => {
        const cash = money(1000000);
        expect(cash).toBe('$1,000,000.00');
    });

    it('should show 0 dollars in money format when adding 0 dollars', () => {
        const cash = money(0);
        expect(cash).toBe('$0.00');
    });
});
