package main

import (
	"fmt"
	"math"
	"strconv"
	"strings"

	utils "peterweightman.com/aoc/utils"
)

type vertex struct {
	coords        utils.Coords
	dirInto       utils.Dir
	straightCount int
}

func main() {
	grid := make([][]float64, 0)
	vertices := make([]utils.Coords, 0)
	utils.IterateFileLines("../input.txt", func(line string) {
		gridLine := make([]float64, 0)
		for _, char := range line {
			vertices = append(vertices, utils.Coords{Row: len(grid), Col: len(gridLine)})
			i, _ := strconv.Atoi(string(char))
			gridLine = append(gridLine, float64(i))
		}
		grid = append(grid, gridLine)
	})

	start := utils.Coords{Row: 0, Col: 0}
	end := utils.Coords{Row: len(grid) - 1, Col: len(grid[0]) - 1}

	partOneTotal := solve(grid, vertices, start, end)
	fmt.Printf("Part 1: %d\n", int(partOneTotal))
}

func vertexKey(v vertex) string {
	return fmt.Sprintf("%s;%d;%d", v.coords.ToString(), v.dirInto, v.straightCount)
}

func solve(grid [][]float64, gridCoords []utils.Coords, start utils.Coords, end utils.Coords) float64 {
	distFromStart := make(map[string]float64)
	prev := make(map[string]vertex)

	queue := []vertex{
		{coords: start},
	}
	distFromStart[vertexKey(queue[0])] = 0
	seen := vertexKey(queue[0])

	var endVertex vertex
	for {
		if len(queue) == 0 {
			break
		}

		posIdx, curr := getNextBestVertex(queue, distFromStart)
		if curr.coords.IsEqual(end) {
			endVertex = curr
			break
		}
		if posIdx == -1 {
			panic("couldn't find next best vertex")
		}
		if posIdx == len(queue)-1 {
			queue = queue[:posIdx]
		} else {
			queue = append(queue[:posIdx], queue[posIdx+1:]...)
		}

		neighbours := getNeighbours(curr, seen, grid)
		for _, v := range neighbours {
			neighbourKey := vertexKey(v)
			dist := distFromStart[vertexKey(curr)] + grid[v.coords.Row][v.coords.Col]

			neighbourDist, alreadySet := distFromStart[neighbourKey]

			if !alreadySet || dist < neighbourDist {
				distFromStart[neighbourKey] = dist
				prev[neighbourKey] = curr
			}

			seen += fmt.Sprintf("|%s", vertexKey(v))
			queue = append(queue, v)
		}
	}

	debugPath(grid, prev, endVertex)
	return distFromStart[vertexKey(endVertex)]
}

func getNextBestVertex(vertices []vertex, dists map[string]float64) (int, vertex) {
	bestDist := math.Inf(1)
	var bestVertex vertex
	bestVertexIdx := -1

	for i, v := range vertices {
		dist := dists[vertexKey(v)]
		if dist < bestDist {
			bestVertex = v
			bestDist = dist
			bestVertexIdx = i
		}
	}

	return bestVertexIdx, bestVertex
}

type neighbour struct {
	dir    utils.Dir
	coords utils.Coords
}

func getNeighbours(curr vertex, seen string, grid [][]float64) []vertex {
	vertices := make([]vertex, 0)
	neighbours := []neighbour{
		{dir: utils.North, coords: curr.coords.Up()},
		{dir: utils.East, coords: curr.coords.Right()},
		{dir: utils.South, coords: curr.coords.Down()},
		{dir: utils.West, coords: curr.coords.Left()},
	}

	var backDir utils.Dir
	if curr.dirInto > 0 { // special case for start vertex
		backDir = utils.OppositeDir(curr.dirInto)
	}

	for _, x := range neighbours {
		if x.dir == backDir {
			continue
		}
		if !x.coords.InBounds(0, len(grid)-1, 0, len(grid[0])-1) {
			continue
		}
		if x.dir == curr.dirInto && curr.straightCount == 3 {
			continue
		}
		straightCount := 1
		if x.dir == curr.dirInto {
			straightCount = curr.straightCount + 1
		}

		v := vertex{
			coords:        x.coords,
			dirInto:       x.dir,
			straightCount: straightCount,
		}

		if strings.Contains(seen, vertexKey(v)) {
			continue
		}

		vertices = append(vertices, v)
	}

	return vertices
}

func debugPath(grid [][]float64, prev map[string]vertex, end vertex) {
	toPrint := make([][]string, len(grid))
	for i, row := range grid {
		toPrint[i] = make([]string, len(row))
		for j, val := range row {
			toPrint[i][j] = strconv.Itoa(int(val))
		}
	}

	curr := end
pathLoop:
	for {
		dir := curr.dirInto
		dirToPrint := ""
		switch dir {
		case utils.North:
			dirToPrint = "^"
		case utils.East:
			dirToPrint = ">"
		case utils.South:
			dirToPrint = "v"
		case utils.West:
			dirToPrint = "<"
		default:
			break pathLoop // special case for first
		}
		toPrint[curr.coords.Row][curr.coords.Col] = dirToPrint

		currKey := vertexKey(curr)
		prev, ok := prev[currKey]
		// fmt.Println(prev.coords.ToString())
		if !ok {
			break
		}
		curr = prev
	}

	for _, row := range toPrint {
		for _, cell := range row {
			fmt.Print(cell)
		}
		fmt.Println()
	}
	fmt.Println()
}
