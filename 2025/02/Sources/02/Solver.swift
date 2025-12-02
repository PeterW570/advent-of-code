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

            var repeats = 2
            while repeats <= numStr.count {
                guard numStr.count % repeats == 0 else {
                    repeats += 1
                    continue
                }

                let segment = String.init(numStr.prefix(numStr.count / repeats))

                if numStr == String(repeating: segment, count: repeats) {
                    solution += number
                    break
                }

                repeats += 1
            }
        }
    }

    return "Solution: \(solution)"
}
