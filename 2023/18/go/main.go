package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	utils "peterweightman.com/aoc/utils"
)

type command struct {
	dir   utils.Dir
	count int
	color string
}

type cell int

const (
	empty cell = iota
	dug
)

func main() {
	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	commands := make([]command, 0)
	heighest := 0
	lowest := 0
	totalUp := 0
	totalDown := 0
	mostLeft := 0
	mostRight := 0
	totalRight := 0
	totalLeft := 0

	utils.IterateFileLines("../"+fileName, func(line string) {
		splits := strings.Fields(line)

		curr := command{}

		count, _ := strconv.Atoi(splits[1])
		curr.count = count

		switch splits[0] {
		case "U":
			curr.dir = utils.North
			totalUp += count
		case "D":
			curr.dir = utils.South
			totalDown += count
		case "L":
			curr.dir = utils.West
			totalLeft += count
		case "R":
			curr.dir = utils.East
			totalRight += count
		}

		netVertical := totalUp - totalDown
		if netVertical > heighest {
			heighest = netVertical
		} else if netVertical < lowest {
			lowest = netVertical
		}

		netHorizontal := totalRight - totalLeft
		if netHorizontal > mostRight {
			mostRight = netHorizontal
		} else if netHorizontal < mostLeft {
			mostLeft = netHorizontal
		}

		curr.color = splits[2][1:8]

		commands = append(commands, curr)
	})

	cols := mostRight - mostLeft + 1
	rows := heighest - lowest + 1

	grid := make([][]cell, rows)
	for i := 0; i < rows; i++ {
		grid[i] = make([]cell, cols)
	}

	start := utils.Coords{
		Row: heighest,
		Col: -1 * mostLeft,
	}
	currPos := start
	grid[currPos.Row][currPos.Col] = dug

	idx := 0
	coordToTrailIdx := map[string]int{
		currPos.ToString(): 0,
	}
	trailIdxToCoords := map[int]utils.Coords{
		0: currPos,
	}
	for _, cmd := range commands {
		for i := 0; i < cmd.count; i++ {
			currPos = currPos.MoveInDir(cmd.dir)
			grid[currPos.Row][currPos.Col] = dug
			coordToTrailIdx[currPos.ToString()] = idx
			trailIdxToCoords[idx] = currPos
			idx++
		}
	}

	totalTrailTiles := idx

	debugPath("before", grid, start)

	partOneTotal := 0
	for i, row := range grid {
		// Use the non-zero winding rule (https://en.wikipedia.org/wiki/Nonzero-rule)
		// https://www.reddit.com/r/adventofcode/comments/18eza5g/2023_day_10_animated_visualization/kcqwjon/

		crossingCount := 0
		for j := range row {
			tileCoords := utils.Coords{Row: i, Col: j}
			trailIdx, onTrail := coordToTrailIdx[tileCoords.ToString()]
			if onTrail {
				// if the tile is on the path and the cell below it is also on the path,
				// then we can check to if the cell below came before or after
				// if before -> increment, else -> decrement
				belowCoords := tileCoords.Down()
				before := trailIdxToCoords[(trailIdx-1+totalTrailTiles)%totalTrailTiles]
				after := trailIdxToCoords[(trailIdx+1)%totalTrailTiles]
				if belowCoords.IsEqual(before) {
					crossingCount++
				} else if belowCoords.IsEqual(after) {
					crossingCount--
				}
				partOneTotal++
			} else if crossingCount != 0 {
				// when the crossing count is non-zero, we are on the interior of the loop
				partOneTotal++
				grid[i][j] = dug
			}
		}
	}

	debugPath("after", grid, start)

	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func debugPath(fileName string, grid [][]cell, start utils.Coords) {
	f, err := os.Create(fileName + ".txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	for i, row := range grid {
		for j, cell := range row {
			if i == start.Row && j == start.Col {
				fmt.Fprint(f, "S")
			} else if cell == dug {
				fmt.Fprint(f, "#")
			} else {
				fmt.Fprint(f, ".")
			}
		}
		fmt.Fprintln(f)
	}
}
