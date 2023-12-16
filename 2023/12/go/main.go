package main

import (
	"fmt"
	"strconv"
	"strings"

	utils "peterweightman.com/aoc/utils"
)

type springType int

const (
	operational springType = iota
	damaged
	unknown
)

var charToType = map[rune]springType{
	'.': operational,
	'#': damaged,
	'?': unknown,
}

type parsedInput struct {
	springMap string
	sizes     []int
}

var repeat = 5
var cache = make(map[string]int)

func main() {
	total := 0
	utils.IterateFileLines("../input.txt", func(line string) {
		parsed := parseLine(line)
		possibilities := findPossibilities(parsed.springMap, parsed.sizes)
		total += possibilities
	})

	fmt.Printf("Part 2: %d\n", total)
}

func parseLine(line string) parsedInput {
	splits := strings.Fields(line)

	expanded := ""
	for i := 0; i < repeat; i++ {
		if i > 0 {
			expanded += "?"
		}
		expanded += splits[0]
	}
	simplified := simplifyInput(expanded)

	sizes := make([]int, 0)
	for i := 0; i < repeat; i++ {
		for _, char := range strings.Split(splits[1], ",") {
			num, _ := strconv.Atoi(char)
			sizes = append(sizes, num)
		}
	}

	return parsedInput{
		springMap: simplified,
		sizes:     sizes,
	}
}

func simplifyInput(input string) string {
	simplified := input[:1]
	prev := rune(input[0])
	for _, char := range input[1:] {
		if charToType[char] != operational || charToType[prev] != operational {
			simplified += string(char)
		}
		prev = char
	}
	return simplified
}

func getSpringCounts(springMap string) []int {
	counts := make([]int, 0)
	for _, damaged := range strings.Fields(strings.ReplaceAll(springMap, ".", " ")) {
		counts = append(counts, len(damaged))
	}
	return counts
}

func cachedFindPossibilities(springMap string, sizes []int) int {
	cacheKey := springMap
	for _, size := range sizes {
		cacheKey += "," + strconv.Itoa(size)
	}

	if cached, ok := cache[cacheKey]; ok {
		return cached
	}

	possibilities := findPossibilities(springMap, sizes)

	cache[cacheKey] = possibilities
	return possibilities
}

func findPossibilities(springMap string, sizes []int) int {
	if len(springMap) == 0 {
		if len(sizes) == 0 {
			return 1
		} else {
			return 0
		}
	} else if len(sizes) == 0 {
		if strings.Contains(springMap, "#") {
			return 0
		} else {
			return 1
		}
	}

	switch charToType[rune(springMap[0])] {
	case operational:
		return cachedFindPossibilities(springMap[1:], sizes)
	case damaged:
		currSize := sizes[0]
		if len(springMap) < currSize {
			return 0
		} else if strings.Contains(springMap[:currSize], ".") {
			return 0
		} else if len(springMap) > currSize && charToType[rune(springMap[currSize])] == damaged {
			return 0
		} else if len(springMap) == currSize {
			return cachedFindPossibilities(springMap[currSize:], sizes[1:])
		} else {
			return cachedFindPossibilities(springMap[currSize+1:], sizes[1:])
		}
	case unknown:
		return cachedFindPossibilities("."+springMap[1:], sizes) +
			cachedFindPossibilities("#"+springMap[1:], sizes)
	default:
		panic("Unrecognised char: " + string(springMap[0]))
	}
}
