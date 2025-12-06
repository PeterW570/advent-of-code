import Foundation

enum Operation {
    case add
    case multiply

    init?(symbol: Character) {
        switch symbol {
        case "+": self = .add
        case "*": self = .multiply
        default: return nil
        }
    }
}

enum ParseError: Error, CustomStringConvertible {
    case missingOperationLine
    case invalidCharacter(Character, column: Int, row: Int)
    case mismatchedOperations

    var description: String {
        switch self {
        case .missingOperationLine:
            return "Missing operation line"
        case .invalidCharacter(let ch, let col, let row):
            return "Invalid character '\(ch)' at column \(col), row \(row)"
        case .mismatchedOperations:
            return "Number of value groups does not match operations"
        }
    }
}

public func solve(input: String) throws -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)

    let opLine = lines.last!
    let valueLines = lines.dropLast()

    let operations: [Operation] =
        opLine
        .trimmingCharacters(in: .whitespaces)
        .split(whereSeparator: \.isWhitespace)
        .compactMap { substr in
            guard let ch = substr.first, substr.count == 1 else { return nil }
            return Operation(symbol: ch)
        }

    var results = operations.map { $0 == .add ? 0 : 1 }

    var currentOpIndex = 0
    var numsForCurrentOp: [Int] = []

    let charLines = valueLines.map { Array($0) }
    let colCount = opLine.count

    func flushCurrentOp() throws {
        guard currentOpIndex < operations.count else { throw ParseError.mismatchedOperations }
        let currentOp = operations[currentOpIndex]
        let result: Int
        switch currentOp {
        case .add:
            result = numsForCurrentOp.reduce(0, +)
        case .multiply:
            result = numsForCurrentOp.reduce(1, *)
        }
        results[currentOpIndex] = result
        numsForCurrentOp.removeAll()
        currentOpIndex += 1
    }

    for col in 0..<colCount {
        var numForCol = 0
        var hasDigit = false
        for (rowIndex, row) in charLines.enumerated() {
            let ch = row[col]
            if let digit = ch.wholeNumberValue {
                hasDigit = true
                numForCol = numForCol * 10 + digit
            } else if ch.isWhitespace {
                continue
            } else {
                throw ParseError.invalidCharacter(ch, column: col, row: rowIndex)
            }
        }

        if hasDigit {
            numsForCurrentOp.append(numForCol)
        } else {
            try flushCurrentOp()
        }
    }

    if !numsForCurrentOp.isEmpty {
        try flushCurrentOp()
    }

    let solution = results.reduce(0, +)
    return "Solution: \(solution)"
}
