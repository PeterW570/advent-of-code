package main

import (
	"flag"
	"fmt"
	"time"

	utils "peterweightman.com/aoc/utils"
)

type day struct {
	rows, cols    int
	start, end    utils.Coords
	grid          map[utils.Coords]string
	collapsedGrid map[utils.Coords]map[utils.Coords]int
}

func main() {
	start_time := time.Now()

	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	d := day{
		rows:          0,
		grid:          make(map[utils.Coords]string),
		collapsedGrid: make(map[utils.Coords]map[utils.Coords]int),
	}

	utils.IterateFileLines("../"+fileName, func(line string) {
		for col, char := range line {
			d.grid[utils.Coords{Row: d.rows, Col: col}] = string(char)
		}
		d.rows++
		d.cols = len(line)
	})

	d.start = utils.Coords{Row: 0, Col: 1}
	d.end = utils.Coords{Row: d.rows - 1, Col: d.cols - 2}

	d.collapsedGrid[d.start] = make(map[utils.Coords]int)
	d.collapseGrid(d.start.Down(), d.start, d.start)

	partTwoTotal, ok := d.solvePartTwo(0, d.start, make(map[utils.Coords]bool))
	if !ok {
		panic("Couldn't find a path to the end")
	}
	fmt.Printf("Part 2: %d (%s)\n", partTwoTotal, time.Since(start_time))
}

func (d day) canMoveTo(pos, prev utils.Coords) bool {
	if pos.IsEqual(prev) {
		return false
	}

	cell, ok := d.grid[pos]
	if cell == "#" || !ok {
		return false
	}
	return true
}

func (d day) collapseGrid(currPos, prevPos, fromPos utils.Coords) {
	steps := 0

	for {
		if currPos.IsEqual(d.end) {
			d.collapsedGrid[fromPos][currPos] = steps + 1
			return
		}

		above := currPos.Up()
		right := currPos.Right()
		below := currPos.Down()
		left := currPos.Left()

		possibleNext := make([]utils.Coords, 0)

		if d.canMoveTo(above, prevPos) {
			possibleNext = append(possibleNext, above)
		}
		if d.canMoveTo(right, prevPos) {
			possibleNext = append(possibleNext, right)
		}
		if d.canMoveTo(below, prevPos) {
			possibleNext = append(possibleNext, below)
		}
		if d.canMoveTo(left, prevPos) {
			possibleNext = append(possibleNext, left)
		}

		if len(possibleNext) == 0 {
			// dead end? -> ignore
			return
		} else if len(possibleNext) == 1 {
			steps++
			prevPos = currPos
			currPos = possibleNext[0]
		} else {
			d.collapsedGrid[fromPos][currPos] = steps + 1
			_, hasNext := d.collapsedGrid[currPos]
			if hasNext {
				d.collapsedGrid[currPos][fromPos] = steps + 1
				return
			} else {
				d.collapsedGrid[currPos] = map[utils.Coords]int{
					fromPos: steps + 1,
				}
			}
			for _, pos := range possibleNext {
				d.collapseGrid(pos, currPos, currPos)
			}
			return
		}
	}
}

func cloneVisited(toCopy map[utils.Coords]bool) map[utils.Coords]bool {
	cloned := make(map[utils.Coords]bool)
	for k, v := range toCopy {
		cloned[k] = v
	}
	return cloned
}

func (d day) solvePartTwo(steps int, curr utils.Coords, visited map[utils.Coords]bool) (totalSteps int, ok bool) {
	if curr.IsEqual(d.end) {
		return steps, true
	}

	if visited[curr] {
		return steps, false
	}
	visited[curr] = true

	next, ok := d.collapsedGrid[curr]
	if !ok {
		return steps, false
	}

	best := -1
	for nextPos, nextSteps := range next {
		stepsFromPath, ok := d.solvePartTwo(steps+nextSteps, nextPos, cloneVisited(visited))
		if ok && stepsFromPath > best {
			best = stepsFromPath
		}
	}

	return best, best > -1
}
