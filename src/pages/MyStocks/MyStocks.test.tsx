// MUI
import { ThemeProvider } from '@mui/material/styles';

// API
import { getCompanyQuote } from '../../api/CompanyQuote';
import { getCompanyProfile } from '../../api/CompanyProfile';

// SCSS
import theme from '../../styles/theme';

// REACT
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyStocks from './MyStocks';

const MockMyStocks = [
    { stock: 'TSLA', price: 100, quantity: '100' },
    { stock: 'NVDA', price: 100, quantity: '50' },
];

jest.mock('../../api/CompanyQuote');
const MockCompanyQuotes = [
    {
        c: 221.33,
        d: 1.76,
        dp: 0.8016,
        h: 222.8199,
        l: 218.93,
        o: 221.4,
        pc: 219.57,
        t: 1729108800,
    },
    {
        c: 135.72,
        d: 4.12,
        dp: 3.1307,
        h: 136.62,
        l: 131.58,
        o: 133.98,
        pc: 131.6,
        t: 1729108800,
    },
];
const QuotesTickerMap: Record<
    'TSLA' | 'NVDA',
    (typeof MockCompanyQuotes)[number]
> = {
    TSLA: MockCompanyQuotes[0],
    NVDA: MockCompanyQuotes[1],
};

jest.mock('../../api/CompanyProfile');
const MockCompanyProfile = [
    {
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
    },
    {
        country: 'US',
        currency: 'USD',
        estimateCurrency: 'USD',
        exchange: 'NASDAQ NMS - GLOBAL MARKET',
        finnhubIndustry: 'Semiconductors',
        ipo: '1999-01-22',
        logo: 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/NVDA.png',
        marketCapitalization: 3228148.17124394,
        name: 'NVIDIA Corp',
        phone: '14084862000',
        shareOutstanding: 24530,
        ticker: 'NVDA',
        weburl: 'https://www.nvidia.com/',
    },
];
const CompanyTickerMap: Record<
    'TSLA' | 'NVDA',
    (typeof MockCompanyProfile)[number]
> = {
    TSLA: MockCompanyProfile[0],
    NVDA: MockCompanyProfile[1],
};

const MockMyStocksDiv = () => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MyStocks />
            </BrowserRouter>
        </ThemeProvider>
    );
};

describe('MyStocks', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        localStorage.setItem('myStocks', JSON.stringify(MockMyStocks));
        (getCompanyQuote as jest.Mock).mockImplementation(
            (ticker: 'TSLA' | 'NVDA') =>
                QuotesTickerMap[ticker]
                    ? Promise.resolve(QuotesTickerMap[ticker])
                    : Promise.resolve([]),
        );
        (getCompanyProfile as jest.Mock).mockImplementation(
            (ticker: 'TSLA' | 'NVDA') =>
                CompanyTickerMap[ticker]
                    ? Promise.resolve(CompanyTickerMap[ticker])
                    : Promise.resolve([]),
        );
    });

    it('should show messaging if you have no stocks available', async () => {
        localStorage.clear();

        await act(async () => render(<MockMyStocksDiv />));
        const noStocksMessaging = screen.getByText(
            /You currently have no stocks in your list./i,
        );
        expect(noStocksMessaging).toBeInTheDocument();
    });

    describe('Table View', () => {
        it('should show all the stocks in a table list', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const stockListItems = screen.getAllByTestId(/stocklist-/i);
            expect(stockListItems.length).toBe(MockMyStocks.length);
        });

        it('should show the total bought price of your stocks', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const totalBoughtPrice = screen.getByTestId('total__bought__price');
            expect(totalBoughtPrice).toBeInTheDocument();
        });

        it('should show the current price of your stocks', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const totalCurrentPrice = screen.getByTestId(
                'total__current__price',
            );
            expect(totalCurrentPrice).toBeInTheDocument();
        });

        it('should show the change price of your stocks', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const totalChangePrice = screen.getByTestId('total__change__price');
            expect(totalChangePrice).toBeInTheDocument();
        });
    });

    describe('Update & Delete Stocks', () => {
        it('should show the update buttons on each stock list', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const updateBtns = screen.getAllByTestId(/update__stock-btn/i);
            expect(updateBtns.length).toBe(MockMyStocks.length);
        });

        it('should show the popup when you press the update button', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const updateBtns = screen.getAllByTestId(/update__stock-btn/i);
            await act(async () => fireEvent.click(updateBtns[0]));
            const popUpModal = screen.getByText(/EDIT TSLA/i);
            expect(popUpModal).toBeInTheDocument();
        });

        it('should be able to update a specific stock in your list', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const updateBtns = screen.getAllByTestId(/update__stock-btn/i);
            await act(async () => fireEvent.click(updateBtns[0]));
            const popUpModalPrice = screen.getByTestId('popup__modal-price');
            await act(async () =>
                fireEvent.change(popUpModalPrice, { target: { value: '200' } }),
            );
            const editBtn = screen.getByText(/Edit Stock/i);
            await act(async () => fireEvent.click(editBtn));
            const boughtPrice = screen.getAllByTestId('bought__price');
            expect(boughtPrice[0].textContent).toBe('$200.00');
        });

        it('should show the delete buttons on each stock list', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const deleteBtns = screen.getAllByTestId(/delete__stock-btn/i);
            expect(deleteBtns.length).toBe(MockMyStocks.length);
        });

        it('should be able to delete a stock in your list', async () => {
            await act(async () => render(<MockMyStocksDiv />));
            const deleteBtns = screen.getAllByTestId(/delete__stock-btn/i);
            await act(async () => fireEvent.click(deleteBtns[0]));
            const stockListItems = screen.getAllByTestId(/stocklist-/i);
            expect(stockListItems.length).not.toBe(MockMyStocks.length);
        });
    });
});
