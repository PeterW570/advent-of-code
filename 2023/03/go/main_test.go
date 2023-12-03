package main

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

var wantParts = []Part{
	{
		PartNumber: 467,
		Coords: []Coords{
			{Row: 0, Col: 0},
			{Row: 0, Col: 1},
			{Row: 0, Col: 2},
		},
	},
	{
		PartNumber: 114,
		Coords: []Coords{
			{Row: 0, Col: 5},
			{Row: 0, Col: 6},
			{Row: 0, Col: 7},
		},
	},
	{
		PartNumber: 35,
		Coords: []Coords{
			{Row: 2, Col: 2},
			{Row: 2, Col: 3},
		},
	},
	{
		PartNumber: 633,
		Coords: []Coords{
			{Row: 2, Col: 6},
			{Row: 2, Col: 7},
			{Row: 2, Col: 8},
		},
	},
	{
		PartNumber: 617,
		Coords: []Coords{
			{Row: 4, Col: 0},
			{Row: 4, Col: 1},
			{Row: 4, Col: 2},
		},
	},
	{
		PartNumber: 58,
		Coords: []Coords{
			{Row: 5, Col: 7},
			{Row: 5, Col: 8},
		},
	},
	{
		PartNumber: 592,
		Coords: []Coords{
			{Row: 6, Col: 2},
			{Row: 6, Col: 3},
			{Row: 6, Col: 4},
		},
	},
	{
		PartNumber: 755,
		Coords: []Coords{
			{Row: 7, Col: 6},
			{Row: 7, Col: 7},
			{Row: 7, Col: 8},
		},
	},
	{
		PartNumber: 664,
		Coords: []Coords{
			{Row: 9, Col: 1},
			{Row: 9, Col: 2},
			{Row: 9, Col: 3},
		},
	},
	{
		PartNumber: 598,
		Coords: []Coords{
			{Row: 9, Col: 5},
			{Row: 9, Col: 6},
			{Row: 9, Col: 7},
		},
	},
}
var wantSymbols = []Symbol{
	{
		Symbol: "*",
		Coords: Coords{Row: 1, Col: 3},
	},
	{
		Symbol: "#",
		Coords: Coords{Row: 3, Col: 6},
	},
	{
		Symbol: "*",
		Coords: Coords{Row: 4, Col: 3},
	},
	{
		Symbol: "+",
		Coords: Coords{Row: 5, Col: 5},
	},
	{
		Symbol: "$",
		Coords: Coords{Row: 8, Col: 3},
	},
	{
		Symbol: "*",
		Coords: Coords{Row: 8, Col: 5},
	},
}

func TestParseLines(t *testing.T) {
	testInput := []string{
		"467..114..",
		"...*......",
		"..35..633.",
		"......#...",
		"617*......",
		".....+.58.",
		"..592.....",
		"......755.",
		"...$.*....",
		".664.598..",
	}

	gotParts, gotSymbols := parseLines(testInput)

	if !cmp.Equal(gotParts, wantParts) {
		t.Errorf("parseLines(...) -> parts = %v, want %v", gotParts, wantParts)
	}

	if !cmp.Equal(gotSymbols, wantSymbols) {
		t.Errorf("parseLines(...) -> symbols = %v, want %v", gotSymbols, wantSymbols)
	}
}

func TestSolvePartOne(t *testing.T) {
	got := solvePartOne(wantParts, wantSymbols)
	want := 4361

	if got != want {
		t.Errorf("solvePartOne(...) = %d, want %d", got, want)
	}
}

func TestSolvePartTwo(t *testing.T) {
	got := solvePartTwo(wantParts, wantSymbols)
	want := 467835

	if got != want {
		t.Errorf("solvePartTwo(...) = %d, want %d", got, want)
	}
}
