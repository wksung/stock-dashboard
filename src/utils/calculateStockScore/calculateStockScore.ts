import { CompanyRecommendations } from '../../types/companyrecommendations';
import { MyStock } from '../../types/mystock';

export const calculateStockScore = (
    stockRatings: CompanyRecommendations[][],
    stockData: MyStock[],
): number => {
    const ratingWeights = {
        strongBuy: 1.5,
        buy: 1.0,
        hold: 0.5,
        sell: -1.0,
        strongSell: -1.5,
    };

    let totalWeightedScore = 0;
    let totalPossibleScore = 0;

    stockRatings.forEach((ratingsGroup: CompanyRecommendations[]) => {
        if (ratingsGroup.length === 0) return;

        // Get the most recent rating (latest period) by assuming the first item in each group is the latest
        const latestRating = ratingsGroup[0];
        const symbol = latestRating.symbol;
        const stock = stockData.find((s: any) => s.stock === symbol);
        const quantity = stock ? parseInt(stock.quantity, 10) : 0;

        if (quantity === 0) return;

        // Calculate the score for the latest rating
        const score =
            latestRating.strongBuy * ratingWeights.strongBuy +
            latestRating.buy * ratingWeights.buy +
            latestRating.hold * ratingWeights.hold +
            latestRating.sell * ratingWeights.sell +
            latestRating.strongSell * ratingWeights.strongSell;

        // Calculate the maximum possible score for the latest rating
        const totalRatingsCount =
            latestRating.strongBuy +
            latestRating.buy +
            latestRating.hold +
            latestRating.sell +
            latestRating.strongSell;
        const maxPossibleScore = totalRatingsCount * ratingWeights.strongBuy;

        // Add weighted score to total
        totalWeightedScore += score * quantity;
        totalPossibleScore += maxPossibleScore * quantity;
    });

    // Normalize the score to be out of 100
    return totalPossibleScore > 0
        ? (totalWeightedScore / totalPossibleScore) * 100
        : 0;
};
