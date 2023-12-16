package main

import (
	"fmt"

	utils "peterweightman.com/aoc/utils"
)

type cellType int

const (
	empty cellType = iota
	vertical
	horizontal
	forwardSlash
	backSlash
)

type pathEntry struct {
	coords utils.Coords
	dir    utils.Dir
}

func main() {
	grid := make([][]cellType, 0)
	utils.IterateFileLines("../input.txt", func(line string) {
		gridLine := make([]cellType, 0)
		for _, char := range line {
			if char == '|' {
				gridLine = append(gridLine, vertical)
			} else if char == '-' {
				gridLine = append(gridLine, horizontal)
			} else if char == '/' {
				gridLine = append(gridLine, forwardSlash)
			} else if char == '\\' {
				gridLine = append(gridLine, backSlash)
			} else {
				gridLine = append(gridLine, empty)
			}
		}
		grid = append(grid, gridLine)
	})

	visited := make([][]bool, len(grid))
	for i := 0; i < len(grid); i++ {
		visited[i] = make([]bool, len(grid[i]))
	}
	allPathEntries := make([]pathEntry, 0)

	traversePath(grid, &visited, &allPathEntries, utils.Coords{Row: 0, Col: 0}, utils.East)

	partOneTotal := 0
	for i := 0; i < len(visited); i++ {
		for j := 0; j < len(visited[i]); j++ {
			if visited[i][j] {
				partOneTotal++
			}
		}
	}
	// printVisited(visited)
	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func traversePath(grid [][]cellType, visited *[][]bool, allPathEntries *[]pathEntry, currPos utils.Coords, direction utils.Dir) {
	// check if out of bounds
	if !currPos.InBounds(0, len(grid)-1, 0, len(grid[0])-1) {
		return
	}
	// check if already visited by any path in current dir
	for _, entry := range *allPathEntries {
		if currPos.IsEqual(entry.coords) && entry.dir == direction {
			return
		}
	}
	// mark as visited
	(*visited)[currPos.Row][currPos.Col] = true
	*allPathEntries = append(*allPathEntries, pathEntry{coords: currPos, dir: direction})

	// printVisited(*visited)

	currPosType := grid[currPos.Row][currPos.Col]
	switch currPosType {
	case forwardSlash:
		var newDir utils.Dir
		switch direction {
		case utils.North:
			newDir = utils.East
		case utils.East:
			newDir = utils.North
		case utils.South:
			newDir = utils.West
		case utils.West:
			newDir = utils.South
		}
		traversePath(grid, visited, allPathEntries, currPos.MoveInDir(newDir), newDir)
	case backSlash:
		var newDir utils.Dir
		switch direction {
		case utils.North:
			newDir = utils.West
		case utils.East:
			newDir = utils.South
		case utils.South:
			newDir = utils.East
		case utils.West:
			newDir = utils.North
		}
		traversePath(grid, visited, allPathEntries, currPos.MoveInDir(newDir), newDir)
	case horizontal:
		if direction == utils.North || direction == utils.South {
			traversePath(grid, visited, allPathEntries, currPos.MoveInDir(utils.East), utils.East)
			traversePath(grid, visited, allPathEntries, currPos.MoveInDir(utils.West), utils.West)
		} else {
			traversePath(grid, visited, allPathEntries, currPos.MoveInDir(direction), direction)
		}
	case vertical:
		if direction == utils.North || direction == utils.South {
			traversePath(grid, visited, allPathEntries, currPos.MoveInDir(direction), direction)
		} else {
			traversePath(grid, visited, allPathEntries, currPos.MoveInDir(utils.North), utils.North)
			traversePath(grid, visited, allPathEntries, currPos.MoveInDir(utils.South), utils.South)
		}
	default:
		traversePath(grid, visited, allPathEntries, currPos.MoveInDir(direction), direction)
	}
}

func printVisited(visited [][]bool) {
	for i := 0; i < len(visited); i++ {
		for j := 0; j < len(visited[i]); j++ {
			if visited[i][j] {
				fmt.Print("#")
			} else {
				fmt.Print(".")
			}
		}
		fmt.Println()
	}
	fmt.Println()
}
