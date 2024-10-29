import { formatDate } from "./formatDate";

describe("formatDate", () => {
    
    it("should format the date correctly when adding the current date", () => {
        const currentDateSplit = formatDate(new Date()).split("-");

        expect(currentDateSplit[0]).toBe(new Date().getUTCFullYear().toString());
        expect(currentDateSplit[1]).toBe((new Date().getMonth() + 1).toString());
        expect(currentDateSplit[2]).toBe(new Date().getDate().toString());
    });

});