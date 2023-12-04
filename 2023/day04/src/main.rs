use std::{
    collections::{hash_map::RandomState, HashMap, HashSet},
    fs::read_to_string,
};

fn main() {
    println!("Advent of Code 2023, Day 04\n---");

    let input = read_to_string("inputs/day04.txt").expect("couldn't find input file");

    println!("Part one:\n{}", part_one(&input));
    println!("\nPart two:\n{}", part_two(&input));
}

fn parse_input(input: &str) -> Vec<(HashSet<usize, RandomState>, Vec<usize>)> {
    input
        .lines()
        .map(|line| {
            let numbers: Vec<Vec<usize>> = line
                .split_once(": ")
                .unwrap()
                .1
                .split(" | ")
                .map(|numbers| {
                    numbers
                        .split(' ')
                        .filter(|n| !n.is_empty())
                        .map(|num| num.parse::<usize>().unwrap())
                        .collect()
                })
                .collect();

            let winning_numbers = HashSet::from_iter(numbers[0].iter().copied());
            let own_numbers = numbers[1].clone();

            (winning_numbers, own_numbers)
        })
        .collect()
}

fn part_one(input: &str) -> String {
    parse_input(input)
        .iter()
        .map(|(winning_numbers, own_numbers)| {
            let mut score = 0;

            for n in own_numbers.iter() {
                if winning_numbers.contains(n) {
                    if score == 0 {
                        score = 1;
                    } else {
                        score <<= 1;
                    }
                }
            }

            score
        })
        .sum::<usize>()
        .to_string()
}

fn part_two(input: &str) -> String {
    let input = parse_input(input);
    let mut scratchcard_copies = HashMap::new();

    for (i, (winning_numbers, own_numbers)) in input.iter().enumerate() {
        let current_copies = *scratchcard_copies.entry(i).or_insert(1);

        let matching_numbers = own_numbers
            .iter()
            .filter(|n| winning_numbers.contains(n))
            .count();

        for offset in 1..=matching_numbers {
            scratchcard_copies
                .entry(i + offset)
                .and_modify(|c| *c += current_copies)
                .or_insert(1 + current_copies);
        }
    }

    scratchcard_copies.values().sum::<usize>().to_string()
}
