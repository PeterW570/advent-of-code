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
	galaxies := make([]utils.Coords, 0)

	utils.IterateFileLines("../input.txt", func(line string) {
		gridLine := make([]cellType, 0)

		for _, char := range line {
			if char == '#' {
				galaxies = append(galaxies, utils.Coords{
					Row: len(grid),
					Col: len(gridLine),
				})
				gridLine = append(gridLine, galaxy)
			} else {
				gridLine = append(gridLine, empty)
			}
		}

		grid = append(grid, gridLine)
	})

	emptyRows, emptyCols := findEmptyRowsAndCols(grid)

	partTwoTotal := 0
	for i, startCoords := range galaxies {
		for j, endCoords := range galaxies {
			if j >= i {
				break
			}

			adjustedStart := adjustedCoords(startCoords, emptyRows, emptyCols)
			adjustedEnd := adjustedCoords(endCoords, emptyRows, emptyCols)

			partTwoTotal += adjustedStart.ManhattenDistanceTo(adjustedEnd)
		}
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
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

func findEmptyRowsAndCols(grid [][]cellType) ([]int, []int) {
	emptyRows := make([]int, 0)
	emptyCols := make([]int, 0)

	// check for empty rows
	for rowIdx, row := range grid {
		isEmpty := true
		for _, cell := range row {
			if cell != empty {
				isEmpty = false
				break
			}
		}

		if isEmpty {
			emptyRows = append(emptyRows, rowIdx)
		}
	}

	// check for empty cols
	for col := 0; col < len(grid[0]); col++ {
		isEmpty := true
		for _, row := range grid {
			if row[col] != empty {
				isEmpty = false
				break
			}
		}

		if isEmpty {
			emptyCols = append(emptyCols, col)
		}
	}

	return emptyRows, emptyCols
}

func adjustedCoords(coords utils.Coords, emptyRows, emptyCols []int) utils.Coords {
	addedRows := 0
	addedCols := 0

	for _, row := range emptyRows {
		if row < coords.Row {
			addedRows += 999_999
		}
	}

	for _, col := range emptyCols {
		if col < coords.Col {
			addedCols += 999_999
		}
	}

	return utils.Coords{
		Row: coords.Row + addedRows,
		Col: coords.Col + addedCols,
	}
}
