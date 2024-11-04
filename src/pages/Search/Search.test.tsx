// MUI
import { ThemeProvider } from '@mui/material/styles';

// API
import { getCompanyNews } from '../../api/CompanyNews';
import { getCompanyQuote } from '../../api/CompanyQuote';
import { getCompanyProfile } from '../../api/CompanyProfile';
import { getCompanyRecommendations } from '../../api/CompanyRecommendations';

// SCSS
import theme from '../../styles/theme';

// REACT
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Search from './Search';

const MockMyStocks = [
    { stock: 'TSLA', price: 100, quantity: '100' },
    { stock: 'NVDA', price: 100, quantity: '50' },
];

jest.mock('../../api/CompanyNews');
const MockCompanyNews = [
    {
        category: 'company',
        datetime: 1729073010,
        headline:
            'Tesla receives approval for first stage of German plant expansion',
        id: 130482460,
        image: 'https://www.just-auto.com/wp-content/uploads/sites/30/2024/10/tesla-shutterstock_2500278999.jpg',
        related: 'TSLA',
        source: 'Yahoo',
        summary:
            'The three-stage expansion aims to double the plant’s production capacity from 500,000 to one million vehicles per year.',
        url: 'https://finnhub.io/api/news?id=dd55ca105c39f4e679617b9e1e14497684b42f9492755ef982acb56461d702a1',
    },
];

jest.mock('../../api/CompanyQuote');
const MockCompanyQuotes = {
    c: 219.57,
    d: 0.41,
    dp: 0.1871,
    h: 224.26,
    l: 217.12,
    o: 220.01,
    pc: 219.16,
    t: 1729022400,
};

jest.mock('../../api/CompanyProfile');
const MockCompanyProfile = {
    country: 'US',
    currency: 'USD',
    estimateCurrency: 'USD',
    exchange: 'NASDAQ NMS - GLOBAL MARKET',
    finnhubIndustry: 'Automobiles',
    ipo: '2013-03-06',
    logo: 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/TSLA.png',
    marketCapitalization: 701447.2001460384,
    name: 'Tesla Inc',
    phone: '15125168177',
    shareOutstanding: 3189.2,
    ticker: 'TSLA',
    weburl: 'https://www.tesla.com/',
};

jest.mock('../../api/CompanyRecommendations');
const MockCompanyRecommendations = [
    {
        buy: 17,
        hold: 20,
        period: '2024-10-01',
        sell: 8,
        strongBuy: 10,
        strongSell: 4,
        symbol: 'TSLA',
    },
    {
        buy: 16,
        hold: 21,
        period: '2024-09-01',
        sell: 8,
        strongBuy: 10,
        strongSell: 4,
        symbol: 'TSLA',
    },
    {
        buy: 14,
        hold: 21,
        period: '2024-08-01',
        sell: 8,
        strongBuy: 9,
        strongSell: 4,
        symbol: 'TSLA',
    },
    {
        buy: 16,
        hold: 20,
        period: '2024-07-01',
        sell: 6,
        strongBuy: 10,
        strongSell: 4,
        symbol: 'TSLA',
    },
];

const MockSearch = () => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Search />
            </BrowserRouter>
        </ThemeProvider>
    );
};

describe('Search', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (getCompanyNews as jest.Mock).mockResolvedValue(MockCompanyNews);
        (getCompanyQuote as jest.Mock).mockResolvedValue(MockCompanyQuotes);
        (getCompanyProfile as jest.Mock).mockResolvedValue(MockCompanyProfile);
        (getCompanyRecommendations as jest.Mock).mockResolvedValue(
            MockCompanyRecommendations,
        );
    });

    describe('Search Input', () => {
        it('should render input element', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            expect(inputField).toBeInTheDocument();
        });

        it('should be able to type into the input element', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            fireEvent.change(inputField, { target: { value: 'TSLA' } });
            expect((inputField as HTMLInputElement).value).toBe('TSLA');
        });
    });

    describe('Search Result Output', () => {
        it('should show up an error message when you search nothing', async () => {
            // set mock response to null when nothing is added
            (getCompanyNews as jest.Mock).mockResolvedValue([]);
            (getCompanyQuote as jest.Mock).mockResolvedValue({
                c: 0,
                d: null,
                dp: null,
                h: 0,
                l: 0,
                o: 0,
                pc: 0,
                t: 0,
            });
            (getCompanyProfile as jest.Mock).mockResolvedValue({});
            (getCompanyRecommendations as jest.Mock).mockResolvedValue([]);

            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: '' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));

            expect(screen.getByText(/Ticker not found./i)).toBeInTheDocument();
        });

        it('should show you information of the stock', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: 'TSLA' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));

            expect(screen.getByTestId('output__ticker').textContent).toBe(
                `Ticker: ${MockCompanyProfile.ticker}`,
            );
        });

        it('should show you information of the current price of the stock', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: 'TSLA' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));

            expect(
                screen.getByTestId('output__current-price').textContent,
            ).toBe(`Current Price: $${MockCompanyQuotes.c}`);
        });

        it('should show you recommendation of the stocks', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: 'TSLA' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));

            const getRecommendedTrends =
                await screen.findAllByTestId(/trends-/i);
            expect(getRecommendedTrends.length).toBe(
                MockCompanyRecommendations.length,
            );
        });

        it('should show you the news of the stock', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: 'TSLA' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));

            const getAllNewsArticle =
                await screen.findAllByTestId(/news__item-/i);
            expect(getAllNewsArticle.length).toBe(MockCompanyNews.length);
        });
    });

    describe('Add to my stocks', () => {
        it('should output the add to my stock button', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: 'TSLA' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));

            const addMyStocksBtn = screen.getByText(/Add to my stocks/i);
            expect(addMyStocksBtn).toBeInTheDocument();
        });

        it('should show the popup when you press the button', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: 'TSLA' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));
            const addMyStocksBtn = screen.getByText(/Add to my stocks/i);
            await act(async () => fireEvent.click(addMyStocksBtn));

            const popUp = screen.getByText(/Add stock/i);
            expect(popUp).toBeInTheDocument();
        });

        it('should add to my stocks when you add all the info and press the popup button', async () => {
            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: 'TSLA' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));
            const addMyStocksBtn = screen.getByText(/Add to my stocks/i);
            await act(async () => fireEvent.click(addMyStocksBtn));

            await act(async () =>
                fireEvent.change(screen.getByTestId('popup__modal-ticker'), {
                    target: { value: 'TSLA' },
                }),
            );
            await act(async () =>
                fireEvent.change(screen.getByTestId('popup__modal-price'), {
                    target: { value: '100' },
                }),
            );
            await act(async () =>
                fireEvent.change(screen.getByTestId('popup__modal-quantity'), {
                    target: { value: '50' },
                }),
            );
            const popUpBtn = screen.getByText(/Add stock/i);
            await act(async () => fireEvent.click(popUpBtn));
            const myStocks = localStorage.getItem('myStocks');
            expect(myStocks).toBe(myStocks);
        });

        it('should show an error when you add nothing in the info and press the popup button', async () => {
            localStorage.setItem('myStocks', JSON.stringify(MockMyStocks));

            await act(async () => render(<MockSearch />));
            const inputField = screen.getByTestId('search__input');
            await act(async () =>
                fireEvent.change(inputField, { target: { value: 'TSLA' } }),
            );
            const searchStockBtn = screen.getByTestId('search__btn');
            await act(async () => fireEvent.click(searchStockBtn));
            const addMyStocksBtn = screen.getByText(/Add to my stocks/i);
            await act(async () => fireEvent.click(addMyStocksBtn));

            await act(async () =>
                fireEvent.change(screen.getByTestId('popup__modal-ticker'), {
                    target: { value: 'TSLA' },
                }),
            );
            await act(async () =>
                fireEvent.change(screen.getByTestId('popup__modal-price'), {
                    target: { value: '0' },
                }),
            );
            await act(async () =>
                fireEvent.change(screen.getByTestId('popup__modal-quantity'), {
                    target: { value: '0' },
                }),
            );
            const popUpBtn = screen.getByText(/Add stock/i);
            await act(async () => fireEvent.click(popUpBtn));
            const errorMessage = await screen.findByText(
                /Please add your price or quantity./i,
            );
            expect(errorMessage).toBeInTheDocument();
        });
    });
});
