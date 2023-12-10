package main

import (
	"fmt"
	"math"

	utils "peterweightman.com/aoc/utils"
)

type tileType int

const (
	ground tileType = iota + 1
	start
	vertical   // connect north and south
	horizontal // connect east and west
	upRight    // connect south and east
	upLeft     // connect south and west
	downRight  // connect north and east
	downLeft   // connect north and west
)

var runeToTileType = map[rune]tileType{
	'.': ground,
	'S': start,
	'|': vertical,
	'-': horizontal,
	'F': upRight,
	'7': upLeft,
	'L': downRight,
	'J': downLeft,
}

type tile struct {
	tileType tileType
	coords   utils.Coords
}

func main() {
	var startTile tile
	tileGrid := make([][]tile, 0)
	utils.IterateFileLines("../input.txt", func(line string) {
		tileLine := make([]tile, 0)
		for _, char := range line {
			tileType := runeToTileType[char]
			currTile := tile{
				tileType: tileType,
				coords: utils.Coords{
					Row: len(tileGrid),
					Col: len(tileLine),
				},
			}
			if tileType == start {
				startTile = currTile
			}
			tileLine = append(tileLine, currTile)
		}
		tileGrid = append(tileGrid, tileLine)
	})

	currTile := getStartingNextTile(startTile, tileGrid)
	trail := []tile{startTile}
	for {
		prev := trail[len(trail)-1]
		trail = append(trail, currTile)

		connectedTo := currTile.connections(tileGrid)
		var nextTile tile
		for _, tile := range connectedTo {
			if !tile.coords.IsEqual(prev.coords) {
				nextTile = tile
				break
			}
		}

		if nextTile.coords.IsEqual(startTile.coords) {
			break
		}
		currTile = nextTile
	}

	partOneTotal := math.Ceil(float64(len(trail)) / 2)
	fmt.Printf("Part 1: %d\n", int(partOneTotal))

	partTwoTotal := 0
	for _, row := range tileGrid {
		// Use the non-zero winding rule (https://en.wikipedia.org/wiki/Nonzero-rule)
		// https://www.reddit.com/r/adventofcode/comments/18eza5g/2023_day_10_animated_visualization/kcqwjon/

		crossingCount := 0
		for _, tile := range row {
			trailIdx := -1
			for i, trailTile := range trail {
				if trailTile.coords.IsEqual(tile.coords) {
					trailIdx = i
					break
				}
			}
			if trailIdx > -1 {
				// if the tile is on the path and the cell below it is also on the path,
				// then we can check to if the cell below came before or after
				// if before -> increment, else -> decrement
				belowCoords := tile.coords.Down()
				before := trail[(trailIdx-1+len(trail))%len(trail)]
				after := trail[(trailIdx+1)%len(trail)]
				if belowCoords.IsEqual(before.coords) {
					crossingCount++
				} else if belowCoords.IsEqual(after.coords) {
					crossingCount--
				}
			} else if crossingCount != 0 {
				// when the crossing count is non-zero, we are on the interior of the loop
				partTwoTotal++
			}
		}
	}
	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func getStartingNextTile(start tile, tileGrid [][]tile) tile {
	aboveCoords := start.coords.Up()
	if aboveCoords.InBounds(0, len(tileGrid)-1, 0, len(tileGrid[0])-1) {
		above := tileGrid[aboveCoords.Row][aboveCoords.Col]
		if start.isConnectedTo(above) {
			return above
		}
	}
	belowCoords := start.coords.Down()
	if belowCoords.InBounds(0, len(tileGrid)-1, 0, len(tileGrid[0])-1) {
		below := tileGrid[belowCoords.Row][belowCoords.Col]
		if start.isConnectedTo(below) {
			return below
		}
	}
	rightCoords := start.coords.Right()
	if rightCoords.InBounds(0, len(tileGrid)-1, 0, len(tileGrid[0])-1) {
		right := tileGrid[rightCoords.Row][rightCoords.Col]
		if start.isConnectedTo(right) {
			return right
		}
	}
	left := start.coords.Left()
	if left.InBounds(0, len(tileGrid)-1, 0, len(tileGrid[0])-1) {
		left := tileGrid[left.Row][left.Col]
		if start.isConnectedTo(left) {
			return left
		}
	}
	panic("no tiles after start")
}

func (t tile) connectsDown() bool {
	return t.tileType == start || t.tileType == vertical || t.tileType == upRight || t.tileType == upLeft
}

func (t tile) connectsUp() bool {
	return t.tileType == start || t.tileType == vertical || t.tileType == downRight || t.tileType == downLeft
}

func (t tile) connectsLeft() bool {
	return t.tileType == start || t.tileType == horizontal || t.tileType == upLeft || t.tileType == downLeft
}

func (t tile) connectsRight() bool {
	return t.tileType == start || t.tileType == horizontal || t.tileType == upRight || t.tileType == downRight
}

func (t tile) isConnectedTo(maybeConnectedTo tile) bool {
	sameCol := t.coords.Col == maybeConnectedTo.coords.Col
	sameRow := t.coords.Row == maybeConnectedTo.coords.Row

	if sameCol && t.coords.Row == maybeConnectedTo.coords.Row-1 {
		return t.connectsDown() && maybeConnectedTo.connectsUp()
	} else if sameCol && t.coords.Row == maybeConnectedTo.coords.Row+1 {
		return t.connectsUp() && maybeConnectedTo.connectsDown()
	} else if sameRow && t.coords.Col == maybeConnectedTo.coords.Col-1 {
		return t.connectsRight() && maybeConnectedTo.connectsLeft()
	} else if sameRow && t.coords.Col == maybeConnectedTo.coords.Col+1 {
		return t.connectsLeft() && maybeConnectedTo.connectsRight()
	}

	return false
}

func (t tile) connections(tileGrid [][]tile) []tile {
	toReturn := make([]tile, 0)

	hasAbove := t.coords.Row > 0
	hasBelow := t.coords.Row < len(tileGrid)-1
	hasLeft := t.coords.Col > 0
	hasRight := t.coords.Col < len(tileGrid[0])-1

	if (t.tileType == vertical || t.tileType == upLeft || t.tileType == upRight) && hasBelow {
		toReturn = append(toReturn, tileGrid[t.coords.Row+1][t.coords.Col])
	}
	if (t.tileType == vertical || t.tileType == downLeft || t.tileType == downRight) && hasAbove {
		toReturn = append(toReturn, tileGrid[t.coords.Row-1][t.coords.Col])
	}
	if (t.tileType == horizontal || t.tileType == upLeft || t.tileType == downLeft) && hasLeft {
		toReturn = append(toReturn, tileGrid[t.coords.Row][t.coords.Col-1])
	}
	if (t.tileType == horizontal || t.tileType == upRight || t.tileType == downRight) && hasRight {
		toReturn = append(toReturn, tileGrid[t.coords.Row][t.coords.Col+1])
	}

	return toReturn
}
