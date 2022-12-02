const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

const totals = [];
let current = 0;
for (const line of lines) {
    if (line.trim() === "") {
        totals.push(current);
        current = 0;
    } else {
        current += Number(line);
    }
    
}
totals.push(current);
totals.sort((a, b) => a > b ? -1 : 1);

const topThreeTotal = totals[0] + totals[1] + totals[2];

console.log(topThreeTotal);
