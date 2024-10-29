// MUI
import { useTheme, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter } from "@mui/material";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// SCSS
import '../../styles/Global.scss';
import './MyStocks.scss';

// REACT
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import StockModal from '../../components/StockModal/StockModal';

// TYPES
import { MyStock } from "../../types/mystock";

// HOOKS
import useFindAllStocks from "../../hooks/usefindAllStocks/usefindAllStocks";

// UTIL
import { money } from "../../utils/money/money";
import { totalBoughtPrice } from "../../utils/totalBoughtPrice/totalBoughtPrice";
import { totalCurrentPrice } from "../../utils/totalCurrentPrice/totalCurrentPrice";
import { totalChangeInPrice } from "../../utils/totalChangeInPrice/totalChangeInPrice";
import { calculateStockPercentage } from "../../utils/calculateStockPercentage/calculateStockPercentage";

const MyStocks = () => {
    // styling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;

    // states
    const [ myStocks, setMyStocks ] = useState<MyStock[]>([]);
    const [ open, setOpen ] = useState<boolean>(false);
    const [ chosenStock, setChosenStock ] = useState<string>("");
    const [ chosenStockAmount, setChosenStockAmount ] = useState<number>(0);
    const [ currentStockPrice, setCurrentStockPrice ] = useState<number>(0);
    const [ currentStockQty, setCurrentStockQty ] = useState<number>(0);

    // custom hook
    const { myQuotes, myProfile } = useFindAllStocks(myStocks);

    // mounted
    useEffect(() => {
        const myStocks = localStorage.getItem("myStocks");
        if ( myStocks !== null ) {
            let temp = JSON.parse(myStocks);
            setMyStocks(temp);
        }
    }, []);

    // delete the stock within myStocks
    const deleteStock = useCallback(( stock:string ) => {
        let temp = [...myStocks];
        temp = temp.filter(t => t.stock !== stock);
        setMyStocks(temp);
        localStorage.setItem("myStocks", JSON.stringify(temp));
    }, [myStocks]);

    // open modal to show the edit stocks
    const openModal = ( stock:string, amount:number, currentPrice:number, currentQty:number ) => {
        setOpen(true);
        setChosenStock(stock);
        setChosenStockAmount(amount);
        setCurrentStockPrice(currentPrice);
        setCurrentStockQty(currentQty);
    };

    const closeModal = () => setOpen(false);

    return (
        <Box id="mystocks" className="page" sx={{ backgroundColor: theme.palette.background.paper, marginLeft: customSpacing.l, padding: customSpacing.l }}>
            <div className="page__titles">
                <Typography variant="h1" style={{ margin: customSpacing.none }}>My Stocks</Typography>
                <Typography variant="body1" style={{ margin: customSpacing.none, marginTop: customSpacing.s }}>
                    Manage your stocks efficiently with personalized insights, real-time data, and seamless tracking of your investment portfolio.
                </Typography>
            </div>
            <div className="page__content" style={{ marginTop: customSpacing.l }}>
                {
                    myStocks.length ? 
                    <div className="myStocks__stocks">
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="stock table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Stock Name</TableCell>
                                        <TableCell align="left" className="small-width">Quantity</TableCell>
                                        <TableCell align="left" className="medium-width">Bought Price</TableCell>
                                        <TableCell align="left" className="medium-width">Current Price</TableCell>
                                        <TableCell align="left">Total Bought Price</TableCell>
                                        <TableCell align="left">Total Current Price</TableCell>
                                        <TableCell align="left">Change (Price/%)</TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {myStocks.map((stock, index) => {
                                        const profile = myProfile[index];
                                        const quotes = myQuotes[index];
                                        const currentPrice = quotes?.c || 0;
                                        const boughtPrice = stock?.price || 0;
                                        const quantity = stock?.quantity || 0;

                                        return (
                                            <TableRow key={stock.stock} data-testid={ `stocklist-${ stock.stock }` }>
                                                <TableCell component="th" scope="row">
                                                    <div>
                                                        { profile ? (
                                                            <img src={profile?.logo} alt={profile?.name} style={{ marginRight: customSpacing.m, maxWidth: '40px' }} />
                                                            ) : (
                                                            <div className="placeholder-image" style={{ marginRight: customSpacing.m }}></div>
                                                        )}
                                                        <Typography variant="body2">{profile?.name || stock.stock}</Typography>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="left">{quantity}</TableCell>
                                                <TableCell align="left" data-testid="bought__price">{money(boughtPrice)}</TableCell>
                                                <TableCell align="left">{money(currentPrice)}</TableCell>
                                                <TableCell align="left">{money(boughtPrice * +quantity)}</TableCell>
                                                <TableCell align="left">{money(currentPrice * +quantity)}</TableCell>
                                                <TableCell align="left">
                                                    <span style={{ color: currentPrice > boughtPrice ? theme.palette.success.main : theme.palette.error.main }}>
                                                        {money((currentPrice * +quantity) - (boughtPrice * +quantity))}
                                                    </span>
                                                    <span style={{ marginLeft: customSpacing.xs, color: currentPrice > boughtPrice ? theme.palette.success.main : theme.palette.error.main }}> ({ calculateStockPercentage(boughtPrice, currentPrice).toFixed(2) }%)</span>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <div style={{ fontSize: theme.typography.body1.fontSize, marginLeft: customSpacing.m, paddingRight: customSpacing.s }} className="buttons">
                                                        <button data-testid="update__stock-btn" onClick={() => openModal(profile?.ticker, quotes?.c, stock?.price, +stock?.quantity)}><CreateOutlinedIcon style={{ fill: theme.palette.text.primary }} /></button>
                                                        <button data-testid="delete__stock-btn" onClick={() => deleteStock(stock.stock)}><DeleteOutlineOutlinedIcon style={{ fill: theme.palette.text.primary }} /></button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left"></TableCell>
                                        <TableCell align="left" data-testid="total__bought__price">{money(totalBoughtPrice(myStocks))}</TableCell>
                                        <TableCell align="left" data-testid="total__current__price">{money(totalCurrentPrice(myStocks, myQuotes))}</TableCell>
                                        <TableCell align="left" data-testid="total__change__price" style={{ fontSize: theme.typography.body2.fontSize, marginLeft: customSpacing.m, color: totalChangeInPrice(myStocks, myQuotes) > 0 ? theme.palette.success.main : theme.palette.error.main }}>
                                            <span>{money(totalChangeInPrice(myStocks, myQuotes))}</span>
                                            <span style={{ marginLeft: customSpacing.xs }}>({(100 - (totalBoughtPrice(myStocks) / totalCurrentPrice(myStocks, myQuotes)) * 100).toFixed(2)}%)</span>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        <StockModal stock={ chosenStock } amount={ chosenStockAmount } open={ open } setMyStocks={ setMyStocks } closeModal={ closeModal } type="edit" currentStockPrice={ currentStockPrice } currentStockQty={ currentStockQty }>
                            <div></div>
                        </StockModal>
                    </div> 
                    : 
                    <div className="mystocks__no-stocks">
                        <p style={{ fontSize: theme.typography.body1.fontSize, margin: customSpacing.none }}>You currently have no stocks in your list. Start adding <Link to="/search">here</Link> to track your investments and stay informed!</p>
                    </div>
                }
            </div>
        </Box>
    )
}

export default MyStocks;