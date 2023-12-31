package main

import (
	"flag"
	"fmt"

	utils "peterweightman.com/aoc/utils"
)

var rows, cols int

func main() {
	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	grid := make(map[utils.Coords]string)

	rows = 0
	utils.IterateFileLines("../"+fileName, func(line string) {
		for col, char := range line {
			grid[utils.Coords{Row: rows, Col: col}] = string(char)
		}
		rows++
		cols = len(line)
	})

	start := utils.Coords{Row: 0, Col: 1}
	end := utils.Coords{Row: rows - 1, Col: cols - 2}

	trail := make(map[utils.Coords]bool)
	partOneTrail, ok := longestTrail(grid, trail, start, end)
	// debugTrail(grid, partOneTrail, rows, cols)
	if !ok {
		panic("Should be at least one trail")
	}

	fmt.Printf("Part 1: %d\n", len(partOneTrail))
}

func moveLeft(grid map[utils.Coords]string, trail map[utils.Coords]bool, pos utils.Coords) (newPos utils.Coords, ok bool) {
	left := pos.Left()
	if trail[pos] {
		return left, false
	} else if grid[pos] == "#" {
		return left, false
	} else if grid[pos] == ">" {
		return left, false
	}
	return left, true
}

func moveRight(grid map[utils.Coords]string, trail map[utils.Coords]bool, pos utils.Coords) (newPos utils.Coords, ok bool) {
	right := pos.Right()
	if trail[pos] {
		return right, false
	} else if grid[pos] == "#" {
		return right, false
	} else if grid[pos] == "<" {
		return right, false
	}
	return right, true
}

func moveUp(grid map[utils.Coords]string, trail map[utils.Coords]bool, pos utils.Coords) (newPos utils.Coords, ok bool) {
	up := pos.Up()
	if trail[pos] {
		return up, false
	} else if grid[pos] == "#" {
		return up, false
	} else if grid[pos] == "v" {
		return up, false
	}
	return up, true
}

func moveDown(grid map[utils.Coords]string, trail map[utils.Coords]bool, pos utils.Coords) (newPos utils.Coords, ok bool) {
	down := pos.Down()
	if trail[pos] {
		return down, false
	} else if grid[pos] == "#" {
		return down, false
	} else if grid[pos] == "^" {
		return down, false
	}
	return down, true
}

func cloneTrail(trail map[utils.Coords]bool) map[utils.Coords]bool {
	cloned := make(map[utils.Coords]bool)
	for k, v := range trail {
		cloned[k] = v
	}
	return cloned
}

func longestTrail(grid map[utils.Coords]string, trail map[utils.Coords]bool, pos, end utils.Coords) (map[utils.Coords]bool, bool) {
	clonedTrail := cloneTrail(trail)
	clonedTrail[pos] = true
	if pos.IsEqual(end) {
		return trail, true
	}

	trails := make([]map[utils.Coords]bool, 0)

	if grid[pos] == "." || grid[pos] == "^" {
		above, ok := moveUp(grid, trail, pos)
		if ok {
			aboveTrail, ok := longestTrail(grid, clonedTrail, above, end)
			if ok {
				trails = append(trails, aboveTrail)
			}
		}
	}

	if grid[pos] == "." || grid[pos] == ">" {
		right, ok := moveRight(grid, trail, pos)
		if ok {
			rightTrail, ok := longestTrail(grid, clonedTrail, right, end)

			if ok {
				trails = append(trails, rightTrail)
			}
		}
	}

	if grid[pos] == "." || grid[pos] == "v" {
		below, ok := moveDown(grid, trail, pos)
		if ok {
			belowTrail, ok := longestTrail(grid, clonedTrail, below, end)
			if ok {
				trails = append(trails, belowTrail)
			}
		}
	}

	if grid[pos] == "." || grid[pos] == "<" {
		left, ok := moveLeft(grid, trail, pos)
		if ok {
			leftTrail, ok := longestTrail(grid, clonedTrail, left, end)
			if ok {
				trails = append(trails, leftTrail)
			}
		}
	}

	if len(trails) == 0 {
		return nil, false
	}

	longestCount := 0
	var longest map[utils.Coords]bool
	for _, t := range trails {
		if len(t) > longestCount {
			longest = t
			longestCount = len(t)
		}
	}

	return longest, true
}

func debugTrail(grid map[utils.Coords]string, trail map[utils.Coords]bool, rows, cols int) {
	for i := 0; i < rows; i++ {
		line := ""
		for j := 0; j < cols; j++ {
			pos := utils.Coords{Row: i, Col: j}
			if trail[pos] {
				line += "O"
			} else {
				line += grid[pos]
			}
		}
		fmt.Println(line)
	}
	fmt.Println()
}
