import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var solution = 0

    let rowCount = lines.count

    for (row, line) in lines.enumerated() {
        let colCount = line.count

        for (col, char) in line.enumerated() {
            if char == "." {
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
            }
        }
    }

    return "Solution: \(solution)"
}
