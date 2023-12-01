package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func main() {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)

	fileScanner.Split(bufio.ScanLines)

	var partOneTotal = 0

	for fileScanner.Scan() {
		var line = fileScanner.Text()
		var lineDigits []int

		for _, char := range line {
			maybeParsed, err := strconv.Atoi(string(char))
			if err == nil {
				lineDigits = append(lineDigits, maybeParsed)
			}
		}

		var first = lineDigits[0]
		var last = lineDigits[len(lineDigits)-1]
		partOneTotal += (first * 10) + last
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
}
