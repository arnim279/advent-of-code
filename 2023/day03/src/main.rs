use std::{collections::HashMap, fs::read_to_string};

fn main() {
    println!("Advent of Code 2023, Day 03\n---");

    let input = read_to_string("inputs/day03.txt").expect("couldn't find input file");
    let schematic = parse_input(&input);

    println!("Part one:\n{}", part_one(&schematic));
    println!("\nPart two:\n{}", part_two(&schematic));
}

fn parse_input(input: &str) -> Schematic {
    input.lines().map(|l| l.chars().collect()).collect()
}

type Schematic = Vec<Vec<char>>;

fn get_symbols(schematic: &Schematic) -> HashMap<(usize, usize), Vec<u32>> {
    let mut symbols: HashMap<(usize, usize), Vec<u32>> = HashMap::new();

    for (line, line_idx) in schematic.iter().zip(0..) {
        let mut part_number = 0;
        let mut symbol_pos = None;

        for (char, char_idx) in line.iter().zip(0..) {
            if !char.is_ascii_digit() {
                if let Some(symbol_pos) = symbol_pos {
                    symbols
                        .entry(symbol_pos)
                        .and_modify(|part_numbers| part_numbers.push(part_number))
                        .or_insert(vec![part_number]);
                }
                part_number = 0;
                symbol_pos = None;
                continue;
            }

            part_number = 10 * part_number + char.to_digit(10).unwrap();

            for x in -1_i32..=1 {
                for y in -1_i32..=1 {
                    let y = ((line_idx + y).max(0) as usize).min(schematic.len() - 1);
                    let x = ((char_idx + x).max(0) as usize).min(line.len() - 1);

                    let possible_symbol = schematic[y][x];

                    if !possible_symbol.is_ascii_digit() && possible_symbol != '.' {
                        symbol_pos = Some((y, x))
                    }
                }
            }
        }

        if let Some(symbol_pos) = symbol_pos {
            symbols
                .entry(symbol_pos)
                .and_modify(|part_numbers| part_numbers.push(part_number))
                .or_insert(vec![part_number]);
        }
    }

    symbols
}

fn part_one(schematic: &Schematic) -> String {
    get_symbols(schematic)
        .values()
        .flatten()
        .sum::<u32>()
        .to_string()
}

fn part_two(schematic: &Schematic) -> String {
    get_symbols(schematic)
        .iter()
        .filter(|((y, x), part_numbers)| schematic[*y][*x] == '*' && part_numbers.len() == 2)
        .map(|(_, part_numbers)| part_numbers.iter().product::<u32>())
        .sum::<u32>()
        .to_string()
}
