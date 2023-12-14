import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Test from './test/test';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

export const queryClient = new QueryClient({
    defaultOptions: {        
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        }
    }
});

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

root.render(
    <QueryClientProvider client={queryClient} >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                <Test />
            </ThemeProvider>
        </LocalizationProvider>
    </QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
