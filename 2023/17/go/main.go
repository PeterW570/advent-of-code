package main

import (
	"container/heap"
	"fmt"
	"strconv"

	utils "peterweightman.com/aoc/utils"
)

type vertex struct {
	coords        utils.Coords
	dirInto       utils.Dir
	distFromStart float64
}

type item struct {
	value vertex
	cost  int
	// The index is needed by update and is maintained by the heap.Interface methods.
	index int // The index of the item in the heap.
}

type PriorityQueue []*item

func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool {
	// We want Pop to give us the smallest distance.
	return pq[i].cost < pq[j].cost
}
func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
	pq[i].index = i
	pq[j].index = j
}
func (pq *PriorityQueue) Push(x any) {
	n := len(*pq)
	item := x.(*item)
	item.index = n
	*pq = append(*pq, item)
}

func (pq *PriorityQueue) Pop() any {
	old := *pq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil  // avoid memory leak
	item.index = -1 // for safety
	*pq = old[0 : n-1]
	return item
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

	partTwoTotal := solve(grid, vertices, start, end, 4, 10)
	fmt.Printf("Part 2: %d\n", int(partTwoTotal))
}

func vertexKey(v vertex) string {
	return fmt.Sprintf("%s;%d", v.coords.ToString(), v.dirInto)
}

func solve(grid [][]float64, gridCoords []utils.Coords, start, end utils.Coords, minStraight, maxStraight int) float64 {
	distFromStart := make(map[string]float64)
	prev := make(map[string]vertex)

	queue := make(PriorityQueue, 2)
	queue[0] = &item{
		value: vertex{coords: start, dirInto: utils.East},
		cost:  0,
		index: 0,
	}
	queue[1] = &item{
		value: vertex{coords: start, dirInto: utils.South},
		cost:  0,
		index: 1,
	}
	heap.Init(&queue)
	distFromStart[vertexKey(queue[0].value)] = 0
	distFromStart[vertexKey(queue[1].value)] = 0
	visited := make(map[string]bool)

	var endVertex vertex
	for {
		if queue.Len() == 0 {
			break
		}

		queueItem := heap.Pop(&queue).(*item)
		curr := queueItem.value
		if curr.coords.IsEqual(end) {
			endVertex = curr
			break
		}
		if visited[vertexKey(curr)] {
			continue
		}
		visited[vertexKey(curr)] = true

		neighbours := getNeighbours(curr, minStraight, maxStraight, grid)
		for _, neighbour := range neighbours {
			v := neighbour.v
			neighbourKey := vertexKey(v)
			dist := v.distFromStart

			neighbourDist, alreadySet := distFromStart[neighbourKey]

			if !alreadySet || dist < neighbourDist {
				distFromStart[neighbourKey] = dist
				prev[neighbourKey] = neighbour.from
			}

			heap.Push(&queue, &item{
				value: v,
				cost:  int(v.distFromStart) + v.coords.ManhattenDistanceTo(end),
			})
		}
	}

	// debugPath(grid, prev, endVertex)
	return distFromStart[vertexKey(endVertex)]
}

type neighbour struct {
	v    vertex
	from vertex
}

func getNeighbours(curr vertex, minStraight, maxStraight int, grid [][]float64) []neighbour {
	neighbours := make([]neighbour, 0)

	var dirs = utils.PerpendicularDirs(curr.dirInto)
	for _, dir := range dirs {
		inDir := make([]neighbour, 0)
		prev := curr
		pos := curr.coords
		distFromStart := curr.distFromStart
		for i := 1; i <= maxStraight; i++ {
			pos = pos.MoveInDir(dir)
			if !pos.InBounds(0, len(grid)-1, 0, len(grid[0])-1) {
				if i < minStraight {
					inDir = make([]neighbour, 0)
				}
				break
			}
			distFromStart += grid[pos.Row][pos.Col]
			if i < minStraight {
				continue
			}

			v := vertex{
				coords:        pos,
				dirInto:       dir,
				distFromStart: distFromStart,
			}

			inDir = append(inDir, neighbour{
				v:    v,
				from: prev,
			})
			prev = v
		}
		neighbours = append(neighbours, inDir...)
	}

	return neighbours
}

//lint:ignore U1000 debugging helper fn
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
