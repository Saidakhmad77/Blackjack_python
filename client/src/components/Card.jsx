import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
    width: 80px;
    height: 120px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #333;
    margin: 8px;
`;

const Card = ({ rank, suit }) => (
    <CardContainer>
        {rank} of {suit}
    </CardContainer>
);

export default Card;