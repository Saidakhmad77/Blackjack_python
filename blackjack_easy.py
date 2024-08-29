import random

card_values = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
}

suits = ("Hearts", "Diamonds", "Clubs", "Spades")
ranks = tuple(card_values.keys())


deck = [{rank, suit} for suit in suits for rank in ranks]

random.shuffle(deck)


def deal_card(deck):
    return deck.pop()

def initial_deal(deck):
    player_hand = [deal_card(deck), deal_card(deck)]
    dealer_hand = [deal_card(deck), deal_card(deck)]
    return player_hand, dealer_hand

def calculate_hand_value(hand):
    """Calculates the total value of a hand."""
    value = 0
    aces = 0
    for card, suit in hand:
        value += card_values[card]
        if card == 'A':
            aces += 1
    
    while value > 21 and aces:
        value -= 10
        aces -= 1
    
    return value
    
def check_blackjack(hand):
    return calculate_hand_value(hand) == 21

def check_bust(hand):
    return calculate_hand_value(hand) > 21

def play_blackjack():
    while True:
        deck = [(rank, suit) for suit in suits for rank in ranks]
        random.shuffle(deck)
        
        player_hand, dealer_hand = initial_deal(deck)
        
        print(f"Dealer shows: {dealer_hand[0]}")
        print(f"Your hand: {player_hand}")
        
        player_turn = True
        while player_turn:
            player_value = calculate_hand_value(player_hand)
            print(f"Your current hand value: {player_value}")
            
            if check_blackjack(player_hand):
                print("Blackjack! You win!")
                break
            
            if check_bust(player_hand):
                print("You bust! Dealer wins.")
                break
            
            move = input("Do you want to [h]it or [s]tand? ").strip().lower()
            if move == 'h':
                player_hand.append(deal_card(deck))
                print(f"Your hand: {player_hand}")
            elif move == 's':
                player_turn = False 
            else:
                print("Invalid input. Please enter 'h' to hit or 's' to stand.")
        
        if not check_bust(player_hand) and not check_blackjack(player_hand):
            while calculate_hand_value(dealer_hand) < 17:
                dealer_hand.append(deal_card(deck))
                print(f"Dealer hits: {dealer_hand}")
        
            dealer_value = calculate_hand_value(dealer_hand)
            print(f"Dealer's final hand: {dealer_hand}")
            print(f"Dealer's hand value: {dealer_value}")
        
            if check_bust(dealer_hand):
                print("Dealer busts! You win.")
            elif dealer_value > player_value:
                print("Dealer wins.")
            elif dealer_value < player_value:
                print("You win!")
            else:
                print("It's a tie!")
        
        play_again = input("Do you want to play again? (yes/no): ").strip().lower()
        if play_again != 'yes':
            print("Thanks for playing :)")
            break  
    

if __name__=="__main__":
    play_blackjack()