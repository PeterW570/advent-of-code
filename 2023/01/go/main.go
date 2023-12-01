package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

var strToNum = map[string]int{
	"1":     1,
	"2":     2,
	"3":     3,
	"4":     4,
	"5":     5,
	"6":     6,
	"7":     7,
	"8":     8,
	"9":     9,
	"one":   1,
	"two":   2,
	"three": 3,
	"four":  4,
	"five":  5,
	"six":   6,
	"seven": 7,
	"eight": 8,
	"nine":  9,
}

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
		var line = fileScanner.Text()
		partTwoTotal += sumFromLine(line)
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func sumFromLine(line string) int {
	first := -1
	last := -1

	toParse := line
	for {
		if len(toParse) == 0 {
			break
		}

		parsed := -1
		for word, num := range strToNum {
			if strings.HasPrefix(toParse, word) {
				parsed = num
				break
			}
		}

		if parsed != -1 {
			if first == -1 {
				first = parsed
				last = parsed
			} else {
				last = parsed
			}
		}

		toParse = toParse[1:]
	}

	return (first * 10) + last
}
