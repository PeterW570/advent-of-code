package main

import (
	"bufio"
	"fmt"
	"os"
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

	var partTwoTotal = 0

	for fileScanner.Scan() {
		var first int
		var last int

		var line = fileScanner.Text()
		var toParse = line
		for {
			if len(toParse) == 0 {
				break
			}

			maybeParsed, err := strconv.Atoi(string(toParse[0]))
			if err == nil {
				first = maybeParsed
				break
			} else if strings.HasPrefix(toParse, "one") {
				first = 1
				break
			} else if strings.HasPrefix(toParse, "two") {
				first = 2
				break
			} else if strings.HasPrefix(toParse, "three") {
				first = 3
				break
			} else if strings.HasPrefix(toParse, "four") {
				first = 4
				break
			} else if strings.HasPrefix(toParse, "five") {
				first = 5
				break
			} else if strings.HasPrefix(toParse, "six") {
				first = 6
				break
			} else if strings.HasPrefix(toParse, "seven") {
				first = 7
				break
			} else if strings.HasPrefix(toParse, "eight") {
				first = 8
				break
			} else if strings.HasPrefix(toParse, "nine") {
				first = 9
				break
			} else {
				toParse = toParse[1:]
			}
		}

		toParse = line
		for {
			if len(toParse) == 0 {
				break
			}

			maybeParsed, err := strconv.Atoi(string(toParse[len(toParse)-1]))
			if err == nil {
				last = maybeParsed
				break
			} else if strings.HasSuffix(toParse, "one") {
				last = 1
				break
			} else if strings.HasSuffix(toParse, "two") {
				last = 2
				break
			} else if strings.HasSuffix(toParse, "three") {
				last = 3
				break
			} else if strings.HasSuffix(toParse, "four") {
				last = 4
				break
			} else if strings.HasSuffix(toParse, "five") {
				last = 5
				break
			} else if strings.HasSuffix(toParse, "six") {
				last = 6
				break
			} else if strings.HasSuffix(toParse, "seven") {
				last = 7
				break
			} else if strings.HasSuffix(toParse, "eight") {
				last = 8
				break
			} else if strings.HasSuffix(toParse, "nine") {
				last = 9
				break
			} else {
				toParse = toParse[:len(toParse)-1]
			}
		}

		partTwoTotal += (first * 10) + last
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}
