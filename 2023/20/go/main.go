package main

import (
	"flag"
	"fmt"
	"strings"

	utils "peterweightman.com/aoc/utils"
)

type pulse int

const (
	lowPulse pulse = iota
	highPulse
)

type state int

const (
	off state = iota
	on
)

type module interface {
	sendPulse(p pulse, fromId string) (pulse, bool)
	getNextIds() []string
}

// Flip-flop modules (prefix %) are either on or off; they are initially off.
// If a flip-flop module receives a high pulse, it is ignored and nothing happens.
// However, if a flip-flop module receives a low pulse, it flips between on and off.
// If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.

type flipflop struct {
	id           string
	currentState state
	next         []string
}

func (f *flipflop) sendPulse(p pulse, fromId string) (pulse, bool) {
	if p == lowPulse {
		if f.currentState == off {
			f.currentState = on
			return highPulse, true
		} else {
			f.currentState = off
			return lowPulse, true
		}
	}
	return -1, false
}

func (f *flipflop) getNextIds() []string {
	return f.next
}

// Conjunction modules (prefix &) remember the type of the most recent pulse received
// from each of their connected input modules; they initially default to remembering
// a low pulse for each input. When a pulse is received, the conjunction module first
// updates its memory for that input. Then, if it remembers high pulses for all inputs,
// it sends a low pulse; otherwise, it sends a high pulse.

type conjunction struct {
	id       string
	received map[string]pulse
	next     []string
}

func (c *conjunction) sendPulse(p pulse, fromId string) (pulse, bool) {
	c.received[fromId] = p

	allHigh := true
	for _, lastPulse := range c.received {
		if lastPulse != highPulse {
			allHigh = false
			break
		}
	}

	if allHigh {
		return lowPulse, true
	} else {
		return highPulse, true
	}
}

func (c *conjunction) getNextIds() []string {
	return c.next
}

// There is a single broadcast module (named broadcaster). When it receives a pulse,
// it sends the same pulse to all of its destination modules.

type broadcast struct {
	id   string
	next []string
}

func (b *broadcast) sendPulse(p pulse, fromId string) (pulse, bool) {
	return p, true
}

func (b *broadcast) getNextIds() []string {
	return b.next
}

func main() {
	var useExample bool
	flag.BoolVar(&useExample, "use-example", false, "Use example. Default is false")
	flag.Parse()

	fileName := "input.txt"
	if useExample {
		fileName = "input_example.txt"
	}

	modulesById := make(map[string]module)
	prevIds := make(map[string]map[string]bool)
	conjunctions := make([]conjunction, 0)

	addToPrev := func(sourceId string, targetIds []string) {
		for _, id := range targetIds {
			sources, ok := prevIds[string(id)]
			if !ok {
				sources = make(map[string]bool)
				prevIds[string(id)] = sources
			}
			sources[sourceId] = true
		}
	}

	utils.IterateFileLines("../"+fileName, func(line string) {
		splits := strings.Split(line, " -> ")

		nameWithSymbol := splits[0]
		next := strings.Split(splits[1], ", ")

		if nameWithSymbol == "broadcaster" {
			b := broadcast{
				id:   nameWithSymbol,
				next: next,
			}
			modulesById["broadcaster"] = &b
			addToPrev(nameWithSymbol, next)
		} else if strings.HasPrefix(nameWithSymbol, "%") {
			id := nameWithSymbol[1:]
			ff := flipflop{
				id:   id,
				next: next,
			}
			modulesById[id] = &ff
			addToPrev(id, next)
		} else if strings.HasPrefix(nameWithSymbol, "&") {
			id := nameWithSymbol[1:]
			c := conjunction{
				id:       id,
				next:     next,
				received: make(map[string]pulse),
			}
			modulesById[id] = &c
			addToPrev(id, next)
			conjunctions = append(conjunctions, c)
		} else {
			panic("unexpected name")
		}
	})

	for _, c := range conjunctions {
		prev := prevIds[c.id]
		for id := range prev {
			c.received[id] = lowPulse
		}
	}

	// looking at the input.txt, the only input to rx is hp
	// hp is a conjunction, so to send a low to rx, all inputs
	// must be a high pulse.
	cyclesToHighPulseToHp := make(map[string]int)
	for id := range prevIds["hp"] {
		cyclesToHighPulseToHp[id] = -1
	}

	buttonPresses := 0
	for {
		buttonPresses++
		highPulsesToHp := pressButton(modulesById)
		allCyclesSet := true
		for id, existingCount := range cyclesToHighPulseToHp {
			hasPulsed, ok := highPulsesToHp[id]
			if ok && hasPulsed && existingCount == -1 {
				cyclesToHighPulseToHp[id] = buttonPresses
			} else if existingCount == -1 {
				allCyclesSet = false
			}
		}
		if allCyclesSet {
			break
		}
	}

	var partTwoTotal int
	cycles := make([]int, 0)
	for _, count := range cyclesToHighPulseToHp {
		cycles = append(cycles, count)
	}
	partTwoTotal = lcm(cycles[0], cycles[1])
	for _, count := range cycles[2:] {
		partTwoTotal = lcm(partTwoTotal, count)
	}

	fmt.Printf("Part 2: %d\n", partTwoTotal)
}

func gcd(x, y int) int {
	for y != 0 {
		x, y = y, x%y
	}
	return x
}

func lcm(x, y int) int {
	return x * y / gcd(x, y)
}

type queueItem struct {
	sourceId string
	targetId string
	p        pulse
}

func pressButton(modulesById map[string]module) map[string]bool {
	lowPulses := 1 // initial pulse from button
	highPulses := 0

	highPulsesToHp := make(map[string]bool)

	broadcaster := modulesById["broadcaster"]
	next := broadcaster.getNextIds()
	queue := make([]queueItem, len(next))
	for i, id := range next {
		queue[i] = queueItem{sourceId: "broadcaster", targetId: id, p: lowPulse}
	}

	for {
		if len(queue) == 0 {
			break
		}

		currPT := queue[0]
		queue = queue[1:]

		// fmt.Printf("%s -%d-> %s\n", currPT.sourceId, currPT.p, currPT.targetId)
		if currPT.p == lowPulse {
			lowPulses++
		} else {
			highPulses++
			if currPT.targetId == "hp" {
				highPulsesToHp[currPT.sourceId] = true
			}
		}

		curr, targetExists := modulesById[currPT.targetId]
		if !targetExists {
			continue
		}
		p, ack := curr.sendPulse(currPT.p, currPT.sourceId)
		if ack {
			for _, id := range curr.getNextIds() {
				queue = append(queue, queueItem{sourceId: currPT.targetId, targetId: id, p: p})
			}
		}
	}

	return highPulsesToHp
}
