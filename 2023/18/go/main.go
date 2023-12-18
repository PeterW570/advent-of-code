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

	interior := shoelace(vertices)
	totalArea := picks(interior, length)

	fmt.Printf("Part 2: %d\n", totalArea)
}

// Shoelace formula
// https://www.themathdoctors.org/polygon-coordinates-and-areas/
func shoelace(vertices []utils.Coords) int {
	var a, b int
	for i := 0; i < len(vertices)-1; i++ {
		a += vertices[i].Col * vertices[i+1].Row
		b += vertices[i].Row * vertices[i+1].Col
	}
	c := a - b
	if c < 0 {
		c = -c
	}
	return c / 2
}

// Pick's theorem
// https://en.wikipedia.org/wiki/Pick%27s_theorem
func picks(interiorArea, perimeter int) int {
	return interiorArea + perimeter/2 + 1
}
