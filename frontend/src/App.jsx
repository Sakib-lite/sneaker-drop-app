import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { theme } from './theme/theme';
import { AppProvider } from './store/AppContext';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        preventDuplicate
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <AppProvider>
          <Dashboard />
        </AppProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
