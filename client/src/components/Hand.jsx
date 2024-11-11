import React from 'react';
import Card from './Card';
import styled from 'styled-components';

const HandContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 10px 0;
`;

const Hand = ({ cards = [], owner }) => (
    <div>
        <h3>{owner}'s Hand</h3>
        <HandContainer>
            {Array.isArray(cards) ? (
                cards.map((card, index) => (
                    <Card key={index} rank={card.rank} suit={card.suit} />
                ))
            ) : (
                <p>Error: Invalid card data</p>
            )}
        </HandContainer>
    </div>
);

export default Hand;