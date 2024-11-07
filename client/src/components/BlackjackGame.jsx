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
    const [gameState, setGameState] = useState('PLAYING'); // PLAYING, WIN, LOSE, TIE

    useEffect(() => {
        // Calculate player and dealer scores whenever their hands change
        calculateScore(playerHand, setPlayerScore);
        calculateScore(dealerHand, setDealerScore);
    }, [playerHand, dealerHand]);

    const calculateScore = (hand, setScore) => {
        const score = hand.reduce((total, card) => total + (card.value || 0), 0);
        setScore(score);
    };

    const startGame = async () => {
        try {
            const response = await axios.post('http://localhost:5000/start-game');
            setPlayerHand(response.data.player_hand);
            setDealerHand(response.data.dealer_hand);
        } catch (error) {
            console.error('Error starting the game:', error);
        }
    };

    const dealCard = async () => {
        try {
            const response = await axios.get('http://localhost:5000/deal-card');
            setPlayerHand(prevHand => [...prevHand, response.data]);
        } catch (error) {
            console.error('Error dealing card:', error);
        }
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
                <h4>Player's Score: {playerScore}</h4>
                <h4>Dealer's Score: {dealerScore}</h4>
            </div>
            <div className="button-container">
                <Button variant="contained" color="primary" onClick={startGame}>New Game</Button>
                <Button variant="outlined" color="secondary" onClick={dealCard}>Hit</Button>
                <Button variant="outlined" color="secondary">Stand</Button>
            </div>
        </div>
    );
};

export default BlackjackGame;
