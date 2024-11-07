import React from 'react';
import styled from 'styled-components';
import './Card.css'; // For additional card styles

const CardContainer = styled.div`
    width: 80px;
    height: 120px;
    border-radius: 8px;
    background-color: #ffffff;
    background-size: cover;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 8px;
`;

const Card = ({ rank, suit }) => (
    <CardContainer>
        {rank} of {suit}
    </CardContainer>
);

export default Card;
