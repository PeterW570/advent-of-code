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

struct Path {
    let visited: Set<String>
    let current: Server
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

    // start at "you"
    guard let startServer = serversByID["you"] else {
        fputs("Error: No server with ID 'you' found\n", stderr)
        exit(1)
    }

    var solution = 0
    var paths = [Path(visited: ["you"], current: startServer)]
    while !paths.isEmpty {
        var newPaths: [Path] = []
        for path in paths {
            for connID in path.current.connections {
                if connID == "out" {
                    solution += 1
                    continue
                }
                guard let nextServer = serversByID[connID] else { continue }
                var newVisited = path.visited
                newVisited.insert(nextServer.id)
                newPaths.append(Path(visited: newVisited, current: nextServer))
            }
        }
        paths = newPaths
    }

    return "Solution: \(solution)"
}

print(solve())
