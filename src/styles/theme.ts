import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
    interface Theme {
        customSpacing: {
            none: string;
            xs: string;
            s: string;
            sm: string;
            m: string;
            ml: string;
            l: string;
            lxl: string;
            xl: string;
            whitespace: string;
        };
    }
    interface ThemeOptions {
        customSpacing?: {
            none?: string;
            xs?: string;
            s?: string;
            sm?: string;
            m?: string;
            ml?: string;
            l?: string;
            lxl?: string;
            xl?: string;
            whitespace?: string;
        };
    }
}

const theme = createTheme({
    typography: {
        fontFamily:
            'Assistant, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
        h1: {
            fontSize: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            fontWeight: '700',
        },
        body1: {
            fontSize: '14px',
        },
        body2: {
            fontSize: '12px',
        },
    },
    palette: {
        text: {
            primary:
                localStorage.getItem('darkmode') !== null &&
                JSON.parse(localStorage.getItem('darkmode') || '')
                    ? '#ffffff'
                    : '#000000',
        },
        background: {
            default:
                localStorage.getItem('darkmode') !== null &&
                JSON.parse(localStorage.getItem('darkmode') || '')
                    ? '#202124'
                    : '#fafafa',
            paper:
                localStorage.getItem('darkmode') !== null &&
                JSON.parse(localStorage.getItem('darkmode') || '')
                    ? '#303030'
                    : '#ffffff',
        },
        error: {
            main:
                localStorage.getItem('reversecolour') !== null &&
                JSON.parse(localStorage.getItem('reversecolour') || '')
                    ? '#249108'
                    : '#c40000',
        },
        success: {
            main:
                localStorage.getItem('reversecolour') !== null &&
                JSON.parse(localStorage.getItem('reversecolour') || '')
                    ? '#c40000'
                    : '#249108',
        },
        divider:
            localStorage.getItem('darkmode') !== null &&
            JSON.parse(localStorage.getItem('darkmode') || '')
                ? '#ffffff'
                : '#0000001f',
    },
    customSpacing: {
        none: '0px',
        xs: '4px',
        s: '8px',
        sm: '12px',
        m: '16px',
        ml: '24px',
        l: '32px',
        lxl: '48px',
        xl: '64px',
        whitespace: '128px',
    },
});

export default theme;
