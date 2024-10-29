// MUI
import { useTheme, Button, Modal, TextField } from "@mui/material";

// SCSS
import './StockModal.scss';

// REACT
import { useState, useCallback } from "react";

const StockModal = ({ children, stock, amount, open, setMyStocks, closeModal, type = "add", currentStockPrice = 0, currentStockQty = 0 }: { children:React.ReactNode, stock:string, amount:number, open:boolean, setMyStocks?:Function, closeModal:Function, type?:string, currentStockPrice?:number, currentStockQty?:number }) => {
    // sytling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;

    // state
    const [ price, setPrice ] = useState<string>("0");
    const [ quantity, setQuantity ] = useState<string>("0");
    const [ error, setError ] = useState<string>("");

    // helper
    const money = useCallback((money: number): string => {
        const m = (Math.round(money * 100) / 100).toFixed(2);
        return "$" + m.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, []);

    // add your stock
    const addStock = () => {
        const findMyStocks = localStorage.getItem("myStocks");
        if ( findMyStocks === null ) {
            let myStocks = [{ stock, price, quantity }];
            localStorage.setItem("myStocks", JSON.stringify(myStocks));
        }
        else {
            let parsedStocks = JSON.parse(findMyStocks);
            let updatedStocks: any[];

            let temp = parsedStocks.find((s: { stock:string }) => s.stock === stock);
            if ( temp !== undefined && Object.keys(temp).length ) {
                temp.price = price;
                temp.quantity = quantity;
                const updatedArray = parsedStocks.map((item: { stock:any }) => item.stock === temp.stock ? temp : item);
                updatedStocks = [...updatedArray];
            }
            else {
                updatedStocks = [...parsedStocks, { stock, price, quantity }];
            }
            
            if ( +price > 0 && +quantity > 0 ) {
                localStorage.setItem("myStocks", JSON.stringify(updatedStocks));
                setMyStocks?.(updatedStocks);
                setError("");

                closeModal();
            }
            else {
                setError("Please add your price or quantity.");
            }
        }
    }

    // change the price when input is typed
    const changePrice = useCallback(( p:string ) => {
        setPrice(p);
        +quantity === 0 && setQuantity(currentStockQty.toString());
    }, [quantity, currentStockQty]);

    // change the quantity when the input is typed
    const changeQuantity = useCallback(( q:string ) => {
        setQuantity(q);
        +price === 0 && setPrice(currentStockPrice.toString());
    }, [price, currentStockPrice]);

    return (
        <div>
            { children }
            <Modal open={open} onClose={() => closeModal()} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"> 
                <div className="modal-container" style={{ paddingTop: customSpacing.l, paddingLeft: customSpacing.lxl, paddingBottom: customSpacing.l, paddingRight: customSpacing.lxl }}>
                    <p className="modal-container--title" style={{ color: theme.palette.text.primary }}>{ type === "add" ? "Add to my stocks" : `Edit ${ stock }` }</p>
                    <TextField inputProps={{ "data-testid": "popup__modal-ticker" }} style={{ fontSize: theme.typography.body2.fontSize, marginTop: customSpacing.s }} id="standard-basic" label="Stock Ticker" type="text" variant="standard" defaultValue={ stock } />
                    <TextField inputProps={{ "data-testid": "popup__modal-price" }} style={{ fontSize: theme.typography.body2.fontSize, marginTop: customSpacing.s }} id="standard-basic" label="Bought Price" type="number" variant="standard" onChange={(e) => changePrice(e.target.value)} defaultValue={ currentStockPrice } />
                    <small style={{ fontSize: theme.typography.body2.fontSize, color: theme.palette.text.primary, display: "block", marginTop: customSpacing.xs }}>Current Price: { money(amount) }</small>
                    <TextField inputProps={{ "data-testid": "popup__modal-quantity" }} style={{ fontSize: theme.typography.body2.fontSize, marginTop: customSpacing.s }} id="standard-basic" label="Quantity Bought" type="number" variant="standard" onChange={(e) => changeQuantity(e.target.value)} defaultValue={ currentStockQty } />
                    <Button variant="outlined" style={{ marginTop: customSpacing.m, padding: "12px", width: "100%" }} onClick={() => addStock()}>{ type === "add" ? "Add" : "Edit" } Stock</Button>
                    <p className="error" style={{ margin: customSpacing.none, marginTop: customSpacing.s, fontSize: theme.typography.body2.fontSize, color: theme.palette.error.main }}>{ error }</p>
                </div>
            </Modal>
        </div>
    )
}

export default StockModal;