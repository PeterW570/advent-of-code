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

func setCacheAndReturn(key string, toReturn int) int {
	cache[key] = toReturn
	return toReturn
}

func findPossibilities(springMap string, sizes []int) int {
	key := springMap
	for _, size := range sizes {
		key += "," + strconv.Itoa(size)
	}

	if len(springMap) == 0 {
		if len(sizes) == 0 {
			return setCacheAndReturn(key, 1)
		} else {
			return setCacheAndReturn(key, 0)
		}
	} else if len(sizes) == 0 {
		if strings.Contains(springMap, "#") {
			return setCacheAndReturn(key, 0)
		} else {
			return setCacheAndReturn(key, 1)
		}
	}

	if cached, ok := cache[key]; ok {
		return cached
	}

	var possibilities int
	switch charToType[rune(springMap[0])] {
	case operational:
		possibilities = findPossibilities(springMap[1:], sizes)
	case damaged:
		currSize := sizes[0]
		if len(springMap) < currSize {
			possibilities = 0
		} else if strings.Contains(springMap[:currSize], ".") {
			possibilities = 0
		} else if len(springMap) > currSize && charToType[rune(springMap[currSize])] == damaged {
			possibilities = 0
		} else if len(springMap) == currSize {
			possibilities = findPossibilities(springMap[currSize:], sizes[1:])
		} else {
			possibilities = findPossibilities(springMap[currSize+1:], sizes[1:])
		}
	case unknown:
		possibilities = findPossibilities("."+springMap[1:], sizes) +
			findPossibilities("#"+springMap[1:], sizes)
	default:
		panic("Unrecognised char: " + string(springMap[0]))
	}

	return setCacheAndReturn(key, possibilities)
}
