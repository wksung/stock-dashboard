// MUI
import { ThemeProvider } from '@mui/material/styles';

// API
import { getGeneralNews } from '../../api/GeneralNews';
import { getCompanyNews } from '../../api/CompanyNews';

// SCSS
import theme from '../../styles/theme';

// REACT
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import News from './News';

jest.mock('../../api/GeneralNews');
const MockGeneralNews = [
    {
        category: 'top news',
        datetime: 1729125300,
        headline:
            'Expedia stock jumps on report of acquisition interest by Uber',
        id: 7418583,
        image: 'https://static2.finnhub.io/file/publicdatany/finnhubimage/market_watch_logo.png',
        related: '',
        source: 'MarketWatch',
        summary:
            'Shares of Expedia Group Inc. jumped more than 7% in after-hours trading Wednesday after the Financial Times reported Uber Technologies Inc. was considering  a bid to buy the online travel company.',
        url: 'https://www.marketwatch.com/story/expedia-stock-jumps-on-report-of-acquisition-interest-by-uber-808da5d6',
    },
    {
        category: 'top news',
        datetime: 1729119480,
        headline:
            'Elon Musk selects Omead Afshar to lead Tesla’s North America, Europe operations: report',
        id: 7418567,
        image: 'https://static2.finnhub.io/file/publicdatany/finnhubimage/market_watch_logo.png',
        related: '',
        source: 'MarketWatch',
        summary:
            'Amid slumping share prices and electric-vehicle demand, Tesla Inc. Chief Executive Elon Musk has reportedly shaken things up at the company’s business in North America and Europe.',
        url: 'https://www.marketwatch.com/story/elon-musk-selects-omead-afshar-to-lead-teslas-north-america-europe-operations-report-f1253b6e',
    },
    {
        category: 'top news',
        datetime: 1729117800,
        headline:
            'Retail investors are trading stocks like the pros — so brokers are giving them the tools they want',
        id: 7418564,
        image: 'https://static2.finnhub.io/file/publicdatany/finnhubimage/market_watch_logo.png',
        related: '',
        source: 'MarketWatch',
        summary:
            'As retail investors get more sophisticated, Robinhood has tried to, as well.',
        url: 'https://www.marketwatch.com/story/retail-investors-are-trading-stocks-like-the-pros-so-brokers-are-giving-them-the-tools-they-want-c048d9f4',
    },
    {
        category: 'top news',
        datetime: 1729116120,
        headline:
            'A lot of your personal wealth is tied up in your employer. How to spread out the risk.',
        id: 7418562,
        image: 'https://static2.finnhub.io/file/publicdatany/finnhubimage/market_watch_logo.png',
        related: '',
        source: 'MarketWatch',
        summary:
            'Direct indexing and individualized portfolios can help an investor avoid overexposure to an employer’s stock',
        url: 'https://www.marketwatch.com/story/a-lot-of-your-personal-wealth-is-tied-up-in-your-employer-how-to-spread-out-the-risk-d7afc6c0',
    },
    {
        category: 'top news',
        datetime: 1729115880,
        headline:
            'Disney will now charge up to $449 extra for front-of-line access. Why this VIP-ification is now common in America.',
        id: 7418557,
        image: 'https://static2.finnhub.io/file/publicdatany/finnhubimage/market_watch_logo.png',
        related: '',
        source: 'MarketWatch',
        summary:
            'Companies want to extract every dollar they can from customers, say experts. But many consumers welcome the opportunity to feel like big shots.',
        url: 'https://www.marketwatch.com/story/disney-will-now-charge-up-to-449-extra-for-front-of-line-access-why-this-vip-ification-is-now-common-in-america-1519c207',
    },
];

jest.mock('../../api/CompanyNews');
const MockCompanyNews = [
    {
        category: 'company',
        datetime: 1729131480,
        headline: 'At Tesla, Musk Taps Close Confidant for Top Executive Role',
        id: 130503407,
        image: '',
        related: 'TSLA',
        source: 'Yahoo',
        summary:
            'Omead Afshar, who used to work in the office of the CEO, has moved into a vice president role with sales and manufacturing operations under him.',
        url: 'https://finnhub.io/api/news?id=0e4ca4344ba7021821b768be355a9aa149052caf4145956dfe8ceddb4d540f3f',
    },
    {
        category: 'company',
        datetime: 1729131480,
        headline: 'Up in Space; Out to Sea',
        id: 130503405,
        image: 'https://g.foolcdn.com/editorial/images/794171/mfm_14.jpg',
        related: 'TSLA',
        source: 'Yahoo',
        summary:
            'Motley Fool investors chew over SpaceX, China stimulus, the cruise industry, and more.',
        url: 'https://finnhub.io/api/news?id=c1205a27138566a26276704ed0033111122696831c2b90bcaa4ae47dde699dbc',
    },
    {
        category: 'company',
        datetime: 1729124373,
        headline: 'Tesla: Fairly Significant Doubt After The Cybercab Event',
        id: 130504361,
        image: 'https://static.seekingalpha.com/cdn/s3/uploads/getty_images/1263574476/image_1263574476.jpg?io=getty-c-w1536',
        related: 'TSLA',
        source: 'SeekingAlpha',
        summary:
            "Tesla's self-driving technology faces a critical 12-18 month period. Click here to read more about TSLA stock and why it is a Sell.",
        url: 'https://finnhub.io/api/news?id=e0c819ebb3ba6a0df0fbeae62520013bbdac0d072f2a9405fc8418a804b966ed',
    },
    {
        category: 'company',
        datetime: 1729121103,
        headline: 'Tesla: Time To Be Careful (Technical Analysis)',
        id: 130503713,
        image: 'https://static.seekingalpha.com/cdn/s3/uploads/getty_images/1386070484/image_1386070484.jpg?io=getty-c-w1536',
        related: 'TSLA',
        source: 'SeekingAlpha',
        summary:
            'Tesla disappoints investors with Robotaxi event, misses delivery expectations, and faces pressure on operating margins. Read why TSLA stock is a Hold.',
        url: 'https://finnhub.io/api/news?id=63f8361bb25938dc8105f269d1919a74cea11eba6eed5674c7512349ce9e2620',
    },
    {
        category: 'company',
        datetime: 1729117080,
        headline:
            'Musk Taps Longtime Aide to Oversee Tesla’s Operations in North America, Europe',
        id: 130501912,
        image: 'https://s.yimg.com/ny/api/res/1.2/e.QffVkm2PdkNnRuoSYcSg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02MDA-/https://media.zenfs.com/en/wsj.com/5a83f1a533e84fc68b63da0a99d67b4e',
        related: 'TSLA',
        source: 'Yahoo',
        summary:
            'Omead Afshar, who used to work in the office of the CEO, has moved into a vice president role with sales and manufacturing operations under him.',
        url: 'https://finnhub.io/api/news?id=03d8aa0b57981ccbdddbba1b952834e33a6a2e1eb361293638dcb1accd4503c8',
    },
];

const MockNews = () => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <News />
            </BrowserRouter>
        </ThemeProvider>
    );
};

describe('News', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (getGeneralNews as jest.Mock).mockResolvedValue(MockGeneralNews);
        (getCompanyNews as jest.Mock).mockResolvedValue(MockCompanyNews);
    });

    it('should show up news articles on load', async () => {
        await act(async () => render(<MockNews />));
        const newsCard = screen.getAllByTestId(/news__item-/i);
        expect(newsCard.length).toBe(MockCompanyNews.length);
    });

    describe('Form Inputs', () => {
        it('should render input element', async () => {
            await act(async () => render(<MockNews />));
            const inputField = screen.getByTestId('news_search_stock');
            fireEvent.change(inputField, { target: { value: 'TSLA' } });
            expect((inputField as HTMLInputElement).value).toBe('TSLA');
        });

        it('should render from date input element', async () => {
            await act(async () => render(<MockNews />));
            const inputField = screen.getByTestId('news_search_fromdate');
            fireEvent.change(inputField, { target: { value: '2024-10-10' } });
            expect((inputField as HTMLInputElement).value).toBe('2024-10-10');
        });

        it('should render end date input element', async () => {
            await act(async () => render(<MockNews />));
            const inputField = screen.getByTestId('news_search_enddate');
            fireEvent.change(inputField, { target: { value: '2024-10-17' } });
            expect((inputField as HTMLInputElement).value).toBe('2024-10-17');
        });
    });

    describe('Submit Output', () => {
        it('should show up 0 news article when nothing is submitted', async () => {
            (getCompanyNews as jest.Mock).mockResolvedValue([]);

            await act(async () => render(<MockNews />));
            const stockSearchBtn = screen.getByTestId('news_search_submit');
            await act(async () => fireEvent.click(stockSearchBtn));
            expect(
                screen.getByText(
                    /Please input the correct stock ticker or date/i,
                ),
            ).toBeInTheDocument();
        });

        it('should show up news articles when you submit a specific stock with no dates', async () => {
            await act(async () => render(<MockNews />));
            const stockSearchField = screen.getByTestId('news_search_stock');
            await act(async () =>
                fireEvent.change(stockSearchField, {
                    target: { value: 'TSLA' },
                }),
            );
            const stockSearchBtn = screen.getByTestId('news_search_submit');
            await act(async () => fireEvent.click(stockSearchBtn));
            const searchOutputText = screen.getByTestId(
                'news_search_output_text',
            );

            const today = new Date();
            const lastWeek = new Date(
                new Date().setDate(new Date().getDate() - 7),
            );
            const fd = `${lastWeek.getFullYear()}-${(lastWeek.getMonth() + 1).toString().padStart(2, '0')}-${lastWeek.getDate().toString().padStart(2, '0')}`;
            const ed = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

            if (searchOutputText.textContent) {
                expect(searchOutputText.textContent.replaceAll(/\s/g, '')).toBe(
                    `There are currently ${MockCompanyNews.length} news article from ${fd} to ${ed} for stock: ${(stockSearchField as HTMLInputElement).value}`.replaceAll(
                        /\s/g,
                        '',
                    ),
                );
            }
        });

        it('should show up news articles when you submit a specific stock with dates', async () => {
            await act(async () => render(<MockNews />));
            const stockSearchField = screen.getByTestId('news_search_stock');
            await act(async () =>
                fireEvent.change(stockSearchField, {
                    target: { value: 'TSLA' },
                }),
            );
            const fromDateField = screen.getByTestId('news_search_fromdate');
            await act(async () =>
                fireEvent.change(fromDateField, {
                    target: { value: '2024-10-17' },
                }),
            );
            const endDateField = screen.getByTestId('news_search_enddate');
            await act(async () =>
                fireEvent.change(endDateField, {
                    target: { value: '2024-10-17' },
                }),
            );
            const stockSearchBtn = screen.getByTestId('news_search_submit');
            await act(async () => fireEvent.click(stockSearchBtn));
            const searchOutputText = screen.getByTestId(
                'news_search_output_text',
            );
            if (searchOutputText.textContent) {
                expect(searchOutputText.textContent.replaceAll(/\s/g, '')).toBe(
                    `There are currently ${MockCompanyNews.length} news article from ${(fromDateField as HTMLInputElement).value} to ${(endDateField as HTMLInputElement).value} for stock: ${(stockSearchField as HTMLInputElement).value}`.replaceAll(
                        /\s/g,
                        '',
                    ),
                );
            }
        });
    });
});
