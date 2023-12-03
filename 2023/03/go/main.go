package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

type coords struct {
	row int
	col int
}

type part struct {
	partNumber int
	coords     []coords
}

type symbol struct {
	symbol string
	coords coords
}

func main() {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)

	fileScanner.Split(bufio.ScanLines)

	partList := []part{}
	symbolList := []symbol{}
	currentPart := part{
		partNumber: 0,
		coords:     []coords{},
	}
	flushCurrentPart := func() {
		if len(currentPart.coords) > 0 {
			partList = append(partList, currentPart)
			currentPart = part{
				partNumber: 0,
				coords:     []coords{},
			}
		}
	}

	currentLineIdx := 0
	for fileScanner.Scan() {
		flushCurrentPart()

		var line = fileScanner.Text()
		for i, char := range line {
			letter := string(char)

			num, err := strconv.Atoi(letter)
			if err == nil {
				currentPart.partNumber = currentPart.partNumber*10 + num
				currentPart.coords = append(currentPart.coords, coords{
					row: currentLineIdx,
					col: i,
				})
			} else if letter == "." {
				flushCurrentPart()
				continue
			} else {
				flushCurrentPart()
				symbolList = append(symbolList, symbol{
					symbol: letter,
					coords: coords{
						row: currentLineIdx,
						col: i,
					},
				})
			}
		}

		currentLineIdx++
	}
	flushCurrentPart()

	partOneTotal := 0
	for _, part := range partList {
	partCoordLoop:
		for _, coord := range part.coords {
			for _, symbol := range symbolList {
				if symbol.coords.col >= coord.col-1 && symbol.coords.col <= coord.col+1 &&
					symbol.coords.row >= coord.row-1 && symbol.coords.row <= coord.row+1 {
					partOneTotal += part.partNumber
					break partCoordLoop
				}
			}
		}
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
}
