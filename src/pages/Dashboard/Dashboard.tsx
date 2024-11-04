// MUI
import {
    useTheme,
    Typography,
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// SCSS
import '../../styles/Global.scss';
import './Dashboard.scss';

// REACT
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

// TYPES
import { CompanyQuote } from '../../types/companyquote';
import { CompanyProfile } from '../../types/companyprofile';
import { CompanyRecommendations } from '../../types/companyrecommendations';

// API
import { getCompanyQuote } from '../../api/CompanyQuote';
import { getCompanyProfile } from '../../api/CompanyProfile';
import { getCompanyRecommendations } from '../../api/CompanyRecommendations';

// UTIL
import { money } from '../../utils/money/money';
import { regionCode } from '../../utils/regionCode/regionCode';
import { calculateStockScore } from '../../utils/calculateStockScore/calculateStockScore';
import { calculateStockPercentage } from '../../utils/calculateStockPercentage/calculateStockPercentage';

// HOOKS
import useMarketData from '../../hooks/useMarketData/useMarketData';

const Dashboard = () => {
    // styling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;
    const marketTextStyling = {
        fontSize: theme.typography.body2.fontSize,
        margin: customSpacing.none,
    };
    const portfolioTextStyling = {
        fontSize: theme.typography.body1.fontSize,
        margin: customSpacing.none,
        fontWeight: 'bold',
    };
    const industryStyling = {
        fontSize: theme.typography.body2.fontSize,
        margin: customSpacing.none,
        marginTop: customSpacing.xs,
    };

    // states
    const [myQuotes, setMyQuotes] = useState<CompanyQuote[]>([]);
    const [myProfile, setMyProfile] = useState<CompanyProfile[]>([]);
    const [myTrends, setMyTrends] = useState<CompanyRecommendations[][]>([]);
    const [open, setOpen] = useState<boolean>(false);

    const [portfolioScore, setportfolioScore] = useState<number>(0);
    const [portfolioValue, setPortfolioValue] = useState<number>(0);
    const [originalPortfolioValue, setOriginalPortfolioValue] =
        useState<number>(0);
    const [portfolioPercentage, setPortfolioPercentage] = useState<number>(0);
    const [portfolioIndustries, setPortfolioIndustries] = useState<{
        [key: string]: number;
    }>({});

    // hooks
    const { myStocks, marketStatus, marketNews } = useMarketData();

    useEffect(() => {
        setPortfolioPercentage(
            calculateStockPercentage(originalPortfolioValue, portfolioValue),
        );
    }, [originalPortfolioValue, portfolioValue]);

    // listen in on myStocks - get all the required data when the stocks gets added
    useEffect(() => {
        const getStockData = async () => {
            // quote API - through all the stocks
            const fetchAllQuotes = myStocks.map(({ stock }) =>
                getCompanyQuote(stock),
            );
            const quote = await Promise.all(fetchAllQuotes);
            setMyQuotes(quote);

            // profile API - through all the stocks
            const fetchAllProfiles = myStocks.map(({ stock }) =>
                getCompanyProfile(stock),
            );
            const profile = await Promise.all(fetchAllProfiles);
            setMyProfile(profile);

            // trends API - through all the stocks
            const fetchAllRecommendations = myStocks.map(({ stock }) =>
                getCompanyRecommendations(stock),
            );
            const trends = await Promise.all(fetchAllRecommendations);
            setMyTrends(trends);

            // get data for profile & quote and run computation
            if (quote.length && profile.length) {
                // get portfolio value - with current price
                const portfolioValue = myStocks.reduce(
                    (a, b, i) => a + +b.quantity * quote[i]?.c,
                    0,
                );
                setPortfolioValue(portfolioValue);

                // get original portfolio value - with original bought price
                const originalPortfolioValue = myStocks.reduce(
                    (a, b) => a + +b.quantity * +b.price,
                    0,
                );
                setOriginalPortfolioValue(originalPortfolioValue);
            }
        };

        getStockData();
    }, [myStocks]);

    // watch myProfile & myQuotes & myStocks - get the statistics of the industry
    const getPortfolioIndustries = useMemo(() => {
        // add in the industry statistics
        let stats = {} as { [key: string]: number };
        myProfile.forEach((profile, i) => {
            const industry = profile.finnhubIndustry;
            stats[industry] !== undefined
                ? (stats[industry] += myQuotes[i].c * +myStocks[i].quantity)
                : (stats[industry] = myQuotes[i].c * +myStocks[i].quantity);
            stats = Object.fromEntries(
                Object.entries(stats).sort((a, b) => b[1] - a[1]),
            );
        });
        return stats;
    }, [myProfile, myQuotes, myStocks]);

    useEffect(() => {
        setPortfolioIndustries(getPortfolioIndustries);
    }, [getPortfolioIndustries]);

    useEffect(() => {
        setportfolioScore(calculateStockScore(myTrends, myStocks));
    }, [myStocks, myTrends]);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    return (
        <Box
            id="dashboard"
            className="page"
            sx={{
                backgroundColor: theme.palette.background.paper,
                marginLeft: customSpacing.l,
                padding: customSpacing.l,
            }}
        >
            <div className="page__titles">
                <Typography variant="h1" style={{ margin: customSpacing.none }}>
                    Dashboard
                </Typography>
                <Typography
                    variant="body1"
                    style={{
                        margin: customSpacing.none,
                        marginTop: customSpacing.s,
                    }}
                >
                    Access the dashboard to search for stocks, view the latest
                    news, manage your portfolio, and adjust your settings
                    effortlessly.
                </Typography>
            </div>
            <div
                className="page__content"
                style={{ marginTop: customSpacing.l }}
            >
                <Card
                    className="dashboardCard"
                    data-type="marketStatus"
                    variant="outlined"
                    style={{ padding: customSpacing.m }}
                >
                    <div
                        className={`dashboardCardStatus ${marketStatus?.isOpen ? 'active' : ''}`}
                    >
                        <div className="circle pulse"></div>
                        <div
                            className="dashboardCardStatus-status"
                            style={{ marginLeft: customSpacing.m }}
                        >
                            {!marketStatus.isOpen ? (
                                <div>
                                    <p
                                        style={marketTextStyling}
                                        className="status"
                                    >
                                        MARKET STATUS: CLOSED
                                    </p>
                                    {marketStatus.session != null && (
                                        <p style={marketTextStyling}>
                                            Market is currently in{' '}
                                            {marketStatus.session}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p
                                        style={marketTextStyling}
                                        className="status"
                                    >
                                        MARKET STATUS: OPEN
                                    </p>
                                    <p style={marketTextStyling}>
                                        Market is currently in{' '}
                                        {marketStatus.session}
                                    </p>
                                </div>
                            )}
                            <p style={marketTextStyling}>
                                Current Time in{' '}
                                {regionCode(marketStatus.timezone)}:{' '}
                                {new Date(marketStatus.t * 1000).toLocaleString(
                                    'en-US',
                                    { timeZone: marketStatus.timezone },
                                )}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card
                    className="dashboardCard"
                    data-type="news"
                    variant="outlined"
                    style={{ padding: customSpacing.m }}
                >
                    <div className="dashboardCardNews">
                        {marketNews.length ? (
                            <div>
                                <Link
                                    style={{
                                        fontSize:
                                            theme.typography.body1.fontSize,
                                        margin: customSpacing.none,
                                        color: theme.palette.text.primary,
                                    }}
                                    className="dashboardCardNews-title"
                                    to="/news"
                                >
                                    Top News
                                </Link>
                                {marketNews.map((market) => {
                                    return (
                                        <a
                                            data-testid="news__article"
                                            style={{
                                                fontSize:
                                                    theme.typography.body2
                                                        .fontSize,
                                                margin: customSpacing.none,
                                                marginTop: customSpacing.xs,
                                                color: theme.palette.text
                                                    .primary,
                                            }}
                                            key={market.id}
                                            href={market.url}
                                        >
                                            {market.headline}
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <div>
                                <Typography
                                    variant="body2"
                                    style={{ margin: customSpacing.none }}
                                >
                                    Loading...
                                </Typography>
                            </div>
                        )}
                    </div>
                </Card>
                {myStocks.length ? (
                    <Card
                        className="dashboardCard"
                        data-type="portfolioScore"
                        variant="outlined"
                        style={{
                            padding: customSpacing.m,
                            marginTop: customSpacing.m,
                        }}
                    >
                        <div className="dashboardCardPS">
                            <p
                                style={portfolioTextStyling}
                                className="dashboardCardPS-Text"
                            >
                                Current Portfolio Score{' '}
                                <button
                                    data-testid="portfolio__score-btn"
                                    onClick={() => openModal()}
                                >
                                    <InfoOutlinedIcon
                                        style={{
                                            fill: theme.palette.text.primary,
                                        }}
                                    />
                                </button>
                            </p>
                            <p
                                style={{
                                    fontSize: theme.typography.body2.fontSize,
                                    margin: customSpacing.none,
                                }}
                            >
                                Updates every month!
                            </p>
                            <p
                                style={{
                                    margin: customSpacing.none,
                                    marginTop: customSpacing.xs,
                                }}
                                data-testid="portfolio__score"
                                className={`dashboardCard-value ${portfolioScore >= 90 ? 'veryhigh' : portfolioScore > 70 ? 'high' : portfolioScore >= 50 ? 'medium' : portfolioScore >= 30 ? 'low' : portfolioScore <= 29 ? 'verylow' : 'verylow'}`}
                            >
                                {portfolioScore.toFixed(2)}
                            </p>
                        </div>
                        <Modal
                            data-testid="portfolio__score-btn-modal"
                            open={open}
                            onClose={() => closeModal()}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div
                                className="modal-container"
                                style={{ padding: customSpacing.m }}
                            >
                                <p
                                    style={{
                                        margin: customSpacing.none,
                                        fontSize:
                                            theme.typography.body1.fontSize,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    The stock score is calculated based on
                                    various factors, including recent ratings
                                    and stock performance, to help you assess
                                    the potential value of your investments.
                                </p>
                                <p
                                    style={{
                                        margin: customSpacing.none,
                                        marginTop: customSpacing.s,
                                        fontSize:
                                            theme.typography.body1.fontSize,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    Please note that this score is only an
                                    indication and should not be solely relied
                                    upon for making investment decisions, as
                                    market conditions can change rapidly.
                                </p>
                                <p
                                    style={{
                                        margin: customSpacing.none,
                                        marginTop: customSpacing.s,
                                        fontSize:
                                            theme.typography.body1.fontSize,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    We developed this scoring system to empower
                                    you with insights derived from our analysis.
                                </p>
                            </div>
                        </Modal>
                    </Card>
                ) : (
                    ''
                )}
                {myStocks.length ? (
                    <Card
                        className="dashboardCard"
                        data-type="portfolioValue"
                        variant="outlined"
                        style={{
                            padding: customSpacing.m,
                            marginTop: customSpacing.m,
                        }}
                    >
                        <div className="dashboardCardPV">
                            <p style={portfolioTextStyling}>Portfolio Value</p>
                            <p
                                style={{
                                    margin: customSpacing.none,
                                    color:
                                        portfolioPercentage > 0
                                            ? theme.palette.success.main
                                            : theme.palette.error.main,
                                }}
                                className="dashboardCard-value"
                                data-testid="portfolio__value"
                            >
                                {money(portfolioValue)}
                            </p>
                            <p
                                style={{
                                    fontSize: theme.typography.body1.fontSize,
                                    margin: customSpacing.none,
                                    color:
                                        portfolioPercentage > 0
                                            ? theme.palette.success.main
                                            : theme.palette.error.main,
                                }}
                                className="dashboardCard-amount-value"
                                data-testid="portfolio__profit_in_d"
                            >
                                {money(portfolioValue - originalPortfolioValue)}{' '}
                                <span data-testid="portfolio__value_in_p">
                                    ({portfolioPercentage.toFixed(2)}%)
                                </span>
                            </p>
                        </div>
                    </Card>
                ) : (
                    ''
                )}
                {myStocks.length ? (
                    <Card
                        className="dashboardCard"
                        data-type="portfolioPercentage"
                        variant="outlined"
                        style={{
                            padding: customSpacing.m,
                            marginTop: customSpacing.m,
                        }}
                    >
                        <div className="dashboardCardPP">
                            <p style={portfolioTextStyling}>
                                Portfolio Industries
                            </p>
                            <div>
                                {Object.keys(portfolioIndustries).map(
                                    (industry, index) => {
                                        return (
                                            <p
                                                style={industryStyling}
                                                data-testid={`portfolio__industry-${industry}`}
                                                key={industry}
                                            >
                                                {industry} -{' '}
                                                {(
                                                    (+JSON.stringify(
                                                        Object.values(
                                                            portfolioIndustries,
                                                        )[index],
                                                    ) /
                                                        portfolioValue) *
                                                    100
                                                ).toFixed(2)}
                                                %
                                            </p>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </Card>
                ) : (
                    ''
                )}
                {myStocks.length ? (
                    <Card
                        className="dashboardCard"
                        data-type="portfolioList"
                        variant="outlined"
                        style={{
                            padding: customSpacing.m,
                            marginTop: customSpacing.m,
                        }}
                    >
                        <div className="dashboardCardP">
                            <TableContainer>
                                <Table
                                    sx={{ minWidth: 650 }}
                                    aria-label="stock table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Stock Name</TableCell>
                                            <TableCell
                                                align="left"
                                                className="small-width"
                                            >
                                                Quantity
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                className="medium-width"
                                            >
                                                Bought Price
                                            </TableCell>
                                            <TableCell
                                                align="left"
                                                className="medium-width"
                                            >
                                                Current Price
                                            </TableCell>
                                            <TableCell align="left">
                                                Total Bought Price
                                            </TableCell>
                                            <TableCell align="left">
                                                Total Current Price
                                            </TableCell>
                                            <TableCell align="left">
                                                Change (Price/%)
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {myStocks.map((stock, index) => {
                                            const profile = myProfile[index];
                                            const quotes = myQuotes[index];
                                            const currentPrice = quotes?.c || 0;
                                            const boughtPrice =
                                                stock?.price || 0;
                                            const quantity =
                                                stock?.quantity || 0;

                                            return (
                                                <TableRow
                                                    data-testid={`stock-line-${stock.stock}`}
                                                    key={stock.stock}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        <div>
                                                            {profile ? (
                                                                <img
                                                                    src={
                                                                        profile?.logo
                                                                    }
                                                                    alt={
                                                                        profile?.name
                                                                    }
                                                                    style={{
                                                                        marginRight:
                                                                            customSpacing.m,
                                                                        maxWidth:
                                                                            '40px',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="placeholder-image"
                                                                    style={{
                                                                        marginRight:
                                                                            customSpacing.m,
                                                                    }}
                                                                ></div>
                                                            )}
                                                            <Typography variant="body2">
                                                                {profile?.name ||
                                                                    stock.stock}
                                                            </Typography>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {quantity}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {money(boughtPrice)}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {money(currentPrice)}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {money(
                                                            boughtPrice *
                                                                +quantity,
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {money(
                                                            currentPrice *
                                                                +quantity,
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <span
                                                            style={{
                                                                color:
                                                                    currentPrice >
                                                                    boughtPrice
                                                                        ? theme
                                                                              .palette
                                                                              .success
                                                                              .main
                                                                        : theme
                                                                              .palette
                                                                              .error
                                                                              .main,
                                                            }}
                                                        >
                                                            {money(
                                                                currentPrice *
                                                                    +quantity -
                                                                    boughtPrice *
                                                                        +quantity,
                                                            )}
                                                        </span>
                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    customSpacing.xs,
                                                                color:
                                                                    currentPrice >
                                                                    boughtPrice
                                                                        ? theme
                                                                              .palette
                                                                              .success
                                                                              .main
                                                                        : theme
                                                                              .palette
                                                                              .error
                                                                              .main,
                                                            }}
                                                        >
                                                            {' '}
                                                            (
                                                            {(
                                                                100 -
                                                                (boughtPrice /
                                                                    currentPrice) *
                                                                    100
                                                            ).toFixed(2)}
                                                            %)
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </Card>
                ) : (
                    ''
                )}
                {myStocks.length === 0 ? (
                    <Card
                        className="dashboardCard"
                        data-type="noStock"
                        variant="outlined"
                        style={{
                            padding: customSpacing.m,
                            marginTop: customSpacing.m,
                            width: '100%',
                        }}
                    >
                        <p
                            data-testid="no__stock"
                            style={{
                                fontSize: theme.typography.body2.fontSize,
                                margin: customSpacing.none,
                                textAlign: 'center',
                            }}
                        >
                            You currently have no stocks in your list. Start
                            adding <Link to="/search">here</Link> to track your
                            investments and stay informed!
                        </p>
                    </Card>
                ) : (
                    ''
                )}
            </div>
        </Box>
    );
};

export default Dashboard;
