// MUI
import SearchIcon from '@mui/icons-material/Search';
import { useTheme, Typography, Box, FormControl, InputLabel, Button, Input, InputAdornment, Divider, Card } from "@mui/material";

// SCSS
import '../../styles/Global.scss';
import './Search.scss';

// REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import NewsCard from '../../components/NewsCard/NewsCard';
import StockModal from '../../components/StockModal/StockModal';

// TYPES
import { CompanyQuote } from "../../types/companyquote";
import { CompanyProfile } from "../../types/companyprofile";
import { CompanyRecommendations } from "../../types/companyrecommendations";

// API
import { CompanyNews } from '../../types/companynews';
import { getCompanyNews } from '../../api/CompanyNews';
import { CompanyQuoteState, getCompanyQuote } from '../../api/CompanyQuote';
import { CompanyProfileState, getCompanyProfile } from '../../api/CompanyProfile';
import { getCompanyRecommendations } from '../../api/CompanyRecommendations';

// UTIL
import { money } from '../../utils/money/money';

const Search = () => {
    // styling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;
    const paragraphStyling = { margin: customSpacing.none, marginBottom: customSpacing.s, fontSize: theme.typography.body1.fontSize };
    const paragraphQuoteStyling = { margin: customSpacing.none, marginRight: customSpacing.m, fontSize: theme.typography.body1.fontSize };
    const paragraphTrendStyling = { margin: customSpacing.none, fontSize: theme.typography.body1.fontSize };

    // states
    const [ stock, setStock ] = useState<string>("");
    const [ news, setNews ] = useState<CompanyNews[]>([]);
    const [ quote, setQuote ] = useState<CompanyQuote>(CompanyQuoteState);
    const [ profile, setProfile ] = useState<CompanyProfile>(CompanyProfileState);
    const [ trends, setTrends ] = useState<CompanyRecommendations[]>([]);
    const [ loading, setLoading ] = useState<string>("");
    const [ error, setError ] = useState<string>("");
    const [ open, setOpen ] = useState<boolean>(false);

    // search your specific stock
    const searchStock = async () => {
        setLoading("Finding Stock...");

        let today = new Date();
        let lastWeek = new Date(new Date().setDate(new Date().getDate() - 7));
        let lastWeekDate = `${ lastWeek.getFullYear() }-${ (lastWeek.getMonth() + 1).toString().padStart(2, '0') }-${ lastWeek.getDate().toString().padStart(2, '0') }`;
        let todayDate =`${ today.getFullYear() }-${ (today.getMonth() + 1).toString().padStart(2, '0') }-${ today.getDate().toString().padStart(2, '0') }`;

        const news = await getCompanyNews(stock, lastWeekDate, todayDate);
        const quote = await getCompanyQuote(stock);
        const profile = await getCompanyProfile(stock);
        const trends = await getCompanyRecommendations(stock);

        news.length ? setNews(news.slice(0, 9)) : setNews(news);
        setQuote(quote);
        setProfile(profile);
        setTrends(trends);

        if ( news.length === 0 && quote.c === 0 && Object.keys(profile).length === 0 && trends.length === 0 ) {
            setError("Ticker not found.");
        }
        else {
            setError("");
        }

        setLoading("Loaded!");
    }

    // for modal popup
    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    return (
        <Box id="search" className="page" sx={{ backgroundColor: theme.palette.background.paper, marginLeft: customSpacing.l, padding: customSpacing.l }}>
            <div className="page__titles">
                <Typography variant="h1" style={{ margin: customSpacing.none }}>Search Your Favourite Stocks</Typography>
                <Typography variant="body1" style={{ margin: customSpacing.none, marginTop: customSpacing.s }}>
                    Track the latest news, updates, and performance of your favorite stocks in real-time.
                </Typography>
            </div>
            <div className="page__content" style={{ marginTop: customSpacing.l }}>
                <div className="search__input">
                    <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">Search Stock by Symbol</InputLabel>
                        <Input id="input-with-icon-adornment" inputProps={{ "data-testid": "search__input" }} onChange={ (e) => setStock(e.target.value) } startAdornment={ <InputAdornment position="start"><SearchIcon style={{ fill: theme.palette.text.primary }} /></InputAdornment> } />
                    </FormControl>
                    <Button variant="outlined" data-testid="search__btn" style={{ marginLeft: customSpacing.m, padding: "12px" }} onClick={() => searchStock()}>Search Stock</Button>
                    { 
                        loading === "Loaded!" && error.length === 0 && Object.keys(profile).length
                        ?
                        <StockModal stock={ profile?.ticker } amount={ quote?.c } open={ open } closeModal={ closeModal }>
                            <Button variant="outlined" style={{ marginLeft: customSpacing.m, padding: "12px" }} onClick={() => openModal()}>Add to My Stocks</Button>
                        </StockModal>
                        : '' 
                    }
                </div>
                { error.length ? <div className="error" style={{ color: theme.palette.error.main, marginTop: customSpacing.s, fontSize: theme.typography.body1.fontSize }}>{ error }</div> : '' }
                {
                    loading === "Finding Stock..." ? <p className="loading" style={{ marginTop: customSpacing.l, fontSize: theme.typography.body1.fontSize }}>{ loading }</p> : 
                    <div className="search__output" style={{ marginTop: customSpacing.l }}>
                        {
                            Object.keys(profile).length && profile.name.length ? 
                            <div>
                                <div className="search__output-profile">
                                    <img src={ profile?.logo } alt={ profile?.name }/>
                                    <div className="search__output-profile-data" style={{ marginLeft: customSpacing.m }}>
                                        { profile?.name && <p style={ paragraphStyling }><span>Name:</span> { profile?.name }</p> }
                                        { profile?.ticker && <p data-testid="output__ticker" style={ paragraphStyling }><span>Ticker:</span> { profile?.ticker }</p> }
                                        { profile?.ipo && <p style={ paragraphStyling }><span>IPO Date:</span> { profile?.ipo }</p> }
                                        { profile?.exchange && <p style={ paragraphStyling }><span>Exchange:</span> { profile?.exchange }</p> }
                                        { profile?.weburl && <p style={ paragraphStyling }><span>Website:</span> <a href={ profile?.weburl } style={{ color: theme.palette.text.primary }}>{ profile?.weburl }</a></p> }
                                    </div>
                                </div> 
                                <Divider style={{ paddingTop: customSpacing.m, marginBottom: customSpacing.m }}></Divider>
                            </div>
                            : ''
                        }
                        {
                            Object.keys(quote).length && quote?.c !== 0 ?
                            <div>
                                <div className="search__output-quote">
                                    { quote?.o && <p style={ paragraphQuoteStyling }><span>Open Price:</span> { money(quote?.o) }</p> }
                                    { quote?.l && <p style={ paragraphQuoteStyling }><span>Low Price:</span> { money(quote?.l) }</p> }
                                    { quote?.h && <p style={ paragraphQuoteStyling }><span>High Price:</span> { money(quote?.h) }</p> }
                                    { quote?.pc && <p style={ paragraphQuoteStyling }><span>Previous Close Price:</span> { money(quote?.pc) }</p> }
                                    { quote?.c && <p data-testid="output__current-price" style={ paragraphQuoteStyling }><span>Current Price:</span> { money(quote?.c) }</p> }
                                    { quote?.d && <p style={{ margin: customSpacing.none, marginRight: customSpacing.m, fontSize: theme.typography.body1.fontSize, color: quote?.d > 0 ? theme.palette.success.main : theme.palette.error.main }}><span>Change Price:</span> { money(quote?.d) }</p> }
                                    { quote?.dp && <p style={{ margin: customSpacing.none, marginRight: customSpacing.m, fontSize: theme.typography.body1.fontSize, color: quote?.d > 0 ? theme.palette.success.main : theme.palette.error.main }}><span>Change Percentage:</span> { quote?.dp }%</p> }
                                </div>
                                <Divider style={{ paddingTop: customSpacing.m, marginBottom: customSpacing.m }}></Divider>
                            </div>
                            : ''
                        }
                        {
                            trends.length ? 
                            <div>
                                <div className="search__output-trends">
                                    {
                                        trends.map((trend) => {
                                            return (
                                                <Card variant="outlined" data-type="trends" data-testid={ `trends-${ trend?.period }` } key={ trend?.period } style={{ padding: customSpacing.s }}>
                                                    <p style={ paragraphTrendStyling }><span>Month:</span> { new Date(trend?.period).toLocaleString('default', { month: 'long' }) }</p>
                                                    <Divider style={{ marginTop: customSpacing.xs, marginBottom: customSpacing.xs }}></Divider>
                                                    <p style={ paragraphTrendStyling } className="sb"><span>Strong Buy:</span> { trend?.strongBuy }</p>
                                                    <p style={ paragraphTrendStyling } className="b"><span>Buy:</span> { trend?.buy }</p>
                                                    <p style={ paragraphTrendStyling } className="h"><span>Hold:</span> { trend?.hold }</p>
                                                    <p style={ paragraphTrendStyling } className="s"><span>Sell:</span> { trend?.sell }</p>
                                                    <p style={ paragraphTrendStyling } className="ss"><span>Strong Sell:</span> { trend?.strongSell }</p>
                                                </Card>
                                            )
                                        })
                                    }
                                </div>
                                <Divider style={{ paddingTop: customSpacing.m, marginBottom: customSpacing.m }}></Divider>
                            </div>
                            : ''
                        }
                        {
                            news.length ? 
                            <div>
                                <div className="search__output-news">
                                    <p className="t" style={{ fontSize: theme.typography.body1.fontSize }}>Recent updates on { profile?.name } from the past week.</p>
                                    <div className="search__output-news--list">
                                        {
                                            news.map((n) => { return ( <NewsCard news={ n } key={ n?.id } /> )})
                                        }
                                    </div>
                                </div>
                                { news.length > 8 ? <Link className="rm" to={ `/news?ticker=${ stock }` } style={{ fontSize: theme.typography.body1.fontSize, marginTop: customSpacing.m, color: theme.palette.text.primary }}>Read more on { profile?.name }</Link> : '' }
                            </div>
                            : ''
                        }
                    </div>
                }
            </div>
        </Box>
    )
}

export default Search;