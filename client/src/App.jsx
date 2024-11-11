import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import GameBoard from './components/GameBoard';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <GameBoard />
            </div>
        </ThemeProvider>
    );
}

export default App;
