// The Swift Programming Language
// https://docs.swift.org/swift-book

import Foundation

// let inputPath = "input.example.txt"
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
struct _6 {
    static func main() {
        let input = readInput(at: inputPath)
        do {
            let answer = try solve(input: input)
            print(answer)
        } catch {
            fputs("Error: \(error)\n", stderr)
            exit(1)
        }
    }
}
