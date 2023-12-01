use std::{fs::read_to_string, io};

fn main() {
    println!("Advent of Code 2023, Day 01\n---");

    let input = read_to_string("inputs/day01.txt").expect("couldn't find input file");

    println!(
        "Part one:\n{}",
        part_one(&input).map_or_else(|e| e.to_string(), |v| v)
    );
    println!(
        "\nPart two:\n{}",
        part_two(&input).map_or_else(|e| e.to_string(), |v| v)
    );
}

fn part_one(input: &str) -> Result<String, io::Error> {
    let sum: u32 = input
        .lines()
        .map(|line| {
            let mut result = 0;
            for c in line.chars() {
                if c.is_ascii_digit() {
                    result += c.to_digit(10).unwrap() * 10;
                    break;
                }
            }
            for c in line.chars().rev() {
                if c.is_ascii_digit() {
                    result += c.to_digit(10).unwrap();
                    break;
                }
            }
            result
        })
        .sum();

    Ok(sum.to_string())
}

fn part_two(input: &str) -> Result<String, io::Error> {
    let input = input
        .replace("one", "one1one")
        .replace("two", "two2two")
        .replace("three", "three3three")
        .replace("four", "four4four")
        .replace("five", "five5five")
        .replace("six", "six6six")
        .replace("seven", "seven7seven")
        .replace("eight", "eight8eight")
        .replace("nine", "nine9nine");

    part_one(&input)
}
