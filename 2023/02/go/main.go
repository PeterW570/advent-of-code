package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

func main() {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)

	fileScanner.Split(bufio.ScanLines)

	partOneTotal := 0
	partTwoTotal := 0

	for fileScanner.Scan() {
		var line = fileScanner.Text()
		var parsed = parseLine(line)
		if parsed.maxCounts["red"] <= 12 && parsed.maxCounts["green"] <= 13 && parsed.maxCounts["blue"] <= 14 {
			partOneTotal += parsed.gameNumber
		}
		partTwoTotal += (parsed.maxCounts["red"] * parsed.maxCounts["green"] * parsed.maxCounts["blue"])
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

type ParsedLine struct {
	gameNumber int
	maxCounts  map[string]int
}

func parseLine(line string) ParsedLine {
	var parsedLine ParsedLine

	gameSplits := strings.Split(line, ":")
	gameStr := gameSplits[0]
	shownCubesStr := gameSplits[1]

	gameNum, err := strconv.Atoi(gameStr[len("Game "):])
	if err != nil {
		panic(err)
	}
	parsedLine.gameNumber = gameNum
	parsedLine.maxCounts = make(map[string]int, 3)

	roundStrs := strings.Split(shownCubesStr, ";")
	for _, roundStr := range roundStrs {
		re := regexp.MustCompile(`(\d+) (\w+)`)
		matches := re.FindAllStringSubmatch(roundStr, -1)
		for _, match := range matches {
			count, err := strconv.Atoi(match[1])
			if err != nil {
				panic(err)
			}
			color := match[2]
			parsedLine.maxCounts[color] = max(parsedLine.maxCounts[color], count)
		}
	}

	return parsedLine
}
