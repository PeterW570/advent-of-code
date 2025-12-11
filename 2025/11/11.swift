import Foundation

let isExample = CommandLine.arguments.contains("--example")
let inputPath = "input\(isExample ? ".example" : "").txt"

func readInput(at path: String) -> String {
    do {
        let url = URL(fileURLWithPath: path)
        return try String(contentsOf: url, encoding: .utf8)
    } catch {
        fputs("Error: Failed to read \(path): \(error)\n", stderr)
        exit(1)
    }
}

struct Server {
    let id: String
    let connections: [String]
}

struct State: Hashable {
    let serverId: String
    let hasDac: Bool
    let hasFft: Bool
}

func solve() -> String {
    let input = readInput(at: inputPath)
    let servers =
        input
        .split(whereSeparator: \.isNewline)
        .compactMap { line -> Server? in
            let parts = line.split(separator: ": ")
            guard parts.count == 2 else { return nil }
            let id = String(parts[0])
            let connections = parts[1].trimmingCharacters(in: .whitespaces).split(
                whereSeparator: \.isWhitespace
            ).map { String($0) }
            return Server(id: id, connections: connections)
        }

    let serversByID = Dictionary(uniqueKeysWithValues: servers.map { ($0.id, $0) })

    var memo: [State: Int] = [:]

    func countPaths(from serverId: String, hasDac: Bool, hasFft: Bool) -> Int {
        if serverId == "out" {
            return (hasDac && hasFft) ? 1 : 0
        }

        let state = State(serverId: serverId, hasDac: hasDac, hasFft: hasFft)
        if let cached = memo[state] {
            return cached
        }

        guard let server = serversByID[serverId] else {
            memo[state] = 0
            return 0
        }

        var count = 0
        for connId in server.connections {
            let newHasDac = hasDac || (connId == "dac")
            let newHasFft = hasFft || (connId == "fft")
            count += countPaths(from: connId, hasDac: newHasDac, hasFft: newHasFft)
        }

        memo[state] = count
        return count
    }

    let solution = countPaths(from: "svr", hasDac: false, hasFft: false)

    return "Solution: \(solution)"
}

print(solve())
