package aoc_utils

import (
	"fmt"
	"math"
)

type Coords struct {
	Row int
	Col int
}

type Dir int

const (
	North Dir = iota
	East
	South
	West
)

func (c Coords) ToString() string {
	return fmt.Sprintf("(%d,%d)", c.Col, c.Row)
}

func (c Coords) IsEqual(x Coords) bool {
	return c.Row == x.Row && c.Col == x.Col
}

func (c Coords) InBounds(minRow, maxRow, minCol, maxCol int) bool {
	return c.Row >= minRow && c.Row <= maxRow && c.Col >= minCol && c.Col <= maxCol
}

func (c Coords) MoveInDir(direction Dir) Coords {
	switch direction {
	case North:
		return c.Up()
	case East:
		return c.Right()
	case South:
		return c.Down()
	case West:
		return c.Left()
	default:
		panic("Invalid direction")
	}
}

func (c Coords) Up() Coords {
	return Coords{
		Row: c.Row - 1,
		Col: c.Col,
	}
}

func (c Coords) Down() Coords {
	return Coords{
		Row: c.Row + 1,
		Col: c.Col,
	}
}

func (c Coords) Left() Coords {
	return Coords{
		Row: c.Row,
		Col: c.Col - 1,
	}
}

func (c Coords) Right() Coords {
	return Coords{
		Row: c.Row,
		Col: c.Col + 1,
	}
}

func (c Coords) ManhattenDistanceTo(target Coords) int {
	return int(math.Abs(float64(c.Row-target.Row)) + math.Abs(float64(c.Col-target.Col)))
}
