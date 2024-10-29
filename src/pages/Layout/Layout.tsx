// MUI
import { useTheme, Box } from "@mui/material";

// SCSS
import '../../styles/Global.scss';

// REACT
import { Outlet } from "react-router-dom";
import Nav from '../../components/Nav/Nav';

const Layout = () => {
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;

    return (
        <Box id="layout" sx={{ padding: customSpacing.l, height: `calc(100vh - ${ customSpacing.xl })`, color: theme.palette.text.primary }}>
            <Nav />
            <Outlet />
        </Box>
    )
}

export default Layout;