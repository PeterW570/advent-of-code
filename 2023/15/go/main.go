package main

import (
	"fmt"
	"strings"

	aoc_utils "peterweightman.com/aoc/utils"
)

func main() {
	partOneTotal := 0
	lines := aoc_utils.ParseFileToLines("../input.txt")
	input := strings.Join(lines, "")
	splits := strings.Split(input, ",")
	for _, split := range splits {
		partOneTotal += runHashAlgorithm(split)
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func runHashAlgorithm(str string) int {
	curr := 0

	for _, char := range str {
		// Determine the ASCII code for the current character of the string.
		code := int(char)

		// Increase the current value by the ASCII code you just determined.
		curr += code

		// Set the current value to itself multiplied by 17.
		curr *= 17

		// Set the current value to the remainder of dividing itself by 256.
		curr %= 256
	}

	return curr
}
