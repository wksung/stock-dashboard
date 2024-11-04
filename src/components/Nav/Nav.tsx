// MUI
import { Drawer, Box, useTheme } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import MenuIcon from '@mui/icons-material/Menu';

// SCSS
import './Nav.scss';

// REACT
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
    // styling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;
    const textStyling = {
        margin: customSpacing.none,
        marginLeft: customSpacing.m,
        color: theme.palette.text.primary,
    };
    const iconStyling = { fill: theme.palette.text.primary };

    // react router
    const pathname = useLocation().pathname;

    // states
    const [open, setOpen] = useState(false);

    // functions
    const toggleDrawer = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    return (
        <div id="Nav">
            <button onClick={() => toggleDrawer(true)}>
                <MenuIcon style={iconStyling} />
            </button>
            <Drawer
                className="drawers"
                open={open}
                onClose={() => toggleDrawer(false)}
            >
                <Box
                    className="nav__icon"
                    sx={{ marginBottom: customSpacing.l }}
                >
                    <QueryStatsOutlinedIcon style={iconStyling} />
                    <p style={textStyling}>Stock Dashboard</p>
                </Box>
                <Link
                    to="/"
                    className={`nav__link ${pathname === '/' ? 'active' : ''}`}
                    style={{ marginBottom: customSpacing.m }}
                    onClick={() => toggleDrawer(false)}
                >
                    <DashboardOutlinedIcon style={iconStyling} />
                    <p style={textStyling}>Dashboard</p>
                </Link>
                <Link
                    to="/search"
                    className={`nav__link ${pathname === '/search' ? 'active' : ''}`}
                    style={{ marginBottom: customSpacing.m }}
                    onClick={() => toggleDrawer(false)}
                >
                    <SearchOutlinedIcon style={iconStyling} />
                    <p style={textStyling}>Search</p>
                </Link>
                <Link
                    to="/my-stocks"
                    className={`nav__link ${pathname === '/my-stocks' ? 'active' : ''}`}
                    style={{ marginBottom: customSpacing.m }}
                    onClick={() => toggleDrawer(false)}
                >
                    <AttachMoneyOutlinedIcon style={iconStyling} />
                    <p style={textStyling}>My Stocks</p>
                </Link>
                <Link
                    to="/news"
                    className={`nav__link ${pathname === '/news' ? 'active' : ''}`}
                    style={{ marginBottom: customSpacing.m }}
                    onClick={() => toggleDrawer(false)}
                >
                    <FeedOutlinedIcon style={iconStyling} />
                    <p style={textStyling}>News & Media</p>
                </Link>
                <Link
                    to="/settings"
                    className={`nav__link ${pathname === '/settings' ? 'active' : ''}`}
                    style={{ marginBottom: customSpacing.m }}
                    onClick={() => toggleDrawer(false)}
                >
                    <SettingsOutlinedIcon style={iconStyling} />
                    <p style={textStyling}>Settings</p>
                </Link>
            </Drawer>
        </div>
    );
};

export default Nav;
