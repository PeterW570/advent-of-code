package main

import (
	"flag"
	"fmt"
	"strconv"
	"strings"
	"time"

	utils "peterweightman.com/aoc/utils"
)

type Vector3 struct {
	x, y, z float64
}

type Vector2 struct {
	x, y float64
}

type hailstone struct {
	pos, vel Vector3
}

func main() {
	startTime := time.Now()

	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	min := float64(200000000000000)
	max := float64(400000000000000)
	if useExample {
		fileName = "input_example.txt"
		min = float64(7)
		max = float64(27)
	}

	hailstones := make([]hailstone, 0)

	utils.IterateFileLines("../"+fileName, func(line string) {
		hailstones = append(hailstones, parseHailstone(line))
	})

	partOneTotal := 0
	for i := 0; i < len(hailstones)-1; i++ {
		for j := i + 1; j < len(hailstones); j++ {
			a, b := hailstones[i], hailstones[j]
			if point, err := findIntersection(a, b); err == nil {
				if !pointIsInTestArea(point.x, min, max) {
					continue
				} else if !pointIsInTestArea(point.y, min, max) {
					continue
				} else if !pointIsInFuture(point.x, a.pos.x, a.vel.x) {
					continue
				} else if !pointIsInFuture(point.y, a.pos.y, a.vel.y) {
					continue
				} else if !pointIsInFuture(point.x, b.pos.x, b.vel.x) {
					continue
				} else if !pointIsInFuture(point.y, b.pos.y, b.vel.y) {
					continue
				}
				partOneTotal++
			}
		}
	}

	fmt.Printf("Part 1: %d (%s)\n", partOneTotal, time.Since(startTime))
}

func pointIsInTestArea(point, min, max float64) bool {
	return point >= min && point <= max
}

func pointIsInFuture(point, initialPos, vel float64) bool {
	posDiff := point - initialPos
	return (posDiff > 0) == (vel > 0)
}

// px py pz @ vx vy vz
func parseHailstone(line string) hailstone {
	splits := strings.Split(line, " @ ")
	posStrs := strings.Split(splits[0], ", ")
	velStrs := strings.Split(splits[1], ", ")

	px, _ := strconv.ParseFloat(posStrs[0], 64)
	py, _ := strconv.ParseFloat(posStrs[1], 64)
	pz, _ := strconv.ParseFloat(posStrs[2], 64)
	vx, _ := strconv.ParseFloat(velStrs[0], 64)
	vy, _ := strconv.ParseFloat(velStrs[1], 64)
	vz, _ := strconv.ParseFloat(velStrs[2], 64)

	return hailstone{
		pos: Vector3{px, py, pz},
		vel: Vector3{vx, vy, vz},
	}
}

func vectorCross(a, b Vector2) float64 {
	return (a.x * b.y) - (a.y * b.x)
}

func findIntersection(a, b hailstone) (Vector2, error) {
	a2 := Vector2{a.vel.x, a.vel.y}
	b2 := Vector2{b.vel.x, b.vel.y}
	d2 := Vector2{b.pos.x - a.pos.x, b.pos.y - a.pos.y}

	det := vectorCross(a2, b2)
	if det == 0 {
		return Vector2{-1, -1}, fmt.Errorf("hailstones are parallel")
	}

	u := vectorCross(d2, b2) / det
	return Vector2{a.pos.x + a.vel.x*u, a.pos.y + a.vel.y*u}, nil
}
