// MUI
import { ThemeProvider } from '@mui/material';

// SCSS
import theme from './styles/theme';
import OverrideStyles from './styles/OverrideStyles';

// REACT
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import Search from './pages/Search/Search';
import MyStocks from './pages/MyStocks/MyStocks';
import News from './pages/News/News';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <OverrideStyles />
            <div style={{ backgroundColor: theme.palette.background.default }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/my-stocks" element={<MyStocks />} />
                            <Route path="/news" element={<News />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </ThemeProvider>
    );
};

export default App;
