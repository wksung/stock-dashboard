import { GlobalStyles as MUIGlobalStyles, useTheme } from '@mui/material';

const OverrideStyles = () => {
    // sytling
    const theme = useTheme();
    const customSpacing = (theme as any).customSpacing;

    return (
        <MUIGlobalStyles
            styles={{
                '.MuiDrawer-modal .MuiPaper-root': {
                    padding: `${customSpacing.l} ${customSpacing.whitespace} ${customSpacing.l} ${customSpacing.l}`,
                },
                '.MuiButtonBase-root.MuiButton-root': {
                    fontSize: theme.typography.body2.fontSize,
                    color: theme.palette.text.primary,
                    border: `1px solid ${theme.palette.text.primary}`,
                    letterSpacing: '0.04em',
                },
                '.MuiFormControl-root .MuiInputLabel-formControl': {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.body1.fontSize,
                    color: theme.palette.text.primary,
                },
                'label+.css-jlsj0p-MuiInputBase-root-MuiInput-root': {
                    borderBottom: `1px solid ${theme.palette.text.primary}`,
                },
                '.MuiFormControl-root input': {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.body1.fontSize,
                    textTransform: 'uppercase',
                },
                '.MuiStack-root input[placeholder="MM/DD/YYYY"]': {
                    fontSize: theme.typography.body1.fontSize,
                },
                '.MuiFormControlLabel-root': {
                    marginLeft: customSpacing.none,
                },
                '.MuiFormControlLabel-root .MuiTypography-root': {
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.body1.fontSize,
                    marginLeft: customSpacing.s,
                },
                '.MuiPaper-root[data-type="trends"]': {
                    border: `1px solid ${theme.palette.divider}`,
                    width: `calc(25% - ${customSpacing.sm} - ${customSpacing.m})`,
                },
                '.MuiPaper-root[data-type="news"]': {
                    border: `1px solid ${theme.palette.divider}`,
                    width: `calc(100%/3 - ${customSpacing.l} - 10px)`,
                },
                'hr.MuiDivider-root.MuiDivider-fullWidth': {
                    borderColor: `1px solid ${theme.palette.text.primary}`,
                },
                'fieldset.MuiOutlinedInput-notchedOutline': {
                    borderColor: `${theme.palette.divider}`,
                },
                '.MuiInputBase-root.MuiInput-root.MuiInput-underline:before': {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '.MuiModal-root .modal-container': {
                    background:
                        localStorage.getItem('darkmode') !== null &&
                        JSON.parse(localStorage.getItem('darkmode') || '')
                            ? theme.palette.background.paper
                            : theme.palette.background.paper,
                },
                '.MuiButtonBase-root.MuiIconButton-root svg': {
                    fill: theme.palette.text.primary,
                },
                '.MuiTableCell-root.MuiTableCell-head': {
                    fontWeight: 'bold',
                    whiteSpace: 'pre',
                },
                '.MuiTableCell-root.MuiTableCell-body div': {
                    display: 'flex',
                    alignItems: 'center',
                },
                '.MuiTableCell-root.MuiTableCell-body': {
                    borderBottom: 'none',
                },
                '.MuiTableCell-root.MuiTableCell-body button': {
                    background: 'none',
                    border: 'none',
                },
                '.MuiTableCell-root.MuiTableCell-body button svg': {
                    width: '16px',
                },
                '.MuiTableFooter-root .MuiTableCell-root.MuiTableCell-footer': {
                    color: theme.palette.text.primary,
                    fontSize: theme.typography.body2.fontSize,
                },
                '@media(max-width: 991px)': {
                    '.search__input .MuiFormControl-root': {
                        width: '100%',
                    },
                    '.page__content-search .MuiFormControl-root': {
                        width: '100%',
                    },
                    '.MuiButtonBase-root.MuiButton-root': {
                        width: '100%',
                        marginLeft: `${customSpacing.none} !important`,
                        marginTop: customSpacing.m,
                    },
                    '.MuiButtonBase-root.MuiButton-root + div': {
                        width: '100%',
                    },
                    '.MuiPaper-root[data-type="trends"]': {
                        minWidth: '160px',
                        marginRight: customSpacing.s,
                    },
                    '.MuiPaper-root[data-type="news"]': {
                        width: '100%',
                        margin: `${customSpacing.none} !important`,
                        marginBottom: `${customSpacing.s} !important`,
                    },
                },
            }}
        />
    );
};

export default OverrideStyles;
