package main

import (
	"flag"
	"fmt"
	"math"
	"math/rand"
	"strings"
	"time"

	utils "peterweightman.com/aoc/utils"
)

type Graph map[string]map[string]int

func main() {
	startTime := time.Now()

	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	graph := make(Graph)

	utils.IterateFileLines("../"+fileName, func(line string) {
		splits := strings.Split(line, ": ")
		from := splits[0]
		if _, isSet := graph[from]; !isSet {
			graph[from] = make(map[string]int)
		}

		for _, to := range strings.Fields(splits[1]) {
			if _, isSet := graph[to]; !isSet {
				graph[to] = make(map[string]int)
			}
			graph[from][to] = 1
			graph[to][from] = 1
		}
	})

	nodes := make([]string, len(graph))
	groupSizes := make(map[string]int)
	idx := 0
	for node := range graph {
		nodes[idx] = node
		groupSizes[node] = 1
		idx++
	}

	numIterations := 1000
	minimumCut := math.MaxInt
	var solution int

	for i := 0; i < numIterations; i++ {
		copyGraph := copyGraph(graph)
		copyGroupSizes := copyGroupSizes(groupSizes)

		currentCut, group1, group2 := minCut(copyGraph, copyGroupSizes)

		if currentCut < minimumCut {
			minimumCut = currentCut
			solution = group1 * group2
			if minimumCut == 3 {
				// short-circuit because we know that 3 is the min cut
				break
			}
		}
	}

	fmt.Printf("Solution: %d (%s)\n", solution, time.Since(startTime))
}

func contract(graph map[string]map[string]int, u, v string) {
	for node, count := range graph[v] {
		existingCount := graph[u][node]
		graph[u][node] = existingCount + count
	}

	for node := range graph {
		if node != u && node != v {
			if graph[node][v] > 0 {
				existingCount := graph[node][u]
				graph[node][u] = existingCount + graph[node][v]
			}
			delete(graph[node], v)
		}
	}

	delete(graph[u], u)
	delete(graph[u], v)
	delete(graph, v)
}

func randomEdges(graph map[string]map[string]int) (string, string) {
	keys := make([]string, 0, len(graph))
	for key := range graph {
		keys = append(keys, key)
	}

	u := keys[rand.Intn(len(keys))]
	neighbors := make([]string, 0, len(graph[u]))
	for neighbor := range graph[u] {
		neighbors = append(neighbors, neighbor)
	}

	v := neighbors[rand.Intn(len(neighbors))]

	return u, v
}

// https://en.wikipedia.org/wiki/Karger's_algorithm
func minCut(graph map[string]map[string]int, groupSizes map[string]int) (int, int, int) {
	for len(graph) > 2 {
		u, v := randomEdges(graph)

		contract(graph, u, v)

		groupSizes[u] += groupSizes[v]
		delete(groupSizes, v)
	}

	nodes := make([]string, 0)
	for node := range graph {
		nodes = append(nodes, node)
	}

	count := graph[nodes[0]][nodes[1]]

	return count, groupSizes[nodes[0]], groupSizes[nodes[1]]
}

func copyGraph(graph map[string]map[string]int) map[string]map[string]int {
	copyGraph := make(map[string]map[string]int)

	for key, value := range graph {
		copyValue := make(map[string]int)
		for innerKey, innerValue := range value {
			copyValue[innerKey] = innerValue
		}
		copyGraph[key] = copyValue
	}

	return copyGraph
}

func copyGroupSizes(groupSizes map[string]int) map[string]int {
	copyGroupSizes := make(map[string]int)
	for key, value := range groupSizes {
		copyGroupSizes[key] = value
	}
	return copyGroupSizes
}
