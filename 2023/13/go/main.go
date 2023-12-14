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

	partOneTotal := 0

	for _, puzzle := range puzzles {
		reflectionCol := findReflectionCol(puzzle)
		reflectionRow := findReflectionRow(puzzle)
		if reflectionCol != -1 {
			partOneTotal += reflectionCol
		}
		if reflectionRow != -1 {
			partOneTotal += 100 * reflectionRow
		}
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func findReflectionCol(puzzle []string) int {
	for i := 1; i < len(puzzle[0]); i++ {
		validReflection := true
	lineLoop:
		for _, line := range puzzle {
			for j := 0; j < i; j++ {
				aIdx := i + j
				bIdx := i - j - 1
				if bIdx < 0 || aIdx >= len(line) {
					break
				}
				if line[i+j] != line[i-j-1] {
					validReflection = false
					break lineLoop
				}
			}
		}
		if validReflection {
			return i
		}
	}
	return -1
}

func findReflectionRow(puzzle []string) int {
	for i := 1; i < len(puzzle); i++ {
		validReflection := true
	colLoop:
		for j := 0; j < len(puzzle[0]); j++ {
			for k := 0; k < i; k++ {
				aIdx := i + k
				bIdx := i - k - 1
				if bIdx < 0 || aIdx >= len(puzzle) {
					break
				}
				if puzzle[i+k][j] != puzzle[i-k-1][j] {
					validReflection = false
					break colLoop
				}
			}
		}
		if validReflection {
			return i
		}
	}
	return -1
}
