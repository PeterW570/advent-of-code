package main

import (
	"flag"
	"fmt"
	"log"
	"os"
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

	initialGridRowCount := 0
	initialGridColCount := 0
	var startCoord utils.Coords

	grid := make(map[utils.Coords]cellState)

	utils.IterateFileLines("../"+fileName, func(line string) {
		initialGridColCount = len(line)

		for i, char := range line {
			coords := utils.Coords{Row: initialGridRowCount, Col: i}
			cellStr := string(char)
			if cellStr == "S" {
				grid[coords] = possibleStep
				startCoord = coords
			} else if cellStr == "#" {
				grid[coords] = wall
			} else {
				grid[coords] = empty
			}
		}

		initialGridRowCount++
	})

	stepTarget := 26501365
	edge := initialGridColCount - 1 - startCoord.Col
	calculatedSteps := make([]int, 3)
	currStep := 0
	currScale := 1
	for {
		currStep++
		grid = takeSteps(grid, initialGridRowCount, initialGridColCount, currScale)
		if currStep == edge {
			calculatedSteps[0] = countPossibleSteps(grid)
			currScale++
		} else if currStep == edge+initialGridColCount {
			calculatedSteps[1] = countPossibleSteps(grid)
			currScale++
		} else if currStep == edge+initialGridColCount*2 {
			calculatedSteps[2] = countPossibleSteps(grid)
			break
		}
	}

	if initialGridColCount != initialGridRowCount {
		panic("Expected square grid")
	}
	gridSize := initialGridColCount

	// https://en.wikipedia.org/wiki/Polynomial_regression
	a := (calculatedSteps[2] + calculatedSteps[0] - 2*calculatedSteps[1]) / 2
	b := calculatedSteps[1] - calculatedSteps[0] - a
	c := calculatedSteps[0]
	x := (stepTarget - edge) / gridSize
	partTwoTotal := a*x*x + b*x + c

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func countPossibleSteps(grid map[utils.Coords]cellState) int {
	total := 0

	for _, cell := range grid {
		if cell == possibleStep {
			total++
		}
	}

	return total
}

func checkStateInInfiniteGrid(coords utils.Coords, grid map[utils.Coords]cellState, rowCount, colCount int) cellState {
	state, ok := grid[coords]
	if ok {
		return state
	}

	rowWithinBounds := coords.Row % rowCount
	for {
		if rowWithinBounds < 0 {
			rowWithinBounds += rowCount
		} else {
			break
		}
	}

	colWithinBounds := coords.Col % colCount
	for {
		if colWithinBounds < 0 {
			colWithinBounds += colCount
		} else {
			break
		}
	}

	state = grid[utils.Coords{
		Row: rowWithinBounds,
		Col: colWithinBounds,
	}]

	if state == wall {
		return wall
	} else {
		return empty
	}
}

func takeSteps(grid map[utils.Coords]cellState, rows, cols, scale int) map[utils.Coords]cellState {
	updatedGrid := make(map[utils.Coords]cellState)

	for i := -1 * (scale - 1) * rows; i < rows*scale; i++ {
		for j := -1 * (scale - 1) * cols; j < cols*scale; j++ {
			currPos := utils.Coords{Row: i, Col: j}
			currentState := checkStateInInfiniteGrid(currPos, grid, rows, cols)
			_, cellUpdated := updatedGrid[currPos]

			if currentState == wall {
				updatedGrid[currPos] = wall
			} else if currentState == possibleStep {
				possibleNext := []utils.Coords{
					currPos.Up(),
					currPos.Down(),
					currPos.Left(),
					currPos.Right(),
				}
				for _, coords := range possibleNext {
					if checkStateInInfiniteGrid(coords, grid, rows, cols) == wall {
						continue
					}
					updatedGrid[coords] = possibleStep
				}
				if !cellUpdated {
					updatedGrid[currPos] = empty
				}
			} else if !cellUpdated {
				updatedGrid[currPos] = empty
			}
		}
	}

	return updatedGrid
}

//lint:ignore U1000 debugging helper fn
func debugCurrentState(grid map[utils.Coords]cellState, fromRow, toRow, fromCol, toCol int) {
	f, err := os.Create("debug-grid.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	for i := fromRow; i < toRow; i++ {
		rowToPrint := make([]string, toCol-fromCol)
		for j := fromCol; j < toCol; j++ {
			shiftedCol := j - fromCol
			cell := grid[utils.Coords{Row: i, Col: j}]
			switch cell {
			case possibleStep:
				rowToPrint[shiftedCol] = "O"
			case wall:
				rowToPrint[shiftedCol] = "#"
			default:
				rowToPrint[shiftedCol] = "."
			}
		}
		_, err := f.WriteString(strings.Join(rowToPrint, "") + "\n")
		if err != nil {
			log.Fatal(err)
		}
	}
}
