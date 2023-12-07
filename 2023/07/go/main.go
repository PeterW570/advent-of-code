package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

var cardToVal = map[string]int{
	"J": 1, // joker
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9,
	"T": 10,
	"Q": 12,
	"K": 13,
	"A": 14,
}

type handClassification int

const (
	highCard handClassification = iota + 1
	onePair
	twoPair
	threeOfAKind
	fullHouse
	fourOfAKind
	fiveOfAKind
)

type hand struct {
	cards string
	bid   int
}

func main() {
	readFile, err := os.Open("../input.txt")

	if err != nil {
		fmt.Println(err)
	}
	defer readFile.Close()

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	hands := make([]hand, 0)

	for fileScanner.Scan() {
		line := fileScanner.Text()
		splits := strings.Fields(line)
		bid, err := strconv.Atoi(splits[1])
		if err != nil {
			panic(err)
		}
		hands = append(hands, hand{
			cards: splits[0],
			bid:   bid,
		})
	}

	sort.Slice(hands, func(i, j int) bool {
		return compareHands(hands[i].cards, hands[j].cards)
	})

	partTwoTotal := 0
	for i := 0; i < len(hands); i++ {
		rank := len(hands) - i
		partTwoTotal += hands[i].bid * rank
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func compareHands(hand1, hand2 string) bool {
	var class1 = classifyHand(hand1)
	var class2 = classifyHand(hand2)

	if class1 == class2 {
		for i := 0; i < len(hand1); i++ {
			diff := cardToVal[string(hand1[i])] - cardToVal[string(hand2[i])]
			if diff == 0 {
				continue
			}
			return diff > 0
		}
	} else {
		return class1 > class2
	}

	panic("shouldn't have identical hands")
}

func classifyHand(hand string) handClassification {
	var handMap = make(map[string]int)
	for _, card := range hand {
		handMap[string(card)] += 1
	}

	var frequencies = make([]int, 0)
	var jokers = handMap["J"]
	for k, val := range handMap {
		if k == "J" {
			continue
		} else {
			frequencies = append(frequencies, val)
		}
	}
	sort.Slice(frequencies, func(i, j int) bool {
		return frequencies[i] > frequencies[j]
	})

	// happens if all cards are jokers
	if len(frequencies) == 0 {
		return fiveOfAKind
	}

	frequencies[0] += jokers

	if frequencies[0] == 5 {
		return fiveOfAKind
	} else if frequencies[0] == 4 {
		return fourOfAKind
	} else if frequencies[0] == 3 {
		if frequencies[1] == 2 {
			return fullHouse
		} else {
			return threeOfAKind
		}
	} else if frequencies[0] == 2 {
		if frequencies[1] == 2 {
			return twoPair
		} else {
			return onePair
		}
	} else {
		return highCard
	}
}
