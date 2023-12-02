use std::fs::read_to_string;

fn main() {
    println!("Advent of Code 2023, Day 02\n---");

    let input = read_to_string("inputs/day02.txt").expect("couldn't find input file");

    println!("Part one:\n{}", part_one(&input));
    println!("\nPart two:\n{}", part_two(&input));
}

fn part_one(input: &str) -> String {
    let sum: u32 = input
        .lines()
        .map(|line| {
            let (game_name, draws) = line.split_once(": ").unwrap();
            let game_id: u32 = game_name.replace("Game ", "").parse().unwrap();

            for pair in draws.split("; ") {
                for cube_set in pair.split(", ") {
                    let (amount, color) = cube_set.split_once(' ').unwrap();
                    if amount.parse::<u8>().unwrap() > part_one_color_limit(color) {
                        return 0;
                    }
                }
            }
            game_id
        })
        .sum();

    sum.to_string()
}

fn part_one_color_limit(color: &str) -> u8 {
    match color {
        "red" => 12,
        "green" => 13,
        "blue" => 14,
        _ => unreachable!(),
    }
}

fn part_two(input: &str) -> String {
    let sum: u32 = input
        .lines()
        .map(|line| {
            let (_, draws) = line.split_once(": ").unwrap();

            let mut min_amounts = [0, 0, 0];

            for pair in draws.split("; ") {
                for cube_set in pair.split(", ") {
                    let (amount, color) = cube_set.split_once(' ').unwrap();
                    let amount: u32 = amount.parse().unwrap();
                    let color_index = match color {
                        "red" => 0,
                        "green" => 1,
                        "blue" => 2,
                        _ => unreachable!(),
                    };

                    min_amounts[color_index] = min_amounts[color_index].max(amount);
                }
            }

            min_amounts.iter().product::<u32>()
        })
        .sum();

    sum.to_string()
}
