package main

import (
	"fmt"
	"strings"

	aoc_utils "peterweightman.com/aoc/utils"
)

func main() {
	puzzles := make([][]string, 0)
	curr := make([]string, 0)
	aoc_utils.IterateFileLines("../input.txt", func(line string) {
		if len(strings.TrimSpace(line)) == 0 {
			puzzles = append(puzzles, curr)
			curr = make([]string, 0)
		} else {
			curr = append(curr, line)
		}
	})
	puzzles = append(puzzles, curr)

	partTwoTotal := 0

	for _, puzzle := range puzzles {
		reflectionCol := findSmudgedReflectionCol(puzzle)
		reflectionRow := findSmudgedReflectionRow(puzzle)
		if reflectionCol != -1 {
			partTwoTotal += reflectionCol
		}
		if reflectionRow != -1 {
			partTwoTotal += 100 * reflectionRow
		}
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func findSmudgedReflectionCol(puzzle []string) int {
	for i := 1; i < len(puzzle[0]); i++ {
		imperfections := 0
	lineLoop:
		for _, line := range puzzle {
			for j := 0; j < i; j++ {
				aIdx := i + j
				bIdx := i - j - 1
				if bIdx < 0 || aIdx >= len(line) {
					break
				}
				if line[i+j] != line[i-j-1] {
					imperfections++
					if imperfections > 1 {
						break lineLoop
					}
				}
			}
		}
		if imperfections == 1 {
			return i
		}
	}
	return -1
}

func findSmudgedReflectionRow(puzzle []string) int {
	for i := 1; i < len(puzzle); i++ {
		imperfections := 0
	colLoop:
		for j := 0; j < len(puzzle[0]); j++ {
			for k := 0; k < i; k++ {
				aIdx := i + k
				bIdx := i - k - 1
				if bIdx < 0 || aIdx >= len(puzzle) {
					break
				}
				if puzzle[i+k][j] != puzzle[i-k-1][j] {
					imperfections++
					if imperfections > 1 {
						break colLoop
					}
				}
			}
		}
		if imperfections == 1 {
			return i
		}
	}
	return -1
}
