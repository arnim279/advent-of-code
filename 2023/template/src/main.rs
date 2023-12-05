const INPUT: &str = include_str!("../../inputs/day01.txt");

fn main() {
    println!("Advent of Code 2023, Day XX\n---");

    let parsed_input = parse_input(INPUT);

    println!("Part one:\n{}\n", part_one(&parsed_input));
    println!("Part two:\n{}", part_two(&parsed_input));
}

type ParsedInput<'a> = &'a str;

fn parse_input(input: &str) -> ParsedInput {
    input
}

fn part_one(input: &ParsedInput) -> usize {
    input.len()
}

fn part_two(input: &ParsedInput) -> usize {
    input.len()
}
