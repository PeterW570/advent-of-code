package main

import (
	"fmt"
	"strconv"
	"strings"

	aoc_utils "peterweightman.com/aoc/utils"
)

type lens struct {
	label       string
	focalLength int
}

func main() {
	lightboxes := make(map[int][]lens)
	lines := aoc_utils.ParseFileToLines("../input.txt")
	joinedLines := strings.Join(lines, "")
	input := strings.Split(joinedLines, ",")
	for _, cmd := range input {
		if strings.HasSuffix(cmd, "-") {
			label := cmd[:len(cmd)-1]
			box := runHashAlgorithm(label)

			lenses := lightboxes[box]
			if lenses == nil {
				continue
			}
			matchIdx := findMatchingLensIdx(lenses, label)
			if matchIdx > -1 {
				lenses = append(lenses[:matchIdx], lenses[matchIdx+1:]...)
				lightboxes[box] = lenses
			}
		} else {
			splits := strings.Split(cmd, "=")
			label := splits[0]
			focalLength, _ := strconv.Atoi(splits[1])
			box := runHashAlgorithm(label)

			newLens := lens{label, focalLength}
			lenses := lightboxes[box]
			if lenses == nil {
				lightboxes[box] = []lens{newLens}
				continue
			} else {
				matchIdx := findMatchingLensIdx(lenses, label)
				if matchIdx > -1 {
					updated := append(lenses[:matchIdx], newLens)
					updated = append(updated, lenses[matchIdx+1:]...)
					lightboxes[box] = updated
				} else {
					lenses = append(lenses, newLens)
					lightboxes[box] = lenses
				}
			}
		}
	}

	partTwoTotal := 0

	for i, lenses := range lightboxes {
		for j, lens := range lenses {
			focusingPower := (1 + i) * (j + 1) * lens.focalLength
			partTwoTotal += focusingPower
		}
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func findMatchingLensIdx(lenses []lens, label string) int {
	matchIdx := -1
	for idx, lens := range lenses {
		if lens.label == label {
			matchIdx = idx
			break
		}
	}
	return matchIdx
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
