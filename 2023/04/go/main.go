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

	partTwoTotal := 0
	cardTotals := make(map[int]int)

	for fileScanner.Scan() {
		line := fileScanner.Text()
		card := parseLine(line)
		cardTotals[card.CardNumber] += 1
		copies := cardTotals[card.CardNumber]
		for i := 0; i < copies; i++ {
			for j := 1; j <= card.Points; j++ {
				cardTotals[card.CardNumber+j] += 1
			}
		}
		partTwoTotal += copies
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
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
		} else {
			points++
		}
	}
	card.Points = points

	return card
}
