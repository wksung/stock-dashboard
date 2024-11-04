// MUI
import {
    useTheme,
    Typography,
    Box,
    FormGroup,
    FormControlLabel,
    Switch,
    Button,
} from '@mui/material';

// SCSS
import '../../styles/Global.scss';
import './Settings.scss';

// REACT
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    // styling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;

    // state
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [reverseColour, setReverseColour] = useState<boolean>(false);

    // react router
    const navigate = useNavigate();

    // mounted
    useEffect(() => {
        const dm = localStorage.getItem('darkmode');
        const rv = localStorage.getItem('reversecolour');
        dm === null
            ? localStorage.setItem('darkmode', darkMode.toString())
            : setDarkMode(JSON.parse(dm));
        rv === null
            ? localStorage.setItem('reversecolour', reverseColour.toString())
            : setReverseColour(JSON.parse(rv));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // save the settings onto localstorage
    const saveSettings = () => {
        localStorage.setItem('darkmode', darkMode.toString());
        localStorage.setItem('reversecolour', reverseColour.toString());
        navigate(0);
    };

    return (
        <Box
            id="settings"
            data-testid="settings__page"
            className="page"
            sx={{
                backgroundColor: theme.palette.background.paper,
                marginLeft: customSpacing.l,
                padding: customSpacing.l,
            }}
        >
            <div className="page__titles">
                <Typography variant="h1" style={{ margin: customSpacing.none }}>
                    Settings
                </Typography>
                <Typography
                    variant="body1"
                    style={{
                        margin: customSpacing.none,
                        marginTop: customSpacing.s,
                    }}
                >
                    Customize your experience in the settings to adjust account
                    preferences and display options to suit your needs.
                </Typography>
            </div>
            <div
                className="page__content"
                style={{ marginTop: customSpacing.l }}
            >
                <FormGroup style={{ marginBottom: customSpacing.s }}>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                data-testid="switch__darkmode"
                                onChange={() => setDarkMode(!darkMode)}
                                checked={darkMode}
                            />
                        }
                        label="Enable dark mode"
                    />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                data-testid="switch__reversecolour"
                                onChange={() =>
                                    setReverseColour(!reverseColour)
                                }
                                checked={reverseColour}
                            />
                        }
                        label="Reverse colour (gains - red & losses - green)"
                    />
                </FormGroup>
                <Button
                    variant="outlined"
                    style={{ marginTop: customSpacing.m, padding: '12px' }}
                    onClick={() => saveSettings()}
                >
                    Save Settings
                </Button>
            </div>
        </Box>
    );
};

export default Settings;
