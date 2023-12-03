package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

type Coords struct {
	Row int
	Col int
}

type Part struct {
	PartNumber int
	Coords     []Coords
}

type Symbol struct {
	Symbol string
	Coords Coords
}

func main() {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	var lines []string
	for fileScanner.Scan() {
		lines = append(lines, fileScanner.Text())
	}

	partList, symbolList := parseLines(lines)

	partOneTotal := solvePartOne(partList, symbolList)
	partTwoTotal := solvePartTwo(partList, symbolList)

	fmt.Printf("Part 1: %d\n", partOneTotal)
	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func solvePartOne(partList []Part, symbolList []Symbol) int {
	total := 0
	for _, part := range partList {
	partCoordLoop:
		for _, coord := range part.Coords {
			for _, symbol := range symbolList {
				if symbol.Coords.Col >= coord.Col-1 && symbol.Coords.Col <= coord.Col+1 &&
					symbol.Coords.Row >= coord.Row-1 && symbol.Coords.Row <= coord.Row+1 {
					total += part.PartNumber
					break partCoordLoop
				}
			}
		}
	}
	return total
}

func solvePartTwo(partList []Part, symbolList []Symbol) int {
	total := 0
	for _, symbol := range symbolList {
		if symbol.Symbol != "*" {
			continue
		}

		matchingPartNums := []int{}
		for _, part := range partList {
		partCoordLoop:
			for _, coord := range part.Coords {
				if coord.Col >= symbol.Coords.Col-1 && coord.Col <= symbol.Coords.Col+1 &&
					coord.Row >= symbol.Coords.Row-1 && coord.Row <= symbol.Coords.Row+1 {
					matchingPartNums = append(matchingPartNums, part.PartNumber)
					break partCoordLoop
				}
			}
		}

		if len(matchingPartNums) == 2 {
			total += matchingPartNums[0] * matchingPartNums[1]
		}
	}
	return total
}

func parseLines(lines []string) ([]Part, []Symbol) {
	partList := []Part{}
	symbolList := []Symbol{}
	currentPart := Part{
		PartNumber: 0,
		Coords:     []Coords{},
	}
	flushCurrentPart := func() {
		if len(currentPart.Coords) > 0 {
			partList = append(partList, currentPart)
			currentPart = Part{
				PartNumber: 0,
				Coords:     []Coords{},
			}
		}
	}

	currentLineIdx := 0
	for _, line := range lines {
		flushCurrentPart()

		for i, char := range line {
			letter := string(char)

			num, err := strconv.Atoi(letter)
			if err == nil {
				currentPart.PartNumber = currentPart.PartNumber*10 + num
				currentPart.Coords = append(currentPart.Coords, Coords{
					Row: currentLineIdx,
					Col: i,
				})
			} else if letter == "." {
				flushCurrentPart()
				continue
			} else {
				flushCurrentPart()
				symbolList = append(symbolList, Symbol{
					Symbol: letter,
					Coords: Coords{
						Row: currentLineIdx,
						Col: i,
					},
				})
			}
		}

		currentLineIdx++
	}
	flushCurrentPart()

	return (partList), (symbolList)
}
