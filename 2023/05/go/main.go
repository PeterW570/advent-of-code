package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func parseFileToLines(fileName string) []string {
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
		lines = append(lines, line)
	}

	return lines
}

func main() {
	lines := parseFileToLines("../input.txt")
	almanac := ParseLines(lines)

	lowestLocation := 0
	for {
		mapped := lowestLocation
		for i := len(almanac.Maps); i > 0; i-- {
			currMap := almanac.Maps[i-1]
			mapped = GetSourceVal(currMap, mapped)
		}

		found := false
		for _, seed := range almanac.Seeds {
			if mapped >= seed.Start && mapped < (seed.Start+seed.Range) {
				found = true
			}
		}

		if found {
			break
		}
		lowestLocation++
	}

	fmt.Printf("Part 2: %d\n", lowestLocation)
}

func GetSourceVal(sourceToTargetMapEntries []MapLine, destVal int) int {
	for _, entry := range sourceToTargetMapEntries {
		if destVal >= entry.DestRangeStart && destVal < (entry.DestRangeStart+entry.Range) {
			return entry.SourceRangeStart + (destVal - entry.DestRangeStart)
		}
	}
	return destVal
}

type Almanac struct {
	Seeds []SeedRange
	Maps  [][]MapLine
}

func ParseLines(lines []string) Almanac {
	almanac := Almanac{
		Seeds: make([]SeedRange, 0),
		Maps:  make([][]MapLine, 0),
	}

	almanac.Seeds = ParseSeedLine(lines[0])

	currentMap := make([]MapLine, 0)
	flush := func() {
		almanac.Maps = append(almanac.Maps, currentMap)
		currentMap = make([]MapLine, 0)
	}

	for _, line := range lines[2:] {
		if strings.HasSuffix(line, " map:") {
			flush()
		} else if len(strings.TrimSpace(line)) > 0 {
			currentMap = append(currentMap, ParseMapLine(line))
		}
	}
	flush()

	return almanac
}

func ParseSeedLine(line string) []SeedRange {
	splits := strings.Fields(line)[1:]
	seeds := make([]SeedRange, 0)
	sr := SeedRange{}
	for i, seed := range splits {
		num, err := strconv.Atoi(seed)
		if err != nil {
			panic(err)
		}
		if i%2 == 0 {
			sr.Start = num
		} else {
			sr.Range = num
			seeds = append(seeds, sr)
			sr = SeedRange{}
		}
	}
	return seeds
}

type SeedRange struct {
	Start int
	Range int
}

type MapLine struct {
	DestRangeStart   int
	SourceRangeStart int
	Range            int
}

func ParseMapLine(line string) MapLine {
	splits := strings.Fields(line)
	if len(splits) != 3 {
		panic("Should only be 3 values")
	}

	destRangeStart, err := strconv.Atoi(splits[0])
	if err != nil {
		panic(err)
	}
	sourceRangeStart, err := strconv.Atoi(splits[1])
	if err != nil {
		panic(err)
	}
	rangeLen, err := strconv.Atoi(splits[2])
	if err != nil {
		panic(err)
	}

	return MapLine{
		DestRangeStart:   destRangeStart,
		SourceRangeStart: sourceRangeStart,
		Range:            rangeLen,
	}
}
