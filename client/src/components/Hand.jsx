import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
`;

const Card = styled.div`
    width: 80px;
    height: 120px;
    border-radius: 10px;
    background-color: white;
    border: 1px solid #000;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    font-weight: bold;
    font-family: 'Arial', sans-serif;
    color: ${(props) => (props.isRed ? 'red' : 'black')};
`;

const Rank = styled.div`
    font-size: 1.5rem;
`;

const Suit = styled.div`
    font-size: 2rem;
`;

const Hand = ({ cards, owner }) => {
    return (
        <div>
            <h3>{owner}'s Hand</h3>
            <CardContainer>
                {cards && cards.length > 0 ? (
                    cards.map((card, index) => (
                        card && card.rank && card.suit ? (
                            <Card key={index} isRed={card.suit === 'Hearts' || card.suit === 'Diamonds'}>
                                <Rank>{card.rank}</Rank>
                                <Suit>{getSuitSymbol(card.suit)}</Suit>
                                <Rank>{card.rank}</Rank>
                            </Card>
                        ) : (
                            <div key={index} className="card-placeholder">
                                <p>Invalid Card</p>
                            </div>
                        )
                    ))
                ) : (
                    <p>No cards</p>
                )}
            </CardContainer>
        </div>
    );
};

const getSuitSymbol = (suit) => {
    switch (suit) {
        case 'Hearts':
            return '♥';
        case 'Diamonds':
            return '♦';
        case 'Clubs':
            return '♣';
        case 'Spades':
            return '♠';
        default:
            return '';
    }
};

export default Hand;