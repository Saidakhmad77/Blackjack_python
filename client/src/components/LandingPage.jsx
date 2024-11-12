import React from 'react';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import gameImage from '../assets/blackjack.jpg';

const LandingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    position: relative;
    color: #fff;
    text-align: left;
    overflow: hidden;
    background-image: url(${gameImage});
    background-size: cover;
    background-position: center;
`;

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* Dark overlay with 70% opacity */
`;

const Content = styled.div`
    position: relative;
    z-index: 1;
    padding: 20px;
    max-width: 500px;
    margin-top: 20px;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    color: #ffffff;
    @media (max-width: 768px) {
        font-size: 2rem;
    }
    @media (max-width: 480px) {
        font-size: 1.7rem;
    }
`;

const Description = styled.p`
    font-size: 1.2rem;
    line-height: 1.6;
    margin-top: 15px;
    color: #dddddd;
    @media (max-width: 768px) {
        font-size: 1rem;
    }
    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
`;

const StyledButton = styled(Button)`
    background-color: #6200ea !important;
    color: #fff !important;
    font-weight: bold;
    margin-top: 30px;
    padding: 10px 30px;
    font-size: 1.1rem;
    @media (max-width: 768px) {
        padding: 8px 24px;
        font-size: 1rem;
    }
`;

const LandingPage = ({ onStart }) => {
    return (
        <LandingContainer>
            <Overlay />
            <Content>
                <Title>Welcome to Blackjack</Title>
                <Description>
                    Experience the thrill of Blackjack! Challenge the dealer, test your luck, and aim for 21.
                    Click "Start Game" when you're ready to begin!
                </Description>
                <StyledButton variant="contained" onClick={onStart}>
                    Start Game
                </StyledButton>
            </Content>
        </LandingContainer>
    );
};

export default LandingPage;