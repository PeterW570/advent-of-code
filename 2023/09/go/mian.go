package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	partOneTotal := 0

	for fileScanner.Scan() {
		line := fileScanner.Text()
		numStrs := strings.Fields(line)
		nums := make([]int, 0)

		for _, numStr := range numStrs {
			num, err := strconv.Atoi(numStr)
			if err != nil {
				panic(err)
			}
			nums = append(nums, num)
		}

		partOneTotal += nextNumber(nums)
	}

	fmt.Printf("Part 1: %d\n", partOneTotal)
}

func nextNumber(nums []int) int {
	diffs := make([][]int, 0)
	prev := nums
	for {
		currDiffs := make([]int, 0)
		for i := 1; i < len(prev); i++ {
			currDiffs = append(currDiffs, prev[i]-prev[i-1])
		}
		diffs = append(diffs, currDiffs)
		prev = currDiffs

		allSame := true
		for i := 1; i < len(currDiffs); i++ {
			if currDiffs[i] != currDiffs[0] {
				allSame = false
				break
			}
		}
		if allSame {
			break
		}
	}
	prevDiff := 0
	for i := len(diffs) - 1; i >= 0; i-- {
		currDiffs := diffs[i]
		last := currDiffs[len(currDiffs)-1]
		next := last + prevDiff
		prevDiff = next
	}

	last := nums[len(nums)-1]
	return last + prevDiff
}
