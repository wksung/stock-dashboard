// MUI
import { ThemeProvider } from '@mui/material/styles';

// API
import { getMarketStatus } from '../../api/MarketStatus';
import { getGeneralNews } from '../../api/GeneralNews';
import { getCompanyQuote } from '../../api/CompanyQuote';
import { getCompanyProfile } from '../../api/CompanyProfile';
import { getCompanyRecommendations } from '../../api/CompanyRecommendations';

// SCSS
import theme from '../../styles/theme';

// REACT
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const MockMyStocks = [
    { "stock": "TSLA", "price": 100, "quantity": "100" },
    { "stock": "NVDA", "price": 100, "quantity": "50" }
]

jest.mock('../../api/MarketStatus');
const MockMarketStatus = { "exchange": "US", "holiday": null, "isOpen": false, "session": null, "t": 1728972004, "timezone": "America/New_York" }

jest.mock('../../api/GeneralNews');
const MockGeneralNews = [
    { "headline": "United Airlines sheds unprofitable capacity in better-than-expected quarter", "id": 7418174, "url": "https://www.marketwatch.com/story/united-airlines-sheds-unprofitable-capacity-in-better-than-expected-quarter-00c76d2b" },
    { "headline": "WNBA players only get 9.3% of league revenue — here’s how much NBA, NFL and NHL players get", "id": 7418175, "url": "https://www.marketwatch.com/story/wnba-players-only-get-9-3-of-league-revenue-heres-how-much-nba-nfl-and-nhl-players-get-0abef80c" }
]

jest.mock('../../api/CompanyQuote');
const MockCompanyQuotes = [
    { "c": 219.57, "d": 0.41, "dp": 0.1871, "h": 224.26, "l": 217.12, "o": 220.01, "pc": 219.16, "t": 1729022400 },
    { "c": 131.6, "d": -6.47, "dp": -4.686, "h": 138.57, "l": 128.74, "o": 137.87, "pc": 138.07, "t": 1729022400 }
]
const QuotesTickerMap: Record<'TSLA' | 'NVDA', typeof MockCompanyQuotes[number]> = {
    'TSLA': MockCompanyQuotes[0],
    'NVDA': MockCompanyQuotes[1],
};

jest.mock('../../api/CompanyProfile');
const MockCompanyProfiles = [
    { "country": "US", "currency": "USD", "estimateCurrency": "USD", "exchange": "NASDAQ NMS - GLOBAL MARKET", "finnhubIndustry": "Automobiles", "ipo": "2013-03-06", "logo": "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/TSLA.png", "marketCapitalization": 701447.2001460384, "name": "Tesla Inc", "phone": "15125168177", "shareOutstanding": 3189.2, "ticker": "TSLA", "weburl": "https://www.tesla.com/" },
    { "country": "US", "currency": "USD", "estimateCurrency": "USD", "exchange": "NASDAQ NMS - GLOBAL MARKET", "finnhubIndustry": "Semiconductors", "ipo": "1999-01-22", "logo": "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/NVDA.png", "marketCapitalization": 3228148.17124394, "name": "NVIDIA Corp", "phone": "14084862000", "shareOutstanding": 24530, "ticker": "NVDA", "weburl": "https://www.nvidia.com/" }
]
const ProfilesTickerMap: Record<'TSLA' | 'NVDA', typeof MockCompanyProfiles[number]> = {
    'TSLA': MockCompanyProfiles[0],
    'NVDA': MockCompanyProfiles[1],
};

jest.mock("../../api/CompanyRecommendations");
const MockCompanyRecommendations = [
    [
        { "buy": 17, "hold": 20, "period": "2024-10-01", "sell": 8, "strongBuy": 10, "strongSell": 4, "symbol": "TSLA" },
        { "buy": 16, "hold": 21, "period": "2024-09-01", "sell": 8, "strongBuy": 10, "strongSell": 4, "symbol": "TSLA" },
        { "buy": 14, "hold": 21, "period": "2024-08-01", "sell": 8, "strongBuy": 9, "strongSell": 4, "symbol": "TSLA" },
        { "buy": 16, "hold": 20, "period": "2024-07-01", "sell": 6, "strongBuy": 10, "strongSell": 4, "symbol": "TSLA"  }
    ],
    [
        { "buy": 41, "hold": 6, "period": "2024-10-01", "sell": 0, "strongBuy": 23, "strongSell": 0, "symbol": "NVDA" },
        { "buy": 41, "hold": 6, "period": "2024-09-01", "sell": 0, "strongBuy": 20, "strongSell": 0, "symbol": "NVDA" },
        { "buy": 39, "hold": 6, "period": "2024-08-01", "sell": 0, "strongBuy": 20, "strongSell": 0, "symbol": "NVDA" },
        { "buy": 37, "hold": 6, "period": "2024-07-01", "sell": 0, "strongBuy": 21, "strongSell": 0, "symbol": "NVDA" }
    ]
]
const RecommendationsTickerMap = {
    'TSLA': MockCompanyRecommendations[0],
    'NVDA': MockCompanyRecommendations[1],
};

const MockDashboard = () => {
    return (
        <ThemeProvider theme={ theme }>
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        </ThemeProvider>
    )
}

describe("Dashboard", () => {

    // clears Mock API for each tests and run again
    beforeEach(() => {
        jest.clearAllMocks();

        localStorage.setItem('myStocks', JSON.stringify(MockMyStocks));

        // this mocks the API for company recommendations (different to mockResolvedValue due to promise.all)
        (getCompanyQuote as jest.Mock).mockImplementation((ticker: 'TSLA' | 'NVDA') => QuotesTickerMap[ticker] ? Promise.resolve(QuotesTickerMap[ticker]) : Promise.resolve([]));
        (getCompanyProfile as jest.Mock).mockImplementation((ticker: 'TSLA' | 'NVDA') => ProfilesTickerMap[ticker] ? Promise.resolve(ProfilesTickerMap[ticker]) : Promise.resolve([]));
        (getCompanyRecommendations as jest.Mock).mockImplementation((ticker: 'TSLA' | 'NVDA') => RecommendationsTickerMap[ticker] ? Promise.resolve(RecommendationsTickerMap[ticker]) : Promise.resolve([]));
        
        // standard API call
        (getMarketStatus as jest.Mock).mockResolvedValue(MockMarketStatus);
        (getGeneralNews as jest.Mock).mockResolvedValue(MockGeneralNews);
    });

    it("should show a message if the user has no stocks", async () => {
        localStorage.clear();
        
        await act(async () => render(<MockDashboard />));
        const noStockAvailable = screen.getByTestId("no__stock");
        expect(noStockAvailable).toBeInTheDocument();
    });

    describe("Market Status", () => {
        it("should show the market status as being closed", async () => {
            await act(async () => render(<MockDashboard />));
            expect(screen.getByText(/MARKET STATUS: CLOSED/i)).toBeInTheDocument();
        });
    
        it("should show the market status as being open", async () => {
            // set isOpen as true to mock the API
            const openMarketStatus = { ...MockMarketStatus, isOpen: true };
            (getMarketStatus as jest.Mock).mockResolvedValue(openMarketStatus);

            await act(async () => render(<MockDashboard />));
            expect(screen.getByText(/MARKET STATUS: OPEN/i)).toBeInTheDocument();
        });
        
        it("should show the correct time of the market", async () => {
            await act(async () => render(<MockDashboard />));
            const currentTime = new Date(MockMarketStatus.t*1000).toLocaleString('en-US', { timeZone: MockMarketStatus.timezone });
            expect(screen.getByText(new RegExp(currentTime))).toBeInTheDocument();
        });
    });

    describe("Top News", () => {
        it("should show 2 news article as a top news section", async () => {
            await act(async () => render(<MockDashboard />));
            const newsArticles = await screen.findAllByTestId("news__article");
            expect(newsArticles).toHaveLength(2);
        });
    });

    describe("Portfolio Score", () => {
        it("should show your score", async () => {
            await act(async () => render(<MockDashboard />));
            const portfolioScore = await screen.findByTestId("portfolio__score");
            expect(portfolioScore != null && portfolioScore.textContent != null && +portfolioScore.textContent).toBeGreaterThan(0);
        });
        
        it("should show the information popup", async () => {
            await act(async () => render(<MockDashboard />));
            const portfolioPopupBtn = await screen.findByTestId("portfolio__score-btn");

            await act(async () => portfolioPopupBtn.click());
            const portfolioPopup = await screen.findByTestId("portfolio__score-btn-modal");
            expect(portfolioPopup).toBeVisible();
        });
    });

    describe("Portfolio Value", () => {
        it("should show the total portfolio value", async () => {
            await act(async () => render(<MockDashboard />));
            const portfolioValue = await screen.findByTestId("portfolio__value");
            expect(portfolioValue.textContent).not.toEqual("$0.00");
        });

        it("should show the profit amount in dollars", async () => {
            await act(async () => render(<MockDashboard />));
            const portfolioValueDollar = await screen.findByTestId("portfolio__profit_in_d");
            expect(portfolioValueDollar.textContent).not.toEqual("$0.00");
        });

        it("should show the profit amount in percentages", async () => {
            await act(async () => render(<MockDashboard />));
            const portfolioValuePercentage = await screen.findByTestId("portfolio__value_in_p");
            expect(portfolioValuePercentage.textContent).not.toEqual("(0.00%)");
        });
    });

    describe("Portfolio Industries", () => {
        it("should show all the industries", async () => {
            await act(async () => render(<MockDashboard />));
            
            const portfolioIndustry = await screen.findAllByTestId(/portfolio__industry-/i);
            expect(portfolioIndustry.length).toBe(2);
        });
    });

    describe("Portfolio Table", () => {
        it("should show all the stocks the user has on a table", async () => {
            await act(async () => render(<MockDashboard />));
            
            const stockLineItems = await screen.findAllByTestId(/stock-line-/i);
            expect(stockLineItems.length).toBe(MockMyStocks.length);
        });
    });

});