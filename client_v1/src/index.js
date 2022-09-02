import React from 'react';
import ReactDOM from 'react-dom/client';
import Test from './test/test';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MomentUtils from '@date-io/moment';
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

const theme = createTheme({    
    palette: {
        background: {
            dark: "#eee"
        },
        primary: {
            main: "#454d58",
            light: "#707985",
            dark: "#1d252f"
        },
        secondary: {
            main: "#337ab7",
            light: "#6ca9ea",
            dark: "#004e87"
        },
        default: {
            main: "#e0e0e0",
            light: "#eeeeee",
            dark: "#aeaeae"
        }
    },
});

const rootElement = ReactDOM.createRoot(document.getElementById("root"));

rootElement.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={moment}>
                <Test />
            </LocalizationProvider>
        </ThemeProvider>
    </React.StrictMode>
    );
