use std::cmp::Ordering;

const INPUT: &str = include_str!("../../inputs/day07.txt");

fn main() {
    println!("Advent of Code 2023, Day 07\n---");

    println!("Part one:\n{}\n", part_one(INPUT));
    println!("Part two:\n{}", part_two(INPUT));
}

#[allow(dead_code)]
#[derive(PartialEq, Eq, Debug, PartialOrd, Ord, Clone, Copy)]
enum Card {
    Two = 2,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace,
}

impl From<&char> for Card {
    fn from(value: &char) -> Self {
        match value {
            '2'..='9' => unsafe { std::mem::transmute(value.to_digit(10).unwrap() as i8) },
            'T' => Self::Ten,
            'J' => Self::Jack,
            'Q' => Self::Queen,
            'K' => Self::King,
            'A' => Self::Ace,
            _ => panic!("invalid card: {}", value),
        }
    }
}

#[derive(PartialEq, Eq, Clone, Copy, Debug, PartialOrd, Ord)]
struct HandCards([Card; 5]);

impl HandCards {
    fn joker_order(&self, other: &Self) -> Ordering {
        for (card, other_card) in self.0.iter().zip(other.0.iter()) {
            let order = match (card, other_card) {
                (Card::Jack, Card::Jack) => Ordering::Equal,
                (Card::Jack, _) => Ordering::Less,
                (_, Card::Jack) => Ordering::Greater,
                _ => card.cmp(other_card),
            };

            if order != Ordering::Equal {
                return order;
            }
        }

        Ordering::Equal
    }
}

fn get_histogram(mut cards: [Card; 5], with_jokers: bool) -> ([usize; 5], usize) {
    cards.sort();

    let mut histogram = [0; 5];
    let mut joker_count = 0;

    let mut last = cards[0];
    let mut variant_count = 0;

    for card in cards {
        if with_jokers && card == Card::Jack {
            joker_count += 1;
            continue;
        }

        if card != last {
            variant_count += 1;
            last = card;
        }

        histogram[variant_count] += 1;
    }

    histogram.sort();
    histogram.reverse();

    (histogram, joker_count)
}

#[derive(Debug, PartialEq, Eq)]
struct Hand {
    cards: HandCards,
    bet: usize,
    with_jokers: bool,
    ty: HandType,
}

impl PartialOrd for Hand {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Hand {
    fn cmp(&self, other: &Self) -> Ordering {
        if self.ty != other.ty {
            return (self.ty as usize).cmp(&(other.ty as usize));
        }

        if self.with_jokers {
            self.cards.joker_order(&other.cards)
        } else {
            self.cards.cmp(&other.cards)
        }
    }
}

#[derive(PartialEq, Eq, Debug, Clone, Copy)]
enum HandType {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind,
}

impl HandType {
    fn from(value: [Card; 5], with_jokers: bool) -> Self {
        let (counts, joker_count) = get_histogram(value, with_jokers);

        let has_card_with_count = |count: usize| -> bool { counts[0] + joker_count >= count };

        if has_card_with_count(5) {
            return Self::FiveOfAKind;
        }

        if has_card_with_count(4) {
            return Self::FourOfAKind;
        }

        let has_full_house = {
            let required_jokers = 3 - counts[0].min(3) + 2 - counts[1].min(2);
            required_jokers <= joker_count
        };

        if has_full_house {
            return Self::FullHouse;
        }

        if has_card_with_count(3) {
            return Self::ThreeOfAKind;
        }

        let has_two_pair = {
            let required_jokers = 2 - counts[0].min(2) + 2 - counts[1].min(2);
            required_jokers <= joker_count
        };

        if has_two_pair {
            return Self::TwoPair;
        }

        if has_card_with_count(2) {
            return Self::OnePair;
        }

        Self::HighCard
    }
}

fn parse_input(inpuit: &str) -> impl Iterator<Item = ([Card; 5], usize)> + '_ {
    inpuit.lines().map(|line| {
        let (cards, bet) = line.split_once(' ').expect("invalid format");

        assert_eq!(cards.len(), 5, "invalid number of cards");

        let mut parsed_cards = [Card::Two; 5];

        for (i, card) in cards.chars().enumerate() {
            parsed_cards[i] = Card::from(&card);
        }

        let bet = bet.parse().expect("invalid bet");

        (parsed_cards, bet)
    })
}

fn solve(input: &str, with_jokers: bool) -> usize {
    let mut input: Vec<_> = parse_input(input)
        .map(|(cards, bet)| Hand {
            cards: HandCards(cards),
            bet,
            with_jokers,
            ty: HandType::from(cards, with_jokers),
        })
        .collect();

    input.sort();

    input
        .into_iter()
        .enumerate()
        .map(|(i, hand)| (i + 1) * hand.bet)
        .sum::<usize>()
}

fn part_one(input: &str) -> usize {
    solve(input, false)
}

fn part_two(input: &str) -> usize {
    solve(input, true)
}
