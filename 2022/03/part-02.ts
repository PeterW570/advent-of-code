const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

const getPriority = (letter: string) => 
  letter.charCodeAt(0) - (letter === letter.toLowerCase() ? (97 - 1) : (65 - 27))

let badgeTotal = 0;
let groupBags = [];
for (const line of lines) {
  groupBags.push(line);
  
  if (groupBags.length < 3) {
    continue;
  }

  const [
    bagOne,
    bagTwo,
    bagThree
  ] = groupBags;

  const commonItem = bagOne.split("").find(x => bagTwo.includes(x) && bagThree.includes(x));

  if (!commonItem) {
    throw new Error("Couldn't find common item for group");
  }

  const priority = getPriority(commonItem);
  badgeTotal += priority;

  groupBags = [];
}

console.log(badgeTotal);
