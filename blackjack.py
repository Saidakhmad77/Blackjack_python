import random

suits = ['♠', '♥', '♦', '♣']
ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']


card_values = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 10, "Q": 10, "K": 10, "A": 11
}


def create_deck():
    deck = [(rank, suit) for suit in suits for rank in ranks]
    random.shuffle(deck)
    return deck

# Function to generate a card's ASCII art
def generate_card_ascii(rank, suit):
    lines = [
        "┌─────────┐",
        f"│{rank:<2}       │",  # Rank on the top left
        "│         │",
        f"│    {suit}    │",  # Suit in the middle
        "│         │",
        f"│       {rank:>2}│",  # Rank on the bottom right
        "└─────────┘"
    ]
    return "\n".join(lines)

# Function to display a hand of cards
def display_hand_ascii(hand, name):
    print(f"{name}'s hand:")
    card_art = [generate_card_ascii(rank, suit) for rank, suit in hand]
    # Split each card's ASCII art into lines and zip them together
    card_lines = [card.splitlines() for card in card_art]
    for lines in zip(*card_lines):
        print("  ".join(lines))
    print()

# Function to calculate the value of a hand
def calculate_hand_value(hand):
    value = 0
    ace_count = 0
    for rank, suit in hand:
        value += card_values[rank]
        if rank == "A":
            ace_count += 1
    
    # Adjust for aces if the total value is over 21
    while value > 21 and ace_count:
        value -= 10
        ace_count -= 1
    
    return value

# Function to play a round of Blackjack
def play_blackjack():
    deck = create_deck()

    # Deal initial two cards to player and dealer
    player_hand = [deck.pop(), deck.pop()]
    dealer_hand = [deck.pop(), deck.pop()]

    # Display player's hand and one of dealer's cards
    display_hand_ascii(player_hand, "Player")
    print("Dealer's hand:")
    print(generate_card_ascii(dealer_hand[0][0], dealer_hand[0][1]))
    print("┌─────────┐")
    print("│░░░░░░░░░│")
    print("│░░░░░░░░░│")
    print("│░░░░░░░░░│")
    print("│░░░░░░░░░│")
    print("│░░░░░░░░░│")
    print("└─────────┘")
    print()

    # Player's turn
    while True:
        player_value = calculate_hand_value(player_hand)
        if player_value > 21:
            print("Dealer wins.")
            return
        choice = input("Do you want to [H]it or [S]tand? ").lower()
        if choice == 'h':
            player_hand.append(deck.pop())
            display_hand_ascii(player_hand, "Player")
        elif choice == 's':
            break

    # Dealer's turn
    display_hand_ascii(dealer_hand, "Dealer")
    while calculate_hand_value(dealer_hand) < 17:
        dealer_hand.append(deck.pop())
        display_hand_ascii(dealer_hand, "Dealer")

    # Determine the winner
    player_value = calculate_hand_value(player_hand)
    dealer_value = calculate_hand_value(dealer_hand)

    if dealer_value > 21:
        print("Player wins.")
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