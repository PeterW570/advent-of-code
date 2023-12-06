package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func parseFileToLines(fileName string) []string {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	lines := make([]string, 0)

	for fileScanner.Scan() {
		line := fileScanner.Text()
		lines = append(lines, line)
	}

	return lines
}

type Race struct {
	Time int
	Dist int
}

func main() {
	lines := parseFileToLines("../input.txt")
	time, err := strconv.Atoi(strings.Split(strings.ReplaceAll(lines[0], " ", ""), ":")[1])
	if err != nil {
		panic(err)
	}
	dist, err := strconv.Atoi(strings.Split(strings.ReplaceAll(lines[1], " ", ""), ":")[1])
	if err != nil {
		panic(err)
	}

	waysToWin := 0
	for secs := 0; secs < time; secs++ {
		speed := secs
		raceDist := (time - secs) * speed
		if raceDist > dist {
			waysToWin++
		}
	}

	fmt.Printf("Part 2: %d\n", waysToWin)
}
