import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var solution = 0

    for line in lines {
        let lineLen = line.count
        var nums = Array(repeating: -1, count: 12)

        for (i, char) in line.enumerated() {
            let remaining = lineLen - i - 1
            guard let num = Int(String(char)) else { continue }

            for (j, storedNum) in nums.suffix(remaining + 1).enumerated() {
                let offset = max(nums.count - (remaining + 1), 0)
                if num > storedNum {
                    nums[j + offset] = num
                    for k in (j + offset + 1)..<nums.count {
                        nums[k] = -1
                    }
                    break
                }
            }
        }

        let joltage = nums.reversed().enumerated().reduce(0) {
            $0 + $1.element * Int(pow(10.0, Double($1.offset)))
        }
        solution += joltage
    }

    return "Solution: \(solution)"
}
