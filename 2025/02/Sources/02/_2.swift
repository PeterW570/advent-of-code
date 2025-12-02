// The Swift Programming Language
// https://docs.swift.org/swift-book

import Foundation

let inputPath = "input.txt"

func readInput(at path: String) -> String {
    do {
        let url = URL(fileURLWithPath: path)
        return try String(contentsOf: url, encoding: .utf8)
    } catch {
        fputs("Error: Failed to read \(path): \(error)\n", stderr)
        exit(1)
    }
}

@main
struct _2 {
    static func main() {
        let input = readInput(at: inputPath)
        let answer = solve(input: input)
        print(answer)
    }
}
