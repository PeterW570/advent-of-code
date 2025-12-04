import Foundation

public func solve(input: String) -> String {
    var lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var solution = 0

    let rowCount = lines.count

    var nextLines: [String] = []
    var removed = 0

    while true {
        nextLines = []
        removed = 0

        for (row, line) in lines.enumerated() {
            var newRow = ""
            let colCount = line.count

            for (col, char) in line.enumerated() {
                if char == "." {
                    newRow += "."
                    continue
                }
                var adjacentRolls = 0
                for dRow in -1...1 {
                    for dCol in -1...1 {
                        if dRow == 0 && dCol == 0 {
                            continue
                        }
                        let newRow = row + dRow
                        let newCol = col + dCol
                        if newRow >= 0 && newRow < rowCount && newCol >= 0 && newCol < colCount {
                            let index = line.index(line.startIndex, offsetBy: newCol)
                            if lines[newRow][index] == "@" {
                                adjacentRolls += 1
                            }
                        }
                    }
                }

                if adjacentRolls < 4 {
                    solution += 1
                    removed += 1
                    newRow += "."
                } else {
                    newRow += "@"
                }
            }
            nextLines.append(newRow)
        }

        if removed == 0 {
            break
        }

        lines = nextLines
    }

    return "Solution: \(solution)"
}
