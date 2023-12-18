package aoc_utils

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

type Coords struct {
	Row int
	Col int
}

type Dir int

const (
	North Dir = iota + 1
	East
	South
	West
)

func OppositeDir(dir Dir) Dir {
	switch dir {
	case North:
		return South
	case East:
		return West
	case South:
		return North
	case West:
		return East
	default:
		panic("Unexpected dir")
	}
}

func PerpendicularDirs(dir Dir) []Dir {
	switch dir {
	case North:
		return []Dir{East, West}
	case East:
		return []Dir{North, South}
	case South:
		return []Dir{East, West}
	case West:
		return []Dir{North, South}
	default:
		panic("Unexpected dir")
	}
}

func (c Coords) ToString() string {
	return fmt.Sprintf("(%d,%d)", c.Col, c.Row)
}

func StrToCoords(str string) Coords {
	split := strings.Split(str, ",")
	col, err := strconv.Atoi(split[0][1:])
	if err != nil {
		panic("Couldn't parse col")
	}
	row, err := strconv.Atoi(split[1][:len(split[1])-1])
	if err != nil {
		panic("Couldn't parse row")
	}
	return Coords{
		Row: row,
		Col: col,
	}
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

func (c Coords) MoveDistInDir(direction Dir, dist int) Coords {
	switch direction {
	case North:
		return c.UpDist(dist)
	case East:
		return c.RightDist(dist)
	case South:
		return c.DownDist(dist)
	case West:
		return c.LeftDist(dist)
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

func (c Coords) UpDist(dist int) Coords {
	return Coords{
		Row: c.Row - dist,
		Col: c.Col,
	}
}

func (c Coords) Down() Coords {
	return Coords{
		Row: c.Row + 1,
		Col: c.Col,
	}
}

func (c Coords) DownDist(dist int) Coords {
	return Coords{
		Row: c.Row + dist,
		Col: c.Col,
	}
}

func (c Coords) Left() Coords {
	return Coords{
		Row: c.Row,
		Col: c.Col - 1,
	}
}

func (c Coords) LeftDist(dist int) Coords {
	return Coords{
		Row: c.Row,
		Col: c.Col - dist,
	}
}

func (c Coords) Right() Coords {
	return Coords{
		Row: c.Row,
		Col: c.Col + 1,
	}
}

func (c Coords) RightDist(dist int) Coords {
	return Coords{
		Row: c.Row,
		Col: c.Col + dist,
	}
}

func (c Coords) ManhattenDistanceTo(target Coords) int {
	return int(math.Abs(float64(c.Row-target.Row)) + math.Abs(float64(c.Col-target.Col)))
}
