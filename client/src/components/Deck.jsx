import Card from './Card';
import { useState } from 'react';

const Deck = ({ onDeal }) => {
    const [deck, setDeck] = useState([]);

    const shuffleDeck = () => {
        // Simulate a shuffled deck and save it in state
        const shuffledDeck = createShuffledDeck();
        setDeck(shuffledDeck);
    };

    const dealCard = () => {
        const card = deck.pop();  // Remove one card from the end of the deck
        setDeck([...deck]);  // Update the deck state
        if (onDeal) onDeal(card);  // Pass the dealt card to the parent component
    };

    const createShuffledDeck = () => {
        // Here you can implement or import your card-shuffling logic
        return [/*...array of shuffled cards...*/];
    };

    return (
        <div>
            <button onClick={shuffleDeck}>Shuffle Deck</button>
            <button onClick={dealCard}>Deal Card</button>
        </div>
    );
};

export default Deck;
