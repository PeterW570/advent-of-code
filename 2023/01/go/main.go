package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

var wordToNum = map[string]int{
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
		var first = -1
		var last = -1

		var line = fileScanner.Text()
		var toParse = line
		for {
			if len(toParse) == 0 {
				break
			}

			var parsed = -1

			maybeParsed, err := strconv.Atoi(string(toParse[0]))
			if err == nil {
				parsed = maybeParsed
			} else {
				for word, num := range wordToNum {
					if strings.HasPrefix(toParse, word) {
						parsed = num
						break
					}
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

		partTwoTotal += (first * 10) + last
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}
