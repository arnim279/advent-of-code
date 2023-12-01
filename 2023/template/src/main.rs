use std::{fs::read_to_string, io};

fn main() {
    println!("Advent Of Code 2023, Day 01\n---");

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

fn part_one(_input: &str) -> Result<String, io::Error> {
    Ok("TODO".into())
}

fn part_two(_input: &str) -> Result<String, io::Error> {
    Ok("TODO".into())
}
