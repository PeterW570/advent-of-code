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
	time := parseNumFromLine(lines[0])
	dist := parseNumFromLine(lines[1])

	waysToWin := findWaysToWin(time, dist)
	fmt.Printf("Part 2: %d\n", waysToWin)
}

func parseNumFromLine(line string) int {
	num, err := strconv.Atoi(strings.Split(strings.ReplaceAll(line, " ", ""), ":")[1])
	if err != nil {
		panic(err)
	}
	return num
}

func findWaysToWin(time, record int) int {
	waysToWin := 0
	for secs := 0; secs < time; secs++ {
		speed := secs
		raceDist := (time - secs) * speed
		if raceDist > record {
			waysToWin++
		}
	}
	return waysToWin
}
