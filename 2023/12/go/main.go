package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/google/go-cmp/cmp"
	utils "peterweightman.com/aoc/utils"
)

type springType int

const (
	operational springType = iota
	damaged
	unknown
)

type conditionRecord struct {
	springMap             []springType
	possibleDamagedCounts []int
	damagedSpringSizes    []int
}

var doDebugLogging = false

func main() {
	partOneTotal := 0
	utils.IterateFileLines("../input.txt", func(line string) {
		record := parseLineToRecord(line)
		debugPrint(record.springMap)
		possibilities := findPossibilities(record.springMap, make([]springType, 0), record.possibleDamagedCounts, record.damagedSpringSizes, record.damagedSpringSizes)
		partOneTotal += possibilities
	})

	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func parseStrToSpringTypes(str string, arr *[]springType) {
	for _, char := range str {
		if char == '.' {
			*arr = append(*arr, operational)
		} else if char == '#' {
			*arr = append(*arr, damaged)
		} else {
			*arr = append(*arr, unknown)
		}
	}
}

func parseLineToRecord(line string) conditionRecord {
	record := conditionRecord{
		springMap:             make([]springType, 0),
		possibleDamagedCounts: make([]int, 0),
		damagedSpringSizes:    make([]int, 0),
	}

	splits := strings.Fields(line)
	parseStrToSpringTypes(splits[0], &record.springMap)

	for i, t := range record.springMap {
		count := 0
		if t != operational {
			count = 1
			for j := i + 1; j < len(record.springMap); j++ {
				if record.springMap[j] != operational {
					count++
				} else {
					break
				}
			}
		}
		record.possibleDamagedCounts = append(record.possibleDamagedCounts, count)
	}

	for _, char := range strings.Split(splits[1], ",") {
		num, _ := strconv.Atoi(char)
		record.damagedSpringSizes = append(record.damagedSpringSizes, num)
	}

	return record
}

func getSpringCounts(springMap []springType) []int {
	counts := make([]int, 0)
	for i := 0; i < len(springMap); i++ {
		t := springMap[i]
		if t == operational {
			continue
		}
		count := 1
		for j := i + 1; j < len(springMap); j++ {
			if springMap[j] == t {
				count++
			} else {
				break
			}
		}
		counts = append(counts, count)
		i += count - 1
	}
	return counts
}

func findPossibilities(input, prefix []springType, possibleCounts, remainingSizes, initialSizes []int) int {
	possibilities := 0

	remainingSize := 0
	for i := 1; i < len(remainingSizes); i++ {
		remainingSize += 1 + remainingSizes[i]
	}

	currSize := remainingSizes[0]
	soFar := make([]springType, 0)
	for i := 0; i < len(possibleCounts)-remainingSize-currSize+1; i++ {
		if possibleCounts[i] < currSize {
			soFar = append(soFar, operational)
			continue
		}
		if len(remainingSizes) == 1 {
			toCheck := make([]springType, len(prefix)+len(soFar))
			for i, t := range prefix {
				if input[i] == damaged {
					toCheck[i] = damaged
				} else {
					toCheck[i] = t
				}
			}
			offset := len(prefix)
			for i, t := range soFar {
				if input[offset+i] == damaged {
					toCheck[offset+i] = damaged
				} else {
					toCheck[offset+i] = t
				}
			}
			for j := i; j < len(possibleCounts); j++ {
				if (j - i) < currSize {
					toCheck = append(toCheck, damaged)
				} else if input[offset+j] == damaged {
					toCheck = append(toCheck, damaged)
				} else {
					toCheck = append(toCheck, operational)
				}
			}
			debugPrint(toCheck)
			springCounts := getSpringCounts(toCheck)
			if cmp.Equal(springCounts, initialSizes) {
				possibilities++
			}
		} else {
			newPrefix := append(prefix, soFar...)
			for j := 0; j < currSize; j++ {
				newPrefix = append(newPrefix, damaged)
			}
			newPrefix = append(newPrefix, operational)
			possibilities += findPossibilities(input, newPrefix, possibleCounts[(i+currSize+1):], remainingSizes[1:], initialSizes)
		}
		soFar = append(soFar, operational)
	}

	return possibilities
}

func debugPrint(springMap []springType) {
	if !doDebugLogging {
		return
	}
	for _, t := range springMap {
		switch t {
		case operational:
			fmt.Print(".")
		case damaged:
			fmt.Print("#")
		case unknown:
			fmt.Print("?")
		}
	}
	fmt.Println()
}
