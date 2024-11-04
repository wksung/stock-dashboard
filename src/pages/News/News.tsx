// MUI
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import {
    useTheme,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    Button,
} from '@mui/material';

// SCSS
import '../../styles/Global.scss';
import './News.scss';

// REACT
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsCard from '../../components/NewsCard/NewsCard';

// TYPES
import { GeneralNews } from '../../types/generalnews';

// API
import { getGeneralNews } from '../../api/GeneralNews';
import { getCompanyNews } from '../../api/CompanyNews';

// UTIL
import { formatDate } from '../../utils/formatDate/formatDate';

const News = () => {
    // styling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;

    // states
    const [stock, setStock] = useState<string>('');
    const [fromDate, setFromDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [news, setNews] = useState<GeneralNews[]>([]);
    const [generalNews, setGeneralNews] = useState<boolean>(true);

    // react router
    const location = useLocation();
    const navigate = useNavigate();

    // mounted
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('ticker')?.length) {
            // if query is within URL run searchStock
            const today = new Date();
            const lastWeek = new Date(
                new Date().setDate(new Date().getDate() - 7),
            );
            const fd = `${lastWeek.getFullYear()}-${(lastWeek.getMonth() + 1).toString().padStart(2, '0')}-${lastWeek.getDate().toString().padStart(2, '0')}`;
            const ed = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
            searchStock(queryParams.get('ticker') || '', fd, ed);
        } else {
            // search for main news
            if (stock.length === 0) {
                const fetchData = async () => {
                    const response = await getGeneralNews();
                    setNews(response);
                };
                fetchData();
            }
        }
    }, [location.search, stock.length]);

    // form input
    const searchStockNews = useCallback(
        async (s = '') => {
            // from query URL
            let temp = stock;
            if (s) temp = s;

            const from_date = new Date(fromDate);
            const end_date = new Date(endDate);

            // get the dates
            let fd = `${from_date.getFullYear()}-${(from_date.getMonth() + 1).toString().padStart(2, '0')}-${from_date.getDate().toString().padStart(2, '0')}`;
            let ed = `${end_date.getFullYear()}-${(end_date.getMonth() + 1).toString().padStart(2, '0')}-${end_date.getDate().toString().padStart(2, '0')}`;

            // if both input for date is null then find last week
            if (fromDate === null && endDate === null) {
                const today = new Date();
                const lastWeek = new Date(
                    new Date().setDate(new Date().getDate() - 7),
                );
                fd = `${lastWeek.getFullYear()}-${(lastWeek.getMonth() + 1).toString().padStart(2, '0')}-${lastWeek.getDate().toString().padStart(2, '0')}`;
                ed = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
            }

            searchStock(temp, fd, ed);
        },
        [stock, fromDate, endDate],
    );

    // run stock news from specific date range
    const searchStock = async (stock: string, from: string, to: string) => {
        const response = await getCompanyNews(stock, from, to);
        setNews(response);
        setGeneralNews(false);
    };

    // change in stock input
    const changeStockInput = (value: string) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete('ticker');
        navigate(`${location.pathname}?${searchParams.toString()}`, {
            replace: true,
        });
        setStock(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    return (
        <Box
            id="news"
            className="page"
            sx={{
                backgroundColor: theme.palette.background.paper,
                marginLeft: customSpacing.l,
                padding: customSpacing.l,
            }}
        >
            <div className="page__titles">
                <Typography variant="h1" style={{ margin: customSpacing.none }}>
                    News & Media
                </Typography>
                <Typography
                    variant="body1"
                    style={{
                        margin: customSpacing.none,
                        marginTop: customSpacing.s,
                    }}
                >
                    Stay updated with real-time market insights, breaking
                    financial news, and trends.
                </Typography>
            </div>
            <div
                className="page__content"
                style={{ marginTop: customSpacing.l }}
            >
                <div className="page__content-search">
                    <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                            Search Stock News by Symbol
                        </InputLabel>
                        <Input
                            inputProps={{ 'data-testid': 'news_search_stock' }}
                            id="input-with-icon-adornment"
                            onChange={(e) => changeStockInput(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon
                                        style={{
                                            fill: theme.palette.text.primary,
                                        }}
                                    />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <div
                        className="page__content-search-date"
                        style={{ marginLeft: customSpacing.m }}
                    >
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                                From Date
                            </InputLabel>
                            <Input
                                inputProps={{
                                    'data-testid': 'news_search_fromdate',
                                }}
                                id="input-with-icon-adornment"
                                type="date"
                                onChange={(e) => setFromDate(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <CalendarMonthOutlinedIcon
                                            style={{
                                                fill: theme.palette.text
                                                    .primary,
                                            }}
                                        />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </div>
                    <div
                        className="page__content-search-date"
                        style={{ marginLeft: customSpacing.m }}
                    >
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                                From Date
                            </InputLabel>
                            <Input
                                inputProps={{
                                    'data-testid': 'news_search_enddate',
                                }}
                                id="input-with-icon-adornment"
                                type="date"
                                onChange={(e) => setEndDate(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <CalendarMonthOutlinedIcon
                                            style={{
                                                fill: theme.palette.text
                                                    .primary,
                                            }}
                                        />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </div>
                    <Button
                        variant="outlined"
                        data-testid="news_search_submit"
                        style={{ marginLeft: customSpacing.m, padding: '12px' }}
                        onClick={() => searchStockNews()}
                    >
                        Search Stock
                    </Button>
                </div>
                <div
                    className="page__content-news"
                    style={{ marginTop: customSpacing.l }}
                >
                    <p
                        className="page__content-news-length"
                        data-testid="news_search_output_text"
                        style={{
                            margin: customSpacing.none,
                            marginBottom: customSpacing.m,
                            fontSize: theme.typography.body1.fontSize,
                        }}
                    >
                        {generalNews
                            ? `There are currently ${news.length} news article`
                            : news.length === 0
                              ? `Please input the correct stock ticker or date`
                              : `There are currently ${news.length} news article from
                            ${endDate === null ? ' ' + formatDate(new Date(new Date().setDate(new Date().getDate() - 7))) : endDate} to 
                            ${endDate === null ? ' ' + formatDate(new Date()) : endDate} for stock: ${stock ? stock : ''}`}
                    </p>
                    {news.map((n) => {
                        return <NewsCard news={n} key={n?.id} />;
                    })}
                </div>
            </div>
        </Box>
    );
};

export default News;
