import Card from './Card';
import './Hand.css';

const Hand = ({ cards, owner }) => (
    <div className="hand-container">
        <h3 className="hand-title">{owner}'s Hand</h3>
        <div className="cards-row">
            {cards.map((card, index) => (
                <Card key={index} rank={card.rank} suit={card.suit} />
            ))}
        </div>
    </div>
);

export default Hand;
