package aoc_utils

import (
	"bufio"
	"fmt"
	"os"
)

func ParseFileToLines(fileName string) []string {
	readFile, err := os.Open(fileName)

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

func IterateFileLines(fileName string, callback func(line string)) {
	readFile, err := os.Open(fileName)

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	for fileScanner.Scan() {
		line := fileScanner.Text()
		callback(line)
	}
}
