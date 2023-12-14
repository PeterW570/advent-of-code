package main

import (
	"fmt"

	aoc_utils "peterweightman.com/aoc/utils"
)

type cellType int

const (
	empty cellType = iota
	wall
	rock
)

var debugging = false

func main() {
	grid := make([][]cellType, 0)
	aoc_utils.IterateFileLines("../input.txt", func(line string) {
		gridLine := make([]cellType, 0)

		for _, char := range line {
			if char == '#' {
				gridLine = append(gridLine, wall)
			} else if char == 'O' {
				gridLine = append(gridLine, rock)
			} else {
				gridLine = append(gridLine, empty)
			}
		}

		grid = append(grid, gridLine)
	})

	tilted := tiltUp(grid)
	partOneTotal := calculateLoad(tilted)

	debugPrint(grid)
	if debugging {
		fmt.Println()
	}
	debugPrint(tilted)
	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func tiltUp(grid [][]cellType) [][]cellType {
	newGrid := make([][]cellType, len(grid))
	cols := len(grid[0])
	for col := 0; col < cols; col++ {
		for i, row := range grid {
			if col == 0 {
				newGrid[i] = make([]cellType, cols)
			}

			if row[col] == rock {
				if i == 0 {
					newGrid[i][col] = rock
				} else {
					for j := i - 1; j >= 0; j-- {
						if newGrid[j][col] != empty {
							newGrid[j+1][col] = rock
							break
						} else if j == 0 {
							newGrid[j][col] = rock
						} else {
							newGrid[j+1][col] = empty
						}
					}
				}
			} else {
				newGrid[i][col] = row[col]
			}
		}
	}
	return newGrid
}

func calculateLoad(grid [][]cellType) int {
	total := 0
	for i, row := range grid {
		for _, cell := range row {
			if cell == rock {
				total += len(grid) - i
			}
		}
	}
	return total
}

func debugPrint(grid [][]cellType) {
	if !debugging {
		return
	}
	for _, row := range grid {
		for _, cell := range row {
			if cell == rock {
				fmt.Print("O")
			} else if cell == wall {
				fmt.Print("#")
			} else {
				fmt.Print(".")
			}
		}
		fmt.Println()
	}
}
