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
    for line in lines.dropLast() {
        let trimmedLine = line.trimmingCharacters(in: .whitespaces)
        let numbers =
            trimmedLine
            .split(whereSeparator: \.isWhitespace)
            .compactMap { Int($0) }

        for (index, op) in operations.enumerated() {
            guard index < numbers.count else { continue }
            let number = numbers[index]
            switch op {
            case .add:
                sums[index] += number
            case .multiply:
                sums[index] *= number
            }
        }
    }

    let solution = sums.reduce(0, +)

    return "Solution: \(solution)"
}
