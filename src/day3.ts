export const part1 = (input: string) =>
	input
		.split("\r\n")
		.filter((row) => row.length)
		.map((rowStr) => rowStr.split(""))
		.map((row) => {
			return [row.splice(0, row.length / 2), row];
		})
		.map(([compartment1, compartment2]) =>
			findDuplicateItems(compartment1, compartment2)
		)
		.flat()
		.map((item) => getItemPriority(item))
		.reduce((sum, c) => sum + c, 0);

export const part2 = (input: string) =>
	input
		.split("\r\n")
		.filter((row) => row.length)
		.map((rowStr) => rowStr.split(""))
		// group into groups of 3
		.reduce<string[][][]>((groups, curr, currIndex) => {
			if (currIndex % 3 === 0) groups.push([]);
			groups.at(-1).push(curr);
			return groups;
		}, [])
		.map((group) => {
			let duplicate = findDuplicateItems(group[0], group[1]);
			duplicate = findDuplicateItems(duplicate, group[2]);
			if (duplicate.length > 1) {
				throw new Error(
					"Found more than 1 common item in all 3 groups"
				);
			}
			return getItemPriority(duplicate[0]);
		})
		.reduce((sum, c) => sum + c, 0);

const findDuplicateItems = (compartment1: string[], compartment2: string[]) => {
	let compartment1Items = new Map<string, null>();

	let duplicateItems = new Map<string, null>();
	for (let item of compartment1) compartment1Items.set(item, null);
	for (let item of compartment2) {
		if (compartment1Items.has(item)) duplicateItems.set(item, null);
	}

	return Array.from(duplicateItems.keys());
};

const getItemPriority = (item: string): number => {
	let itemRegex = /[a-zA-Z]/;
	if (!itemRegex.test(item)) {
		throw new Error(`Item '${item}' is expected to within a-z or A-Z`);
	}

	let asciiCode = item.charCodeAt(0);

	// A-Z
	if (asciiCode >= 65 && asciiCode <= 90) return asciiCode - 65 + 27; // A-Z should start at 27

	// a-z
	if (asciiCode >= 97 && asciiCode <= 122) return asciiCode - 97 + 1; // a-z should start at 1
};
