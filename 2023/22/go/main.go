package main

import (
	"flag"
	"fmt"
	"sort"
	"strconv"
	"strings"

	utils "peterweightman.com/aoc/utils"
)

type coord3d struct {
	x, y, z int
}

func (c coord3d) IsEqual(comp coord3d) bool {
	return c.x == comp.x && c.y == comp.y && c.z == comp.z
}

func (c coord3d) IsLowerZ(comp coord3d) bool {
	return c.z < comp.z
}

func (c coord3d) MoveBelow() coord3d {
	return coord3d{x: c.x, y: c.y, z: c.z - 1}
}

func (c coord3d) ToString() string {
	return fmt.Sprintf("(%d, %d, %d)", c.x, c.y, c.z)
}

func moveCoordTowards(source, target int) int {
	if source < target {
		return source + 1
	} else if source > target {
		return source - 1
	}
	return source
}

func (c coord3d) MoveTowards(target coord3d) coord3d {
	return coord3d{
		x: moveCoordTowards(c.x, target.x),
		y: moveCoordTowards(c.y, target.y),
		z: moveCoordTowards(c.z, target.z),
	}
}

type brick struct {
	start, end coord3d
}

func (b brick) IsLowerZ(comp brick) bool {
	return (b.start.IsLowerZ(comp.start) && b.start.IsLowerZ(comp.end)) ||
		(b.end.IsLowerZ(comp.start) && b.end.IsLowerZ(comp.end))
}

func (b brick) IterateCoords(cb func(coord3d)) {
	currCoord := b.start
	for {
		cb(currCoord)
		if currCoord.IsEqual(b.end) {
			break
		} else {
			currCoord = currCoord.MoveTowards(b.end)
		}
	}
}

func parseCoords(coords string) coord3d {
	splits := strings.Split(coords, ",")
	x, _ := strconv.Atoi(splits[0])
	y, _ := strconv.Atoi(splits[1])
	z, _ := strconv.Atoi(splits[2])
	return coord3d{
		x: x,
		y: y,
		z: z,
	}
}

func deepCopySupportedMap(original map[int]map[int]bool) map[int]map[int]bool {
	copiedMap := make(map[int]map[int]bool)

	for key, innerMap := range original {
		newInnerMap := make(map[int]bool)

		for innerKey, innerValue := range innerMap {
			newInnerMap[innerKey] = innerValue
		}

		copiedMap[key] = newInnerMap
	}

	return copiedMap
}

func main() {
	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	bricks := make([]brick, 0)

	utils.IterateFileLines("../"+fileName, func(line string) {
		coordSplit := strings.Split(line, "~")
		bricks = append(bricks, brick{
			start: parseCoords(coordSplit[0]),
			end:   parseCoords(coordSplit[1]),
		})
	})

	sort.Slice(bricks, func(i, j int) bool {
		brickA := bricks[i]
		brickB := bricks[j]

		return brickA.IsLowerZ(brickB)
	})

	settledBricks := make(map[coord3d]int)
	supportedMap := make(map[int]map[int]bool)

	for brickIdx, brick := range bricks {
		aboveFloor := utils.IntMin(brick.start.z, brick.end.z)
		for i := 0; i < aboveFloor; i++ {
			bricksBelow := make(map[int]bool, 0)
			brick.IterateCoords(func(c coord3d) {
				belowCurr := c.MoveBelow()
				belowBrickIdx, belowIsOccupied := settledBricks[belowCurr]
				if belowIsOccupied {
					bricksBelow[belowBrickIdx] = true
				}
			})
			if len(bricksBelow) > 0 {
				supportedMap[brickIdx] = bricksBelow
				break
			} else {
				brick.start = brick.start.MoveBelow()
				brick.end = brick.end.MoveBelow()
			}
		}
		brick.IterateCoords(func(c coord3d) {
			settledBricks[c] = brickIdx
		})
	}

	partTwoTotal := 0
	for i := range bricks {
		// fmt.Println(len(bricks) - i)
		cloned := deepCopySupportedMap(supportedMap)
		partTwoTotal += totalSupported(cloned, i)
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func totalSupported(supportedMap map[int]map[int]bool, brickIdx int) int {
	supportingCount := 0
	for i, supporting := range supportedMap {
		if supporting[brickIdx] && len(supporting) == 1 {
			supportingCount += 1 + totalSupported(supportedMap, i)
		}
		delete(supporting, brickIdx)
	}
	return supportingCount
}
