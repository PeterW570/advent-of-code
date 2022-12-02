const input = await Deno.readTextFile("input.txt");
const lines = input.split("\n");

let max = 0;
let current = 0;
for (const line of lines) {
    if (line.trim() === "") {
        max = Math.max(current, max);
        current = 0;
    } else {
        current += Number(line);
    }
}
max = Math.max(current, max);

console.log(max);
