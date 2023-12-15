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
		tilted = tilt(tilted, "N")
		tilted = tilt(tilted, "W")
		tilted = tilt(tilted, "S")
		tilted = tilt(tilted, "E")
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

func tilt(grid [][]cellType, dir string) [][]cellType {
	newGrid := make([][]cellType, len(grid))
	cols := len(grid[0])
	rows := len(grid)

	vertical := dir == "N" || dir == "S"
	inlineIterationDiff := 1
	if dir == "E" || dir == "S" {
		inlineIterationDiff = -1
	}

	var inlineAxisStart, inlineAxisEnd, inlineAxisMax, crossAxisEnd int
	if dir == "N" {
		inlineAxisStart = 0
		inlineAxisEnd = rows - 1
		crossAxisEnd = cols
	} else if dir == "E" {
		inlineAxisStart = cols - 1
		inlineAxisEnd = 0
		crossAxisEnd = rows
	} else if dir == "S" {
		inlineAxisStart = rows - 1
		inlineAxisEnd = 0
		crossAxisEnd = cols
	} else if dir == "W" {
		inlineAxisStart = 0
		inlineAxisEnd = cols - 1
		crossAxisEnd = rows
	} else {
		panic("Invalid direction")
	}

	if vertical {
		inlineAxisMax = rows - 1
	} else {
		inlineAxisMax = cols - 1
	}

	for i := inlineAxisStart; i >= 0 && i <= inlineAxisMax; i += inlineIterationDiff {
		for j := 0; j < crossAxisEnd; j++ {
			var row, col int
			if vertical {
				row = i
				col = j
			} else {
				row = j
				col = i
			}

			if vertical && col == 0 {
				newGrid[row] = make([]cellType, cols)
			} else if !vertical && i == inlineAxisStart {
				newGrid[row] = make([]cellType, cols)
			}

			cell := grid[row][col]

			if cell == rock {
				if i == inlineAxisStart {
					newGrid[row][col] = rock
				} else {
					var inlineMin, inlineMax int
					if inlineAxisStart < inlineAxisEnd {
						inlineMin = inlineAxisStart
						inlineMax = inlineAxisEnd
					} else {
						inlineMin = inlineAxisEnd
						inlineMax = inlineAxisStart
					}
					for k := i - inlineIterationDiff; k >= inlineMin && k <= inlineMax; k -= inlineIterationDiff {
						var newRow, newCol int
						if vertical {
							newRow = k
							newCol = j
						} else {
							newRow = j
							newCol = k
						}
						newCell := newGrid[newRow][newCol]

						if newCell != empty {
							if vertical {
								newGrid[newRow+inlineIterationDiff][newCol] = rock
							} else {
								newGrid[newRow][newCol+inlineIterationDiff] = rock
							}
							break
						} else if k == inlineAxisStart {
							newGrid[newRow][newCol] = rock
						} else {
							if vertical {
								newGrid[newRow+inlineIterationDiff][newCol] = empty
							} else {
								newGrid[newRow][newCol+inlineIterationDiff] = empty
							}
						}
					}
				}
			} else {
				newGrid[row][col] = cell
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
