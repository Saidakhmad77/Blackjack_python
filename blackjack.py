import random

card_values = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 10, "Q": 10, "K": 10, "A": 11
}

suits = ["Hearts", "Diamonds", "Clubs", "Spades"]


def create_deck():
    deck = []
    for suit in suits:
        for value in card_values:
            deck.append((value, suit))
    random.shuffle(deck)
    return deck

def calculate_hand_value(hand):
    value = 0
    ace_count = 0
    for card in hand:
        value += card_values[card[0]]
        if card[0] == "A":
            ace_count += 1
            
    while value > 21 and ace_count:
        value -= 10
        ace_count -= 1
        
    return value

def display_hand(hand, name):
    print(f"{name}'s hand: " + ", ".join([f"{card[0]} of {card[1]}" for card in hand]))
    
def play_blackjack():
    deck = create_deck()
    
    player_hand = [deck.pop(), deck.pop()]
    dealer_hand = [deck.pop(), deck.pop()]
    
    display_hand(player_hand, "Player")
    print(f"Dealer's hand: {dealer_hand[0][0]} of {dealer_hand[0][1]}, [Hidden]")
    
    
    while True:
        player_value = calculate_hand_value(player_hand)
        if player_value > 21:
            print("Dealer wins!")
            return
        choice = input("Do you want to [H]it or [S]tand? ").lower()
        if choice == 'h':
            player_hand.append(deck.pop())
            display_hand(player_hand, "Player")
        elif choice == 's':
            break
        
    display_hand(dealer_hand, "Dealer")
    while calculate_hand_value(dealer_hand) < 17:
        dealer_hand.append(deck.pop())
        display_hand(dealer_hand, "Dealer")
        
    player_value = calculate_hand_value(player_hand)
    dealer_value = calculate_hand_value(dealer_hand)
    
    if dealer_value > 21:
        print("Player wins!!!")
    elif player_value > dealer_value:
        print("Player wins!")
    elif player_value < dealer_value:
        print("Dealer wins!")
    else:
        print("It's a tie!")
        
        
play_blackjack()

play_again = input("Do you want to play again? (yes/no): ").strip().lower()
if play_again == 'yes':
    play_blackjack()
else:
    print("Thanks for playing :)")
        
            
if __name__ == "__main__":
    play_blackjack()