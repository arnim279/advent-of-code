const INPUT: &str = include_str!("../../inputs/day06.txt");

fn main() {
    println!("Advent of Code 2023, Day 06\n---");

    println!("Part one:\n{}\n", part_one(INPUT));
    println!("Part two:\n{}", part_two(INPUT));
}

fn part_one(input: &str) -> usize {
    let mut input = input.lines();
    let mut next_line = || {
        input
            .next()
            .unwrap()
            .split_once(':')
            .unwrap()
            .1
            .split_ascii_whitespace()
            .map(|v| v.parse::<usize>().unwrap())
    };

    let times = next_line();
    let records = next_line();

    let races: Vec<(usize, usize)> = times.zip(records).collect();

    races
        .iter()
        .map(|(race_time, record)| {
            (0..=*race_time)
                .map(|button_time| (button_time) * (race_time - button_time))
                .filter(|distance| distance > record)
                .count()
        })
        .product()
}

fn part_two(input: &str) -> usize {
    part_one(&input.replace(' ', ""))
}
