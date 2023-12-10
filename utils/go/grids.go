package aoc_utils

import "fmt"

type Coords struct {
	Row int
	Col int
}

func (c Coords) ToString() string {
	return fmt.Sprintf("(%d,%d)", c.Col, c.Row)
}

func (c Coords) IsEqual(x Coords) bool {
	return c.Row == x.Row && c.Col == x.Col
}

func (c Coords) InBounds(minRow, maxRow, minCol, maxCol int) bool {
	return c.Row >= minRow && c.Row <= maxRow && c.Col >= minCol && c.Col <= maxCol
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
