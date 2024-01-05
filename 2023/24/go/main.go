package main

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	utils "peterweightman.com/aoc/utils"
)

type Vector3 struct {
	x, y, z float64
}

type hailstone struct {
	pos, vel Vector3
}

func main() {
	startTime := time.Now()

	fileName := "input.txt"
	hailstones := make([]hailstone, 0)

	utils.IterateFileLines("../"+fileName, func(line string) {
		stone := parseHailstone(line)
		hailstones = append(hailstones, stone)
	})

	t1 := solveT1(hailstones)
	t2 := solveT1([]hailstone{hailstones[1], hailstones[0], hailstones[2]})

	c1 := calculateCollisionPosition(hailstones[0], t1)
	c2 := calculateCollisionPosition(hailstones[1], t2)
	v := calculateVelocity(c1, c2, t1, t2)
	p := calculateFinalPosition(hailstones[0], v, t1)

	partTwoTotal := sumSlice(p)

	fmt.Printf("Part 2: %d (%s)\n", int(partTwoTotal), time.Since(startTime))
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

// maths copied from solution: https://www.reddit.com/r/adventofcode/comments/18pum3b/2023_day_24_part_2_does_anyone_have_an_algebraic/kes32ef/
func solveT1(rocks []hailstone) float64 {
	r1, r2, r3 := rocks[0].pos, rocks[1].pos, rocks[2].pos
	v1, v2, v3 := rocks[0].vel, rocks[1].vel, rocks[2].vel

	yz := r1.y*(r2.z-r3.z) + r2.y*(-r1.z+r3.z) + r3.y*(r1.z-r2.z)
	xz := r1.x*(-r2.z+r3.z) + r2.x*(r1.z-r3.z) + r3.x*(-r1.z+r2.z)
	xy := r1.x*(r2.y-r3.y) + r2.x*(-r1.y+r3.y) + r3.x*(r1.y-r2.y)
	vxvy := v1.x*(v2.y-v3.y) + v2.x*(-v1.y+v3.y) + v3.x*(v1.y-v2.y)
	vxvz := v1.x*(-v2.z+v3.z) + v2.x*(v1.z-v3.z) + v3.x*(-v1.z+v2.z)
	vyvz := v1.y*(v2.z-v3.z) + v2.y*(-v1.z+v3.z) + v3.y*(v1.z-v2.z)

	n := (v2.x-v3.x)*yz + (v2.y-v3.y)*xz + (v2.z-v3.z)*xy
	d := (r2.z-r3.z)*vxvy + (r2.y-r3.y)*vxvz + (r2.x-r3.x)*vyvz

	return float64(n) / float64(d)
}

func calculateCollisionPosition(rock hailstone, t float64) Vector3 {
	collisionPosition := Vector3{
		rock.pos.x + rock.vel.x*t,
		rock.pos.y + rock.vel.y*t,
		rock.pos.z + rock.vel.z*t,
	}
	return collisionPosition
}

func calculateVelocity(c1, c2 Vector3, t1, t2 float64) Vector3 {
	velocity := Vector3{
		(c2.x - c1.x) / (t2 - t1),
		(c2.y - c1.y) / (t2 - t1),
		(c2.z - c1.z) / (t2 - t1),
	}
	return velocity
}

func calculateFinalPosition(rock hailstone, v Vector3, t float64) Vector3 {
	finalPosition := Vector3{
		rock.pos.x + rock.vel.x*t - v.x*t,
		rock.pos.y + rock.vel.y*t - v.y*t,
		rock.pos.z + rock.vel.z*t - v.z*t,
	}
	return finalPosition
}

func sumSlice(v Vector3) float64 {
	return v.x + v.y + v.z
}
