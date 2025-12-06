import Foundation

enum Operation {
    case add
    case multiply

    init?(symbol: String) {
        switch symbol {
        case "+":
            self = .add
        case "*":
            self = .multiply
        default:
            return nil
        }
    }
}

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)

    guard let opLine = lines.last else {
        return "No operation line found"
    }
    let operations =
        opLine
        .trimmingCharacters(in: .whitespaces)
        .split(whereSeparator: \.isWhitespace)
        .compactMap { Operation(symbol: String($0)) }

    var sums = operations.map { op -> Int in
        switch op {
        case .add:
            return 0
        case .multiply:
            return 1
        }
    }

    var currentOpIndex = 0
    var numsForCurrentOp: [Int] = []
    let colCount = opLine.count
    for col in 0..<colCount {
        var numForCol = 0
        for line in lines.dropLast() {
            let index = line.index(line.startIndex, offsetBy: col)
            let char = line[index]
            if let digit = char.wholeNumberValue {
                numForCol *= 10
                numForCol += digit
            } else if char == " " {
                continue
            } else {
                fputs("Error: Unexpected character '\(char)' in input\n", stderr)
                exit(1)
            }
        }
        if numForCol > 0 {
            numsForCurrentOp.append(numForCol)
        } else {
            let currentOp = operations[currentOpIndex]
            let result: Int
            switch currentOp {
            case .add:
                result = numsForCurrentOp.reduce(0, +)
            case .multiply:
                result = numsForCurrentOp.reduce(1, *)
            }
            sums[currentOpIndex] = result
            numsForCurrentOp.removeAll()
            currentOpIndex += 1
        }
    }
    if !numsForCurrentOp.isEmpty {
        let currentOp = operations[currentOpIndex]
        let result: Int
        switch currentOp {
        case .add:
            result = numsForCurrentOp.reduce(0, +)
        case .multiply:
            result = numsForCurrentOp.reduce(1, *)
        }
        sums[currentOpIndex] = result
    }

    let solution = sums.reduce(0, +)

    return "Solution: \(solution)"
}
