package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"regexp"
	"strings"
)

type node struct {
	id, left, right string
}

func main() {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	lines := make([]string, 0)

	for fileScanner.Scan() {
		line := fileScanner.Text()
		if line == "" {
			continue
		}
		lines = append(lines, line)
	}

	instructions := strings.Split(lines[0], "")
	nodesById := make(map[string]node, 0)
	startNodeIds := make([]string, 0)

	for _, line := range lines[1:] {
		node := parseLineToNode(line)
		nodesById[node.id] = node
		if strings.HasSuffix(node.id, "A") {
			startNodeIds = append(startNodeIds, node.id)
		}
	}

	stepsToSolve := make(map[int]bool, 0)
	for _, id := range startNodeIds {
		stepsToSolve[stepsForStartingNode(nodesById, id, instructions)] = true
	}
	dedupedSteps := make([]int, 0)
	for step := range stepsToSolve {
		dedupedSteps = append(dedupedSteps, step)
	}
	partTwoTotal := lcmOfSlice(dedupedSteps)

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

// Function to calculate the greatest common divisor (GCD) of two numbers
func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}

// Function to calculate the lowest common multiple (LCM) of two numbers
func lcm(a, b int) int {
	return int(math.Abs(float64(a*b)) / float64(gcd(a, b)))
}

// Function to calculate the LCM of multiple numbers
func lcmOfSlice(numbers []int) int {
	result := 1
	for _, num := range numbers {
		result = lcm(result, num)
	}
	return result
}

func stepsForStartingNode(nodesById map[string]node, startId string, instructions []string) int {
	currentNode := nodesById[startId]
	currentInstructionIdx := 0
	steps := 0
	for {
		if strings.HasSuffix(currentNode.id, "Z") {
			break
		}
		instruction := instructions[(currentInstructionIdx % len(instructions))]

		switch instruction {
		case "L":
			currentNode = nodesById[currentNode.left]
		case "R":
			currentNode = nodesById[currentNode.right]
		default:
			panic(fmt.Sprintf("Unexpected instruction: %q", instruction))
		}
		steps++
		currentInstructionIdx++
	}

	return steps
}

func parseLineToNode(line string) node {
	// line looks like: AAA = (BBB, CCC)
	re := regexp.MustCompile(`(\w+) = \((\w+), (\w+)\)`)
	matches := re.FindAllStringSubmatch(line, -1)

	return node{
		id:    matches[0][1],
		left:  matches[0][2],
		right: matches[0][3],
	}
}
