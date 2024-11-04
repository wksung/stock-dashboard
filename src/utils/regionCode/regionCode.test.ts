import { regionCode } from './regionCode';

describe('regionCode', () => {
    it('should have the correct region when adding the region code', () => {
        const region = regionCode('America/New_York');
        expect(region).toBe('New York');
    });

    it("should show an empty string if there's an issue with the region code", () => {
        const region = regionCode('');
        expect(region).toBe('');
    });
});
