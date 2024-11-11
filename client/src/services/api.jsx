import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const startGame = () => axios.post(`${API_BASE_URL}/start-game`);
export const dealCard = () => axios.get(`${API_BASE_URL}/deal-card`);
export const dealCardToDealer = () => axios.get(`${API_BASE_URL}/deal-card-to-dealer`);
export const getPlayerHand = () => axios.get(`${API_BASE_URL}/get-player-hand`);
export const getDealerHand = () => axios.get(`${API_BASE_URL}/get-dealer-hand`);