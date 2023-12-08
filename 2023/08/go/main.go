package main

import (
	"bufio"
	"fmt"
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
	startNodeId := "AAA"
	endNodeId := "ZZZ"

	for _, line := range lines[1:] {
		node := parseLineToNode(line)
		nodesById[node.id] = node
	}

	currentNode := nodesById[startNodeId]
	currentInstructionIdx := 0
	steps := 0
	for {
		if currentNode.id == endNodeId {
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

	fmt.Printf("Part 1: %d\n", steps)
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
