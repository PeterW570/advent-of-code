import Foundation

enum CellType {
    case start
    case splitter
    case beam
    case empty

    init?(symbol: Character) {
        switch symbol {
        case "S": self = .start
        case "|": self = .beam
        case "^": self = .splitter
        case ".": self = .empty
        default: return nil
        }
    }
}

enum ParseError: Error, CustomStringConvertible {
    case invalidCharacter(Character, column: Int, row: Int)

    var description: String {
        switch self {
        case .invalidCharacter(let ch, let col, let row):
            return "Invalid character '\(ch)' at column \(col), row \(row)"
        }
    }
}

public func solve(input: String) throws -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    let rows = lines.map(Array.init)

    var previousRow = Array(repeating: 1, count: rows[0].count)

    var solution = 0

    rowLoop: for (revRowIndex, row) in rows.reversed().enumerated() {
        let rowIndex = rows.count - 1 - revRowIndex
        var rowCounts = previousRow

        for colIndex in 0..<row.count {
            let ch = row[colIndex]
            guard let currCellType = CellType(symbol: ch) else {
                throw ParseError.invalidCharacter(ch, column: colIndex, row: rowIndex)
            }

            switch currCellType {
            case .start:
                solution = rowCounts[colIndex]
                break rowLoop
            case .splitter:
                let leftCount = colIndex > 0 ? rowCounts[colIndex - 1] : 0
                let rightCount = colIndex + 1 < row.count ? rowCounts[colIndex + 1] : 0
                rowCounts[colIndex] = leftCount + rightCount
            case .beam, .empty:
                break
            }
        }

        previousRow = rowCounts
    }

    return "Solution: \(solution)"
}
