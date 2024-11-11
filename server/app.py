from flask import Flask, jsonify, request
from flask_cors import CORS
from logic import BlackjackGame, serialize_card

app = Flask(__name__)
CORS(app)

game = BlackjackGame()

@app.route('/start-game', methods=['POST'])
def start_game():
    global game
    game = BlackjackGame()
    game.initial_deal()
    return jsonify({
        'player_hand': game.player_hand.serialize(),
        'dealer_hand': [game.dealer_hand.serialize()[0]],  # Only show one dealer card initially
    })

@app.route('/deal-card', methods=['GET'])
def deal_card():
    card = game.deal_card_to_player()
    if card is None:
        return jsonify({'error': 'No more cards in the deck'}), 400
    return jsonify(serialize_card(card))

@app.route('/deal-card-to-dealer', methods=['GET'])
def deal_card_to_dealer():
    card = game.deal_card_to_dealer()
    if card is None:
        return jsonify({'error': 'No more cards in the deck'}), 400
    return jsonify(serialize_card(card))

@app.route('/get-player-hand', methods=['GET'])
def get_player_hand():
    return jsonify(game.player_hand.serialize())

@app.route('/get-dealer-hand', methods=['GET'])
def get_dealer_hand():
    return jsonify(game.dealer_hand.serialize())

if __name__ == '__main__':
    app.run(debug=True)