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

	var lowestLocation int
	for i, seed := range almanac.Seeds {
		locationForSeed := GetLocationForSeed(seed, almanac)
		if i == 0 {
			lowestLocation = locationForSeed
		} else {
			lowestLocation = min(lowestLocation, locationForSeed)
		}
	}

	fmt.Printf("Part 1: %d\n", lowestLocation)
}

func GetTargetVal(sourceToTargetMapEntries []MapLine, sourceVal int) int {
	for _, entry := range sourceToTargetMapEntries {
		if sourceVal >= entry.SourceRangeStart && sourceVal <= (entry.SourceRangeStart+entry.Range) {
			return entry.DestRangeStart + (sourceVal - entry.SourceRangeStart)
		}
	}
	return sourceVal
}

func GetLocationForSeed(seed int, almanac Almanac) int {
	soil := GetTargetVal(almanac.SeedToSoilMap, seed)
	fertilizer := GetTargetVal(almanac.SoilToFertilizerMap, soil)
	water := GetTargetVal(almanac.FertilizerToWaterMap, fertilizer)
	light := GetTargetVal(almanac.WaterToLightMap, water)
	temp := GetTargetVal(almanac.LightToTemperatureMap, light)
	humidity := GetTargetVal(almanac.TemperatureToHumidityMap, temp)
	location := GetTargetVal(almanac.HumidityToLocationMap, humidity)
	// fmt.Printf("seed %d -> soil %d -> fert %d -> water %d -> light %d -> temp %d -> hum %d -> loc %d\n", seed, soil, fertilizer, water, light, temp, humidity, location)
	return location
}

type Almanac struct {
	Seeds                    []int
	SeedToSoilMap            []MapLine
	SoilToFertilizerMap      []MapLine
	FertilizerToWaterMap     []MapLine
	WaterToLightMap          []MapLine
	LightToTemperatureMap    []MapLine
	TemperatureToHumidityMap []MapLine
	HumidityToLocationMap    []MapLine
}

func ParseLines(lines []string) Almanac {
	almanac := Almanac{
		Seeds:                    make([]int, 0),
		SeedToSoilMap:            make([]MapLine, 0),
		SoilToFertilizerMap:      make([]MapLine, 0),
		FertilizerToWaterMap:     make([]MapLine, 0),
		WaterToLightMap:          make([]MapLine, 0),
		LightToTemperatureMap:    make([]MapLine, 0),
		TemperatureToHumidityMap: make([]MapLine, 0),
		HumidityToLocationMap:    make([]MapLine, 0),
	}

	almanac.Seeds = ParseSeedLine(lines[0])

	parsingMap := ""
	addToMapLines := func(entry MapLine) {
		switch parsingMap {
		case "seed-to-soil":
			almanac.SeedToSoilMap = append(almanac.SeedToSoilMap, entry)
		case "soil-to-fertilizer":
			almanac.SoilToFertilizerMap = append(almanac.SoilToFertilizerMap, entry)
		case "fertilizer-to-water":
			almanac.FertilizerToWaterMap = append(almanac.FertilizerToWaterMap, entry)
		case "water-to-light":
			almanac.WaterToLightMap = append(almanac.WaterToLightMap, entry)
		case "light-to-temperature":
			almanac.LightToTemperatureMap = append(almanac.LightToTemperatureMap, entry)
		case "temperature-to-humidity":
			almanac.TemperatureToHumidityMap = append(almanac.TemperatureToHumidityMap, entry)
		case "humidity-to-location":
			almanac.HumidityToLocationMap = append(almanac.HumidityToLocationMap, entry)
		default:
			panic("Unexpected parsingMap")
		}
	}

	for _, line := range lines[2:] {
		if strings.HasSuffix(line, " map:") {
			parsingMap = strings.Fields(line)[0]
		} else if len(strings.TrimSpace(line)) > 0 {
			addToMapLines(ParseMapLine(line))
		}
	}

	return almanac
}

func ParseSeedLine(line string) []int {
	splits := strings.Fields(line)[1:]
	seeds := make([]int, 0)
	for _, seed := range splits {
		seedInt, err := strconv.Atoi(seed)
		if err != nil {
			panic(err)
		}
		seeds = append(seeds, seedInt)
	}
	return seeds
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
