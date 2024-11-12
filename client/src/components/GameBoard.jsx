import React, { useState, useEffect } from 'react';
import Hand from './Hand';
import { startGame, dealCard, dealCardToDealer } from '../services/api';
import Button from '@mui/material/Button';
import './GameBoard.css';

const GameBoard = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameState, setGameState] = useState('PLAYING');
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);
    const [showDealerHand, setShowDealerHand] = useState(false);
    const [winnerMessage, setWinnerMessage] = useState('');

    // Automatically start the game on load
    useEffect(() => {
        handleStartGame();
    }, []);

    useEffect(() => {
        if (Array.isArray(playerHand)) {
            const score = calculateScore(playerHand);
            setPlayerScore(score);

            if (score > 21) {
                setGameState('PLAYER_BUST');
                setWinnerMessage('Dealer Wins! You went over 21.');
                revealDealerHand();
            }
        }

        if (Array.isArray(dealerHand)) {
            setDealerScore(calculateScore(dealerHand));
        }
    }, [playerHand, dealerHand]);

    const handleStartGame = async () => {
        try {
            const response = await startGame();
            setPlayerHand(response.data.player_hand);
            setDealerHand([response.data.dealer_hand[0]]);
            setGameState('PLAYING');
            setShowDealerHand(false);
            setPlayerScore(0);
            setDealerScore(0);
            setWinnerMessage('');
        } catch (error) {
            console.error('Error starting the game:', error);
        }
    };

    const handleHit = async () => {
        if (gameState !== 'PLAYING') return;

        if (playerHand.length >= 5) {
            setGameState('PLAYER_BUST');
            setWinnerMessage('Bust! You exceeded the maximum number of cards.');
            revealDealerHand();
            return;
        }

        try {
            const response = await dealCard();
            const newHand = [...playerHand, response.data];
            setPlayerHand(newHand);

            const newScore = calculateScore(newHand);
            if (newScore > 21) {
                setGameState('PLAYER_BUST');
                setWinnerMessage('Bust! You went over 21.');
                revealDealerHand();
            }
        } catch (error) {
            console.error('Error dealing card to player:', error);
        }
    };

    const handleStand = async () => {
        if (gameState !== 'PLAYING') return;

        setShowDealerHand(true);

        let dealerFinalHand = [...dealerHand];
        let dealerFinalScore = calculateScore(dealerFinalHand);

        while (dealerFinalScore < 17) {
            const cardResponse = await dealCardToDealer();
            if (cardResponse.data.error) {
                setGameState('DEALER_WIN');
                setWinnerMessage('Player Wins! Dealer ran out of cards.');
                return;
            }

            dealerFinalHand = [...dealerFinalHand, cardResponse.data];
            dealerFinalScore = calculateScore(dealerFinalHand);

            if (dealerFinalScore >= 17 || dealerFinalScore > 21) {
                break;
            }
        }

        setDealerHand(dealerFinalHand);
        determineWinner(dealerFinalScore);
    };

    const calculateScore = (hand) => {
        let total = 0;
        let aces = 0;
        hand.forEach(card => {
            total += card.value;
            if (card.rank === 'A') aces += 1;
        });

        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }
        return total;
    };

    const determineWinner = (dealerFinalScore) => {
        const playerFinalScore = calculateScore(playerHand);

        if (playerFinalScore > 21) {
            setGameState('PLAYER_BUST');
            setWinnerMessage('Dealer Wins! You went over 21.');
        } else if (dealerFinalScore > 21) {
            setGameState('DEALER_BUST');
            setWinnerMessage('Player Wins! Dealer went over 21.');
        } else if (playerFinalScore > dealerFinalScore) {
            setGameState('PLAYER_WIN');
            setWinnerMessage('Congratulations! You won!');
        } else if (playerFinalScore < dealerFinalScore) {
            setGameState('DEALER_WIN');
            setWinnerMessage('Dealer Wins! Better luck next time.');
        } else {
            setGameState('TIE');
            setWinnerMessage("It's a tie!");
        }
    };

    return (
        <div className="game-container">
            <h1 className="game-title">Blackjack</h1>
            <div className="player-dealer-container">
                <div className="player-section">
                    <h2>Player's Score: {playerScore}</h2>
                    <Hand cards={playerHand} owner="Player" />
                </div>
                <div className="dealer-section">
                    <h2>Dealer's Score: {showDealerHand ? dealerScore : 'Hidden'}</h2>
                    <Hand cards={showDealerHand ? dealerHand : [dealerHand[0]]} owner="Dealer" />
                </div>
            </div>

            {winnerMessage && <h3 className="winner-message">{winnerMessage}</h3>}

            <div className="button-container">
                {gameState === 'PLAYING' && (
                    <>
                        <Button variant="contained" color="secondary" onClick={handleHit}>
                            Hit
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleStand}>
                            Stand
                        </Button>
                    </>
                )}
                {gameState !== 'PLAYING' && gameState !== 'READY' && (
                    <Button variant="contained" color="primary" onClick={handleStartGame}>
                        Play Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default GameBoard;