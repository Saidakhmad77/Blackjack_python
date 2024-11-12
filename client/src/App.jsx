import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import GameBoard from './components/GameBoard';

const App = () => {
    const [gameStarted, setGameStarted] = useState(false);

    const handleStartGame = () => {
        setGameStarted(true);
    };

    return (
        <div>
            {gameStarted ? <GameBoard /> : <LandingPage onStart={handleStartGame} />}
        </div>
    );
};

export default App;