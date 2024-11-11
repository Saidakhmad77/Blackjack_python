import random

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
        if not self.cards:
            return None 
        return self.cards.pop()

class Hand:
    def __init__(self):
        self.cards = []
        
    def add_card(self, card):
        if card:
            self.cards.append(card)
        
    def calculate_value(self):
        value = 0
        aces = 0
        for card in self.cards:
            value += card.value()
            if card.rank == 'A':
                aces += 1
                
        # Adjust for aces if the value is over 21
        while value > 21 and aces:
            value -= 10
            aces -= 1
        return value
    
    def is_blackjack(self):
        return self.calculate_value() == 21
    
    def is_bust(self):
        return self.calculate_value() > 21
    
    def serialize(self):
        return [serialize_card(card) for card in self.cards]  # Use serialize_card function

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
        return self.deck.deal_card()

    def deal_card_to_dealer(self):
        return self.deck.deal_card()

# Standalone serialize_card function
def serialize_card(card):
    return {
        'rank': card.rank,
        'suit': card.suit,
        'value': card.value()
    }