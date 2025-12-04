import Foundation

public func solve(input: String) -> String {
    let lines = input.split(whereSeparator: \.isNewline).map(String.init)
    var solution = 0

    for line in lines {
        var tens = -1
        var ones = -1

        for char in line.dropLast() {
            let num = Int(String(char))!
            if num > tens {
                tens = num
                ones = -1
            } else if num > ones {
                ones = num
            }
        }

        let last = Int(String(line.last!))!
        if last > ones {
            ones = last
        }

        // print(tens, ones)
        solution += tens * 10 + ones
    }

    return "Solution: \(solution)"
}
