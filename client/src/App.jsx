import BlackjackGame from './components/BlackjackGame';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <BlackjackGame />
            </div>
        </ThemeProvider>
    );
}

export default App;
