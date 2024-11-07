import React, { useState, useEffect } from 'react';
import Hand from './Hand';
import Button from '@mui/material/Button';
import axios from 'axios';
import './BlackjackGame.css';

const BlackjackGame = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);
    const [gameState, setGameState] = useState('PLAYING'); // 'PLAYING', 'PLAYER_BUST', 'DEALER_BUST', 'PLAYER_WIN', 'DEALER_WIN', 'TIE', 'GAME_OVER'

    useEffect(() => {
        // Calculate scores whenever the hands change
        const playerCurrentScore = calculateScoreLocally(playerHand);
        const dealerCurrentScore = calculateScoreLocally(dealerHand);

        setPlayerScore(playerCurrentScore);
        setDealerScore(dealerCurrentScore);

        if (playerCurrentScore > 21) {
            setGameState('PLAYER_BUST');
            revealFullDealerHand();
        } else if (playerCurrentScore === 21) {
            setGameState('PLAYER_WIN');
            revealFullDealerHand();
        }

        if (dealerCurrentScore > 21 && gameState !== 'PLAYER_BUST') {
            setGameState('DEALER_BUST');
        }

        // Save scores to local storage
        localStorage.setItem('playerScore', playerCurrentScore);
        localStorage.setItem('dealerScore', dealerCurrentScore);
    }, [playerHand, dealerHand]);

    const calculateScoreLocally = (hand) => {
        let total = 0;
        let aces = 0;
        hand.forEach(card => {
            total += card.value || 0; // Ensure card.value is a valid number
            if (card.rank === 'A') {
                aces += 1;
            }
        });

        // Adjust for aces if total is over 21
        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }

        return total;
    };

    const startGame = async () => {
        try {
            const response = await axios.post('http://localhost:5000/start-game');
            setPlayerHand(response.data.player_hand);
            setDealerHand([response.data.dealer_hand[0]]); // Show only one card initially
            setGameState('PLAYING');
            setPlayerScore(0);
            setDealerScore(0);
            localStorage.removeItem('playerScore');
            localStorage.removeItem('dealerScore');
        } catch (error) {
            console.error('Error starting the game:', error);
        }
    };

    const dealCard = async () => {
        if (gameState !== 'PLAYING') return;

        try {
            const response = await axios.get('http://localhost:5000/deal-card');
            setPlayerHand(prevHand => {
                const newHand = [...prevHand, response.data];
                const currentScore = calculateScoreLocally(newHand);
                if (currentScore > 21) {
                    setGameState('PLAYER_BUST');
                    revealFullDealerHand();
                }
                return newHand;
            });
        } catch (error) {
            console.error('Error dealing card:', error);
        }
    };

    const stand = async () => {
        if (gameState !== 'PLAYING') return;

        try {
            const fullDealerHand = await getFullDealerHand();
            setDealerHand(fullDealerHand);

            let currentDealerScore = calculateScoreLocally(fullDealerHand);

            // Dealer hits until their score is at least 17 and less than or equal to 21
            while (currentDealerScore < 17) {
                const response = await axios.get('http://localhost:5000/deal-card-to-dealer');
                setDealerHand(prevHand => {
                    const newHand = [...prevHand, response.data];
                    currentDealerScore = calculateScoreLocally(newHand);
                    return newHand;
                });

                if (currentDealerScore >= 17) {
                    break;
                }
            }

            determineWinner(currentDealerScore);
        } catch (error) {
            console.error('Error during stand action:', error);
        }
    };

    const getFullDealerHand = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-dealer-hand');
            return response.data;
        } catch (error) {
            console.error('Error getting full dealer hand:', error);
            return dealerHand;
        }
    };

    const revealFullDealerHand = async () => {
        try {
            const fullHand = await getFullDealerHand();
            setDealerHand(fullHand);
        } catch (error) {
            console.error('Error revealing full dealer hand:', error);
        }
    };

    const determineWinner = (dealerFinalScore) => {
        if (dealerFinalScore > 21) {
            setGameState('DEALER_BUST');
        } else if (playerScore > dealerFinalScore) {
            setGameState('PLAYER_WIN');
        } else if (playerScore < dealerFinalScore) {
            setGameState('DEALER_WIN');
        } else {
            setGameState('TIE');
        }
    };

    const playAgain = () => {
        startGame();
    };

    return (
        <div className="game-table">
            <h1>Blackjack</h1>
            <div className="hand-container">
                <h3 className="hand-title">Player's Hand</h3>
                <Hand cards={playerHand} owner="Player" />
            </div>
            <div className="hand-container">
                <h3 className="hand-title">Dealer's Hand</h3>
                <Hand cards={dealerHand} owner="Dealer" />
            </div>
            <div className="score-panel">
                <h4>Player's Score: {isNaN(playerScore) ? 0 : playerScore}</h4>
                {gameState !== 'PLAYING' && <h4>Dealer's Score: {isNaN(dealerScore) ? 0 : dealerScore}</h4>}
            </div>
            <div className="button-container">
                {gameState === 'PLAYING' && (
                    <>
                        <Button variant="contained" color="primary" onClick={startGame}>New Game</Button>
                        <Button variant="outlined" color="secondary" onClick={dealCard} disabled={playerScore > 21}>Hit</Button>
                        <Button variant="outlined" color="secondary" onClick={stand}>Stand</Button>
                    </>
                )}
                {gameState !== 'PLAYING' && (
                    <Button variant="contained" color="primary" onClick={playAgain}>Play Again</Button>
                )}
            </div>
            {gameState !== 'PLAYING' && (
                <div className="game-result">
                    {gameState === 'PLAYER_WIN' && <h2>Player Wins!</h2>}
                    {gameState === 'DEALER_WIN' && <h2>Dealer Wins!</h2>}
                    {gameState === 'PLAYER_BUST' && <h2>Player Busts! Dealer Wins!</h2>}
                    {gameState === 'DEALER_BUST' && <h2>Dealer Busts! Player Wins!</h2>}
                    {gameState === 'TIE' && <h2>It's a Tie!</h2>}
                </div>
            )}
        </div>
    );
};

export default BlackjackGame;
