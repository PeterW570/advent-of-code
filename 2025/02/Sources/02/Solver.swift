import Foundation

public func solve(input: String) -> String {
    let ranges = input.split(separator: ",").map(String.init)
    var solution = 0

    for range in ranges {
        let parts = range.split(separator: "-").map(String.init)
        guard parts.count == 2,
            let start = Int(parts[0]),
            let end = Int(parts[1])
        else {
            fputs("Error: Invalid range format in input\n", stderr)
            exit(1)
        }

        for number in start...end {
            let numStr = String(number)
            guard numStr.count % 2 == 0 else {
                continue
            }

            let firstHalf = numStr.prefix(numStr.count / 2)
            let secondHalf = numStr.suffix(numStr.count / 2)

            if firstHalf == secondHalf {
                solution += number
            }
        }
    }

    return "Solution: \(solution)"
}
