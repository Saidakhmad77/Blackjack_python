from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Enables CORS for cross-origin requests

card_values = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
}

suits = ("Hearts", "Diamonds", "Clubs", "Spades")
ranks = tuple(card_values.keys())

class Card:
    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit
        
    def __str__(self):
        return f"{self.rank} of {self.suit}"
    
    def value(self):
        return card_values[self.rank]
    
class Deck:
    def __init__(self):
        self.cards = [Card(rank, suit) for suit in suits for rank in ranks]
        self.shuffle()
        
    def shuffle(self):
        random.shuffle(self.cards)
        
    def deal_card(self):
        return self.cards.pop()
    
class Hand:
    def __init__(self):
        self.cards = []
        
    def add_card(self, card):
        self.cards.append(card)
        
    def calculate_value(self):
        value = 0
        aces = 0
        for card in self.cards:
            value += card.value()
            if card.rank == 'A':
                aces += 1
                
        while value > 21 and aces:
            value -= 10
            aces -= 1
        return value
    
    def is_blackjack(self):
        return self.calculate_value() == 21
    
    def is_bust(self):
        return self.calculate_value() > 21
    
    def serialize(self):
        return [{'rank': card.rank, 'suit': card.suit} for card in self.cards]

class BlackjackGame:
    def __init__(self):
        self.deck = Deck()
        self.player_hand = Hand()
        self.dealer_hand = Hand()

    def initial_deal(self):
        self.player_hand.add_card(self.deck.deal_card())
        self.player_hand.add_card(self.deck.deal_card())
        self.dealer_hand.add_card(self.deck.deal_card())
        self.dealer_hand.add_card(self.deck.deal_card())

    def deal_card_to_player(self):
        card = self.deck.deal_card()
        self.player_hand.add_card(card)
        return card

    def deal_card_to_dealer(self):
        card = self.deck.deal_card()
        self.dealer_hand.add_card(card)
        return card

# Create an instance of the game
game = BlackjackGame()

@app.route('/start-game', methods=['POST'])
def start_game():
    game.__init__()  # Reinitialize the game
    game.initial_deal()
    return jsonify({
        'player_hand': game.player_hand.serialize(),
        'dealer_hand': game.dealer_hand.serialize()[:1]  # Show only one dealer card
    })

@app.route('/deal-card', methods=['GET'])
def deal_card():
    card = game.deal_card_to_player()
    return jsonify({'rank': card.rank, 'suit': card.suit})

@app.route('/get-player-hand', methods=['GET'])
def get_player_hand():
    return jsonify(game.player_hand.serialize())

@app.route('/get-dealer-hand', methods=['GET'])
def get_dealer_hand():
    return jsonify(game.dealer_hand.serialize())

if __name__ == '__main__':
    app.run(debug=True)
