// MUI
import { ThemeProvider } from '@mui/material/styles';

// SCSS
import theme from '../../styles/theme';

// REACT
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Settings from './Settings';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Import everything from react-router-dom
    useNavigate: () => jest.fn(),
}));

const MockSettings = () => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Settings />
            </BrowserRouter>
        </ThemeProvider>
    );
};

describe('Settings', () => {
    beforeEach(() => {
        localStorage.setItem('darkmode', 'false');
        localStorage.setItem('reversecolour', 'false');
    });

    it('should show the save settings button', async () => {
        await act(async () => render(<MockSettings />));
        const saveSettingsBtn = screen.getByText(/save settings/i);
        expect(saveSettingsBtn).toBeInTheDocument();
    });

    describe('Dark Mode', () => {
        it('should change the colour of the texts to white if you enable dark mode', async () => {
            await act(async () => render(<MockSettings />));
            const darkModeBtn = screen.getByTestId('switch__darkmode');
            await act(async () => fireEvent.click(darkModeBtn));
            await act(async () =>
                fireEvent.click(screen.getByText(/save settings/i)),
            );
            expect(localStorage.getItem('darkmode')).toBe('true');
        });

        it('should change the colour of the texts to black if you disable dark mode', async () => {
            await act(async () => render(<MockSettings />));
            const darkModeBtn = screen.getByTestId('switch__darkmode');
            await act(async () => fireEvent.click(darkModeBtn));
            await act(async () =>
                fireEvent.click(screen.getByText(/save settings/i)),
            );
            await act(async () => fireEvent.click(darkModeBtn));
            await act(async () =>
                fireEvent.click(screen.getByText(/save settings/i)),
            );
            expect(localStorage.getItem('darkmode')).toBe('false');
        });
    });

    describe('Reverse Colour', () => {
        it('should reverse the green and red colour if you enable reverse colour', async () => {
            await act(async () => render(<MockSettings />));
            const reverseColourBtn = screen.getByTestId(
                'switch__reversecolour',
            );
            await act(async () => fireEvent.click(reverseColourBtn));
            await act(async () =>
                fireEvent.click(screen.getByText(/save settings/i)),
            );
            expect(localStorage.getItem('reversecolour')).toBe('true');
        });

        it('should reverse the red and green colour if you disable reverse colour', async () => {
            await act(async () => render(<MockSettings />));
            const reverseColourBtn = screen.getByTestId(
                'switch__reversecolour',
            );
            await act(async () => fireEvent.click(reverseColourBtn));
            await act(async () =>
                fireEvent.click(screen.getByText(/save settings/i)),
            );
            await act(async () => fireEvent.click(reverseColourBtn));
            await act(async () =>
                fireEvent.click(screen.getByText(/save settings/i)),
            );
            expect(localStorage.getItem('reversecolour')).toBe('false');
        });
    });
});
