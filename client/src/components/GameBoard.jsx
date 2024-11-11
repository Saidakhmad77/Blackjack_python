import React, { useState, useEffect } from 'react';
import Hand from './Hand';
import { startGame, dealCard, dealCardToDealer, getDealerHand } from '../services/api';
import Button from '@mui/material/Button';
import styled from 'styled-components';

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
`;

const GameBoard = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameState, setGameState] = useState('READY'); // 'READY', 'PLAYING', 'PLAYER_WIN', 'DEALER_WIN', etc.
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setDealerScore] = useState(0);
    const [showDealerHand, setShowDealerHand] = useState(false); // State to control when to show dealer's hand and score

    useEffect(() => {
        if (Array.isArray(playerHand)) {
            const score = calculateScore(playerHand);
            setPlayerScore(score);

            if (score > 21) {
                setGameState('PLAYER_BUST');
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
            setDealerHand([response.data.dealer_hand[0]]); // Show only one dealer card initially
            setGameState('PLAYING');
            setShowDealerHand(false);
            setPlayerScore(0);
            setDealerScore(0);
        } catch (error) {
            console.error('Error starting the game:', error);
        }
    };

    const handleHit = async () => {
        if (gameState !== 'PLAYING') return;

        try {
            const response = await dealCard();
            const newHand = [...playerHand, response.data];
            setPlayerHand(newHand);

            const newScore = calculateScore(newHand);
            if (newScore > 21) {
                setGameState('PLAYER_BUST');
                revealDealerHand();
            }
        } catch (error) {
            console.error('Error dealing card to player:', error);
        }
    };

    const handleStand = async () => {
        if (gameState !== 'PLAYING') return;

        try {
            const response = await getDealerHand();
            setDealerHand(response.data);
            setShowDealerHand(true);

            let currentDealerScore = calculateScore(response.data);
            while (currentDealerScore < 17) {
                const cardResponse = await dealCardToDealer();
                if (cardResponse.data.error) {
                    console.error('Deck is empty:', cardResponse.data.error);
                    setGameState('DEALER_WIN');
                    return;
                }

                const newHand = [...dealerHand, cardResponse.data];
                setDealerHand(newHand);
                currentDealerScore = calculateScore(newHand);

                if (currentDealerScore >= 17) {
                    break;
                }

                if (currentDealerScore > 21) {
                    setGameState('DEALER_BUST');
                    return;
                }
            }

            determineWinner();
        } catch (error) {
            console.error('Error during stand action:', error);
        }
    };

    const revealDealerHand = async () => {
        try {
            const response = await getDealerHand();
            setDealerHand(response.data);
            setShowDealerHand(true);
        } catch (error) {
            console.error('Error revealing dealer hand:', error);
        }
    };

    const calculateScore = (hand) => {
        if (!Array.isArray(hand)) {
            console.error('Expected an array for hand, but got:', hand);
            return 0;
        }

        let total = 0;
        let aces = 0;
        hand.forEach(card => {
            if (card && typeof card.value === 'number') {
                total += card.value;
            } else {
                console.warn('Invalid card or card value:', card);
            }
            if (card.rank === 'A') aces += 1;
        });

        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }

        return total;
    };

    const determineWinner = () => {
        const playerFinalScore = calculateScore(playerHand);
        const dealerFinalScore = calculateScore(dealerHand);

        if (playerFinalScore > 21) {
            setGameState('PLAYER_BUST');
        } else if (dealerFinalScore > 21) {
            setGameState('DEALER_BUST');
        } else if (playerFinalScore > dealerFinalScore) {
            setGameState('PLAYER_WIN');
        } else if (playerFinalScore < dealerFinalScore) {
            setGameState('DEALER_WIN');
        } else {
            setGameState('TIE');
        }
    };

    return (
        <div>
            <h1>Blackjack</h1>
            <h3>Player's Score: {playerScore}</h3>
            <Hand cards={Array.isArray(playerHand) ? playerHand : []} owner="Player" />

            {showDealerHand && <h3>Dealer's Score: {dealerScore}</h3>}
            <Hand cards={showDealerHand ? dealerHand : [dealerHand[0]]} owner="Dealer" />

            <ButtonContainer>
                {gameState === 'READY' && (
                    <Button variant="contained" color="primary" onClick={handleStartGame}>
                        Start Game
                    </Button>
                )}
                {gameState === 'PLAYING' && (
                    <>
                        <Button variant="outlined" color="secondary" onClick={handleHit}>
                            Hit
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleStand}>
                            Stand
                        </Button>
                    </>
                )}
                {gameState !== 'PLAYING' && gameState !== 'READY' && (
                    <Button variant="contained" color="primary" onClick={handleStartGame}>
                        Play Again
                    </Button>
                )}
            </ButtonContainer>
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

export default GameBoard;