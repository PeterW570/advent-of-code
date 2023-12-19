package main

import (
	"flag"
	"fmt"
	"strconv"
	"strings"

	utils "peterweightman.com/aoc/utils"
)

func main() {
	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	currPos := utils.Coords{}
	vertices := []utils.Coords{}
	length := 0

	utils.IterateFileLines("../"+fileName, func(line string) {
		splits := strings.Fields(line)

		dirIntStr := splits[2][7:8]
		hexCountStr := splits[2][2:7]

		uintCount, _ := strconv.ParseUint(hexCountStr, 16, 32)
		count := int(uintCount)
		var dir utils.Dir
		switch dirIntStr {
		case "3":
			dir = utils.North
		case "1":
			dir = utils.South
		case "2":
			dir = utils.West
		case "0":
			dir = utils.East
		}

		currPos = currPos.MoveDistInDir(dir, count)
		vertices = append(vertices, currPos)
		length += count
	})

	area := shoelace(vertices)
	totalPointCount := picks(area, length)

	fmt.Printf("Part 2: %d\n", totalPointCount)
}

// Shoelace formula (Triangle formula)
// A = 1/2 Sum ( xi*yi+1 - xi+1*yi )
// https://en.wikipedia.org/wiki/Shoelace_formula#Triangle_formula
// https://www.themathdoctors.org/polygon-coordinates-and-areas/
func shoelace(vertices []utils.Coords) int {
	sum := 0
	for i := 0; i < len(vertices)-1; i++ {
		sum += vertices[i].Col*vertices[i+1].Row -
			vertices[i].Row*vertices[i+1].Col
	}
	if sum < 0 {
		sum = -sum
	}
	return sum / 2
}

// Pick's theorem
// A = i + b/2 - 1
// A is area, i is interior points, b is boundary points
// we want to find i + b => A + b/2 + 1
// https://en.wikipedia.org/wiki/Pick%27s_theorem
func picks(area, perimeterPoints int) int {
	return area + perimeterPoints/2 + 1
}
