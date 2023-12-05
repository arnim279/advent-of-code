const INPUT: &str = include_str!("../../inputs/day05.txt");

fn main() {
    println!("Advent of Code 2023, Day 05\n---");

    let parsed_input = parse_input(INPUT);

    println!("Part one:\n{}\n", part_one(&parsed_input));
    println!("Part two:\n{}", part_two(&parsed_input));
}

type ParsedInput = (Vec<usize>, Vec<Vec<(usize, usize, usize)>>);

fn parse_input(input: &str) -> ParsedInput {
    let mut maps = Vec::new();

    let mut blocks = input.split("\n\n");

    let seeds: Vec<usize> = blocks
        .next()
        .unwrap()
        .split_once(": ")
        .unwrap()
        .1
        .split_ascii_whitespace()
        .map(|v| v.parse().unwrap())
        .collect();

    for block in blocks {
        let mut map = Vec::new();
        for range in block.lines().skip(1) {
            let range: Vec<usize> = range
                .split_ascii_whitespace()
                .map(|v| v.parse().unwrap())
                .collect();

            let dest_start = range[0];
            let src_start = range[1];
            let length = range[2];

            map.push((src_start, src_start + length - 1, dest_start))
        }
        maps.push(map)
    }

    (seeds.clone(), maps)
}

fn part_one(input: &ParsedInput) -> usize {
    let mut seeds = input.0.clone();

    for map in input.1.iter() {
        let mut new_seeds = seeds.clone();
        for (i, seed) in seeds.iter().enumerate() {
            for transform in map {
                if &transform.0 <= seed && seed <= &transform.1 {
                    new_seeds[i] = transform.2 + (seed - transform.0);
                    break;
                }
            }
        }
        seeds = new_seeds;
    }

    *seeds.iter().min().unwrap()
}

fn part_two(input: &ParsedInput) -> usize {
    let seed_ranges: Vec<(usize, usize)> = input
        .0
        .windows(2)
        .step_by(2)
        .map(|v| (v[0], v[0] + v[1]))
        .collect();

    let seeds = seed_ranges
        .iter()
        .flat_map(|(start, end)| (*start..=*end))
        .collect();

    // way too slow but i don't wanna fix it
    part_one(&(seeds, input.1.clone()))
}
