package main

import (
	"testing"

	"github.com/google/go-cmp/cmp"
	utils "peterweightman.com/aoc/utils"
)

func TestAdjustedCoords(t *testing.T) {
	got := adjustedCoords(utils.Coords{Row: 10, Col: 10}, []int{2, 6, 12}, []int{4, 16})
	want := utils.Coords{Row: 10 + 999_999 + 999_999, Col: 10 + 999_999}

	if !cmp.Equal(got, want) {
		t.Errorf("adjustedCoords(...) = %v, want %v", got, want)
	}
}
