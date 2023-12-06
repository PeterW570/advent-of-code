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
	timeStrs := strings.Fields(lines[0])[1:]
	distStrs := strings.Fields(lines[1])[1:]

	races := make([]Race, 0)
	for i := 0; i < len(timeStrs); i++ {
		time, err := strconv.Atoi(timeStrs[i])
		if err != nil {
			panic(err)
		}
		dist, err := strconv.Atoi(distStrs[i])
		if err != nil {
			panic(err)
		}
		races = append(races, Race{Time: time, Dist: dist})
	}

	waysToWin := make([]int, 0)
	for _, race := range races {
		raceWins := 0
		for secs := 0; secs < race.Time; secs++ {
			speed := secs
			raceDist := (race.Time - secs) * speed
			if raceDist > race.Dist {
				raceWins++
			}
		}
		waysToWin = append(waysToWin, raceWins)
	}

	partOneTotal := 1
	for _, wins := range waysToWin {
		partOneTotal *= wins
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
}
