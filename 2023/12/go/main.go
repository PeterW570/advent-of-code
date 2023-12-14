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
	possibleDamagedCounts [][]int
	damagedSpringSizes    []int
}

var doDebugLogging = false
var repeat = 5

var cache = make(map[string]int)

func main() {
	partTwoTotal := 0
	checked := 0
	utils.IterateFileLines("../input.txt", func(line string) {
		clear(cache)
		record := parseLineToRecord(line)
		debugPrint(record.springMap)
		possibilities := findPossibilities(record.springMap, make([]springType, 0), record.possibleDamagedCounts, record.damagedSpringSizes, record.damagedSpringSizes)
		partTwoTotal += possibilities
		checked++
		fmt.Println(checked)
	})

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func parseStrToSpringTypes(str string, arr *[]springType) {
	for i := 0; i < repeat; i++ {
		if i > 0 {
			*arr = append(*arr, unknown)
		}
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
}

func parseLineToRecord(line string) conditionRecord {
	record := conditionRecord{
		springMap:             make([]springType, 0),
		possibleDamagedCounts: make([][]int, 0),
		damagedSpringSizes:    make([]int, 0),
	}

	splits := strings.Fields(line)
	parseStrToSpringTypes(splits[0], &record.springMap)

	record.possibleDamagedCounts = getPossibleDamagedCounts(record.springMap)

	for i := 0; i < repeat; i++ {
		for _, char := range strings.Split(splits[1], ",") {
			num, _ := strconv.Atoi(char)
			record.damagedSpringSizes = append(record.damagedSpringSizes, num)
		}
	}

	return record
}

func getPossibleDamagedCounts(input []springType) [][]int {
	counts := make([][]int, 0)
	for i, t := range input {
		possibilities := make([]int, 0)
		if t != operational && (i == 0 || input[i-1] != damaged) {
			possibilities = append(possibilities, 1)
			for j := i + 1; j < len(input); j++ {
				if input[j] == damaged {
					possibilities[len(possibilities)-1]++
				} else if input[j] == unknown {
					possibilities = append(possibilities, possibilities[len(possibilities)-1]+1)
				} else {
					break
				}
			}
		}
		counts = append(counts, possibilities)
	}
	return counts
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

func findPossibilities(input, prefix []springType, possibleCounts [][]int, remainingSizes, initialSizes []int) int {
	possibilities := 0
	cacheKey := getCacheKey(prefix, possibleCounts, remainingSizes)
	if cache[cacheKey] > 0 {
		return cache[cacheKey]
	}

	remainingSize := 0
	for i := 1; i < len(remainingSizes); i++ {
		remainingSize += 1 + remainingSizes[i]
	}

	currSize := remainingSizes[0]
	soFar := make([]springType, 0)
	hasSeenDamaged := false
	for i := 0; i < len(possibleCounts)-remainingSize-currSize+1; i++ {
		if input[i+len(prefix)] == damaged {
			hasSeenDamaged = true
		} else if hasSeenDamaged {
			break
		}

		canPlaceCurr := false
		for _, count := range possibleCounts[i] {
			if count == currSize {
				canPlaceCurr = true
				break
			}
		}
		if !canPlaceCurr {
			soFar = append(soFar, operational)
			continue
		}
		if len(remainingSizes) == 1 {
			toCheck := append(prefix, soFar...)
			for j := i; j < len(possibleCounts); j++ {
				if (j - i) < currSize {
					toCheck = append(toCheck, damaged)
				} else {
					toCheck = append(toCheck, operational)
				}
			}
			if validate(input, toCheck, initialSizes, true) {
				possibilities++
			}
		} else {
			newPrefix := append(prefix, soFar...)
			for j := 0; j < currSize; j++ {
				newPrefix = append(newPrefix, damaged)
			}
			newPrefix = append(newPrefix, operational)
			if validate(input[:len(newPrefix)], newPrefix, initialSizes[:len(initialSizes)-len(remainingSizes)+1], false) {
				possibilities += findPossibilities(input, newPrefix, possibleCounts[(i+currSize+1):], remainingSizes[1:], initialSizes)
			}
		}
		soFar = append(soFar, operational)
	}

	cache[cacheKey] = possibilities
	return possibilities
}

func validate(input, toMergeAndCheck []springType, expected []int, debug bool) bool {
	merged := make([]springType, len(toMergeAndCheck))
	for i, t := range toMergeAndCheck {
		if input[i] == damaged {
			merged[i] = damaged
		} else {
			merged[i] = t
		}
	}

	if debug {
		debugPrint(merged)
	}
	springCounts := getSpringCounts(merged)
	return cmp.Equal(springCounts, expected)
}

func getCacheKey(prefix []springType, possibleCounts [][]int, remainingSizes []int) string {
	prefixStringCounts := getSpringCounts(prefix)
	prefixStr := make([]string, len(prefixStringCounts))
	for i, v := range prefixStringCounts {
		prefixStr[i] = strconv.Itoa(int(v))
	}

	return fmt.Sprintf("%s;%d;%d", strings.Join(prefixStr, ","), len(possibleCounts), len(remainingSizes))
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
