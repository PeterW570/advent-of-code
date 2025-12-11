import Foundation

let isExample = CommandLine.arguments.contains("--example")
let inputPath = "input\(isExample ? ".example" : "").txt"

func readInput(at path: String) -> String {
    let url = URL(fileURLWithPath: path)
    guard let contents = try? String(contentsOf: url, encoding: .utf8) else {
        fatalError("Failed to read \(path)")
    }
    return contents
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

struct PathFinder {
    let serversByID: [String: Server]
    private var memo: [State: Int] = [:]

    init(servers: [Server]) {
        self.serversByID = Dictionary(uniqueKeysWithValues: servers.map { ($0.id, $0) })
    }

    mutating func countPaths(from serverId: String, hasDac: Bool = false, hasFft: Bool = false)
        -> Int
    {
        if serverId == "out" {
            return (hasDac && hasFft) ? 1 : 0
        }

        let state = State(serverId: serverId, hasDac: hasDac, hasFft: hasFft)
        if let cached = memo[state] {
            return cached
        }

        guard let server = serversByID[serverId] else {
            return 0
        }

        let count = server.connections.reduce(0) { total, connId in
            total
                + countPaths(
                    from: connId,
                    hasDac: hasDac || connId == "dac",
                    hasFft: hasFft || connId == "fft"
                )
        }

        memo[state] = count
        return count
    }
}

func parseServers(from input: String) -> [Server] {
    input.split(separator: "\n").compactMap { line in
        let parts = line.split(separator: ":", maxSplits: 1)
        guard parts.count == 2 else { return nil }

        let id = parts[0].trimmingCharacters(in: .whitespaces)
        let connections = parts[1]
            .split(separator: " ")
            .map { $0.trimmingCharacters(in: .whitespaces) }

        return Server(id: id, connections: connections)
    }
}

func solve() -> Int {
    let input = readInput(at: inputPath)
    let servers = parseServers(from: input)

    var finder = PathFinder(servers: servers)
    return finder.countPaths(from: "svr")
}

print("Solution: \(solve())")
