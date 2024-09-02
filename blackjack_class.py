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
    
    def __str__(self):
        return ", ".join(str(card) for card in self.cards)
    
class BlackjackGame:
    def __init__(self):
        self.deck = Deck()
        
    def initial_deal(self):
        player_hand = Hand()
        dealer_hand = Hand()
        player_hand.add_card(self.deck.deal_card())
        player_hand.add_card(self.deck.deal_card())
        dealer_hand.add_card(self.deck.deal_card())
        dealer_hand.add_card(self.deck.deal_card())
        return player_hand, dealer_hand
    
    def play(self):
        while True:
            self.deck = Deck()
            player_hand, dealer_hand = self.initial_deal()
            
            print(f"Dealer shows: {dealer_hand.cards[0]}")
            print(f"Your hand: {player_hand}")
            
            player_turn = True
            player_won = False  
            while player_turn:
                player_value = player_hand.calculate_value()
                print(f"Your current value: {player_value}")
                
                if player_hand.is_blackjack():
                    print("Blackjack! You win.")
                    player_won = True
                    break
                if player_hand.is_bust():
                    print("You bust. Dealer wins!")
                    player_won = True
                    break
                
                move = input("Do you want to [h]it or [s]tand? ").strip().lower()
                if move == 'h':
                    player_hand.add_card(self.deck.deal_card())
                    print(f"Your hand: {player_hand}")
                elif move == 's':
                    player_turn = False
                else:
                    print("Invalid input! Please enter 'h' to hit or 's' to stand.")
                    
            if not player_hand.is_bust() and not player_hand.is_blackjack() and not player_won:
                while dealer_hand.calculate_value() < 17:
                    dealer_hand.add_card(self.deck.deal_card())
                    print(f"Dealer hits: {dealer_hand}")
                    
                dealer_value = dealer_hand.calculate_value()
                print(f"Dealer's final hand: {dealer_hand}")
                print(f"Dealer's hand value: {dealer_value}")
                
                if dealer_hand.is_bust():
                    print("Dealer busts. You win!")
                elif dealer_value > player_value:
                    print("Dealer wins!")
                elif dealer_value < player_value:
                    print("You win!")
                else:
                    print("It's a tie!")
                    
            play_again = self.ask_to_play_again()
            if not play_again:
                print("Thanks for playing :)")
                break
                    
    def ask_to_play_again(self):
        while True:
            play_again = input("Do you want to play again? (yes/no): ").strip().lower()
            if play_again == 'yes':
                return True
            elif play_again == 'no':
                return False
            else:
                print("Invalid input! Please type 'yes' or 'no'.")
            
if __name__ == "__main__":
    game = BlackjackGame()
    game.play()

        