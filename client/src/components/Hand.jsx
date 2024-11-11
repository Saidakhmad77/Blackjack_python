import React from 'react';

const Hand = ({ cards, owner }) => {
    return (
        <div className="hand">
            <h3>{owner}'s Hand</h3>
            <div className="card-container">
                {cards && cards.length > 0 ? (
                    cards.map((card, index) => (
                        card && card.rank && card.suit ? (
                            <div key={index} className="card">
                                <p>{card.rank} of {card.suit}</p>
                            </div>
                        ) : (
                            <div key={index} className="card-placeholder">
                                <p>Invalid Card</p>
                            </div>
                        )
                    ))
                ) : (
                    <p>No cards</p>
                )}
            </div>
        </div>
    );
};

export default Hand;