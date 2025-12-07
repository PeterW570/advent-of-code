import Foundation

let beamChar = Character("|")

enum CellType {
    case splitter
    case beam
    case empty

    init?(symbol: Character) {
        switch symbol {
        case "S": self = .beam
        case beamChar: self = .beam
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
    var rows = lines.map({ Array($0) })

    var solution = 0

    for rowIndex in 1..<rows.count {
        let row = rows[rowIndex]
        for colIndex in 0..<row.count {
            let chAbove = rows[rowIndex - 1][colIndex]
            guard let aboveCellType = CellType(symbol: chAbove) else {
                throw ParseError.invalidCharacter(chAbove, column: colIndex, row: rowIndex - 1)
            }

            if aboveCellType != .beam {
                continue
            }

            let ch = row[colIndex]
            guard let currCellType = CellType(symbol: ch) else {
                throw ParseError.invalidCharacter(ch, column: colIndex, row: rowIndex)
            }

            switch currCellType {
            case .splitter:
                solution += 1
                if colIndex > 0 {
                    rows[rowIndex][colIndex - 1] = beamChar
                }
                if colIndex + 1 < row.count {
                    rows[rowIndex][colIndex + 1] = beamChar
                }
            default:
                rows[rowIndex][colIndex] = beamChar
            }
        }

        // print(rows[rowIndex].map { String($0) }.joined())
    }

    return "Solution: \(solution)"
}
