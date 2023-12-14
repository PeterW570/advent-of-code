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

type history struct {
	load  int
	state string
}

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

	cycles := 1000000000
	tilted := grid
	loadHistory := make([]history, 0)
	var partTwoTotal int

	for i := 0; i < cycles; i++ {
		tilted = tiltNorth(tilted)
		tilted = tiltWest(tilted)
		tilted = tiltSouth(tilted)
		tilted = tiltEast(tilted)
		load := calculateLoad(tilted)

		state := gridToString(tilted)
		matchIdx := -1
		for j, h := range loadHistory {
			if h.state == state {
				matchIdx = j
				break
			}
		}
		if matchIdx > -1 {
			remaining := cycles - i - 1
			cycleSize := i - matchIdx
			partTwoTotal = loadHistory[matchIdx+(remaining%cycleSize)].load
			break
		}
		loadHistory = append(loadHistory, history{
			load:  load,
			state: gridToString(tilted),
		})
		if debugging {
			fmt.Println(gridToString(tilted))
			fmt.Println()
		}
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func tiltNorth(grid [][]cellType) [][]cellType {
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

func tiltSouth(grid [][]cellType) [][]cellType {
	newGrid := make([][]cellType, len(grid))
	cols := len(grid[0])
	for col := 0; col < cols; col++ {
		for i := cols - 1; i >= 0; i-- {
			if col == 0 {
				newGrid[i] = make([]cellType, cols)
			}
			row := grid[i]
			if row[col] == rock {
				if i == cols-1 {
					newGrid[i][col] = rock
				} else {
					for j := i + 1; j < cols; j++ {
						if newGrid[j][col] != empty {
							newGrid[j-1][col] = rock
							break
						} else if j == cols-1 {
							newGrid[j][col] = rock
						} else {
							newGrid[j-1][col] = empty
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

func tiltEast(grid [][]cellType) [][]cellType {
	newGrid := make([][]cellType, len(grid))
	cols := len(grid[0])
	for i, row := range grid {
		newGrid[i] = make([]cellType, cols)

		for j := cols - 1; j >= 0; j-- {
			if row[j] == rock {
				if j == cols-1 {
					newGrid[i][j] = rock
				} else {
					for k := j + 1; k < cols; k++ {
						if newGrid[i][k] != empty {
							newGrid[i][k-1] = rock
							break
						} else if k == cols-1 {
							newGrid[i][k] = rock
						} else {
							newGrid[i][k-1] = empty
						}
					}
				}
			} else {
				newGrid[i][j] = row[j]
			}
		}
	}
	return newGrid
}

func tiltWest(grid [][]cellType) [][]cellType {
	newGrid := make([][]cellType, len(grid))
	cols := len(grid[0])
	for i, row := range grid {
		newGrid[i] = make([]cellType, cols)

		for j := 0; j < cols; j++ {
			if row[j] == rock {
				if j == 0 {
					newGrid[i][j] = rock
				} else {
					for k := j - 1; k >= 0; k-- {
						if newGrid[i][k] != empty {
							newGrid[i][k+1] = rock
							break
						} else if k == 0 {
							newGrid[i][k] = rock
						} else {
							newGrid[i][k+1] = empty
						}
					}
				}
			} else {
				newGrid[i][j] = row[j]
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

func gridToString(grid [][]cellType) string {
	str := ""
	for _, row := range grid {
		for _, cell := range row {
			if cell == rock {
				str += "O"
			} else if cell == wall {
				str += "#"
			} else {
				str += "."
			}
		}
		str += "\n"
	}
	return str
}
