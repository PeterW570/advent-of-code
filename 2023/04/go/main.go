package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Card struct {
	CardNumber int
	Points     int
}

func main() {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	partOneTotal := 0

	for fileScanner.Scan() {
		line := fileScanner.Text()
		card := parseLine(line)
		partOneTotal += card.Points
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func parseLine(line string) Card {
	var card Card

	splits := strings.Split(line, ":")
	num, err := strconv.Atoi(strings.Fields(splits[0])[1])
	if err != nil {
		panic(err)
	}
	card.CardNumber = num

	splits = strings.Split(splits[1], "|")
	winningNums := make(map[string]bool)
	for _, winningNumStr := range strings.Fields(splits[0]) {
		winningNums[winningNumStr] = true
	}

	points := 0
	for _, cardNumStr := range strings.Fields(splits[1]) {
		if !winningNums[cardNumStr] {
			continue
		} else if points == 0 {
			points = 1
		} else {
			points *= 2
		}
	}
	card.Points = points

	return card
}
