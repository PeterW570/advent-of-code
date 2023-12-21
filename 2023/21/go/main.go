package main

import (
	"flag"
	"fmt"
	"strings"

	utils "peterweightman.com/aoc/utils"
)

type cellState int

const (
	empty cellState = iota
	wall
	possibleStep
)

func main() {
	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	rowCount := 0
	colCount := 0

	grid := make(map[int]map[int]cellState)

	utils.IterateFileLines("../"+fileName, func(line string) {
		row := make(map[int]cellState)
		colCount = len(line)

		for i, char := range line {
			cellStr := string(char)
			if cellStr == "S" {
				row[i] = possibleStep
			} else if cellStr == "#" {
				row[i] = wall
			} else {
				row[i] = empty
			}
		}

		grid[rowCount] = row
		rowCount++
	})

	// debugCurrentState(grid, rowCount, colCount)

	for i := 0; i < 64; i++ {
		grid = takeSteps(grid, rowCount, colCount)
		// debugCurrentState(grid, rowCount, colCount)
	}

	partOneTotal := countPossibleSteps(grid)
	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func countPossibleSteps(grid map[int]map[int]cellState) int {
	total := 0

	for _, row := range grid {
		for _, cell := range row {
			if cell == possibleStep {
				total++
			}
		}
	}

	return total
}

func takeSteps(grid map[int]map[int]cellState, rows, cols int) map[int]map[int]cellState {
	updatedGrid := make(map[int]map[int]cellState)

	for i := 0; i < rows; i++ {
		updatedGrid[i] = make(map[int]cellState)
	}

	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			currPos := utils.Coords{Row: i, Col: j}
			currentState := grid[i][j]
			_, cellUpdated := updatedGrid[i][j]

			if currentState == wall {
				updatedGrid[i][j] = wall
			} else if currentState == possibleStep {
				possibleNext := []utils.Coords{
					currPos.Up(),
					currPos.Down(),
					currPos.Left(),
					currPos.Right(),
				}
				for _, coords := range possibleNext {
					if !coords.InBounds(0, rows-1, 0, cols-1) {
						continue
					} else if grid[coords.Row][coords.Col] == wall {
						continue
					}
					updatedGrid[coords.Row][coords.Col] = possibleStep
				}
				if !cellUpdated {
					updatedGrid[i][j] = empty
				}
			} else if !cellUpdated {
				updatedGrid[i][j] = empty
			}
		}
	}

	return updatedGrid
}

//lint:ignore U1000 debugging helper fn
func debugCurrentState(grid map[int]map[int]cellState, rows, cols int) {
	toPrint := make([]string, rows)
	for i, row := range grid {
		rowToPrint := make([]string, cols)
		for j, cell := range row {
			switch cell {
			case possibleStep:
				rowToPrint[j] = "O"
			case wall:
				rowToPrint[j] = "#"
			default:
				rowToPrint[j] = "."
			}
		}
		toPrint[i] = strings.Join(rowToPrint, "")
	}
	fmt.Println(strings.Join(toPrint, "\n"))
	fmt.Println()
}
