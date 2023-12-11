package main

import (
	"fmt"

	utils "peterweightman.com/aoc/utils"
)

type cellType int

const (
	empty cellType = iota
	galaxy
)

func main() {
	grid := make([][]cellType, 0)
	utils.IterateFileLines("../input.txt", func(line string) {
		gridLine := make([]cellType, 0)

		for _, char := range line {
			if char == '#' {
				gridLine = append(gridLine, galaxy)
			} else {
				gridLine = append(gridLine, empty)
			}
		}

		grid = append(grid, gridLine)
	})

	expandedGrid := expandSpace(grid)
	galaxies := make([]utils.Coords, 0)

	for i, row := range expandedGrid {
		for j, cell := range row {
			if cell == galaxy {
				galaxies = append(galaxies, utils.Coords{
					Row: i,
					Col: j,
				})
			}
		}
	}

	partOneTotal := 0
	for i, startCoords := range galaxies {
		for j, endCoords := range galaxies {
			if j >= i {
				break
			}

			partOneTotal += startCoords.ManhattenDistanceTo(endCoords)
		}
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
}

// func printGrid(grid [][]cellType) {
// 	for _, row := range grid {
// 		for _, cell := range row {
// 			if cell == galaxy {
// 				fmt.Print("#")
// 			} else {
// 				fmt.Print(".")
// 			}
// 		}
// 		fmt.Println()
// 	}
// }

func expandSpace(grid [][]cellType) [][]cellType {
	newGrid := make([][]cellType, 0)

	// check for empty rows
	for _, row := range grid {
		copied := make([]cellType, len(row))
		copy(copied, row)
		newGrid = append(newGrid, copied)

		isEmpty := true
		for _, cell := range row {
			if cell != empty {
				isEmpty = false
				break
			}
		}

		if isEmpty {
			newGrid = append(newGrid, make([]cellType, len(grid[0])))
		}
	}

	// check for empty cols
	addedCols := 0
	for col := 0; col < len(grid[0]); col++ {
		isEmpty := true
		for _, row := range grid {
			if row[col] != empty {
				isEmpty = false
				break
			}
		}

		if isEmpty {
			for row := 0; row < len(newGrid); row++ {
				newGrid[row] = append(newGrid[row][:(col+addedCols)], append([]cellType{empty}, newGrid[row][(col+addedCols):]...)...)
			}
			addedCols++
		}
	}

	return newGrid
}
