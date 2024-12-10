import {
	dirname,
	fromFileUrl,
	join,
} from "https://deno.land/std@0.167.0/path/posix.ts";

import { solve } from "./solver.ts";

const _dirname = dirname(fromFileUrl(import.meta.url));
const input = await Deno.readTextFile(join(_dirname, "../input.txt"));

console.log(solve(input.trim()));
