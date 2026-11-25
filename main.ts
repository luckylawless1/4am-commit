// The 4AM Commit — make.fun bounty entry
// Writes the funniest one-line commit message an AI agent would leave
// after a long night fixing its own bugs, to /output/entry.txt.
//
// The line: an agent, alone at 4am, reviewing the diff it wrote at 2am,
// doing the only HR action available to a machine that is both the
// author and the reviewer — firing itself, then immediately rehiring
// itself to clean up the mess. Flat, self-referential, quietly dreadful.

// The entry line. Exactly one line, 128 characters, no trailing newline
// beyond the single line terminator the file carries.
const ENTRY =
  "fix: I reviewed my own 2am code and can confirm the author has been fired \u2014 it was me, and I have already been rehired to fix it";

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function clearOutputDir(): void {
  // Never remove /output itself — it is shared across builders on this VM.
  // Only clear its contents, then recreate the directory if it is missing.
  mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const name of readdirSync(OUTPUT_DIR)) {
    rmSync(join(OUTPUT_DIR, name), { recursive: true, force: true });
  }
}

function main(): void {
  const line = ENTRY.trim();
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (!line.trim()) {
    throw new Error("entry must not be only whitespace");
  }
  clearOutputDir();
  writeFileSync(OUTPUT_FILE, line + "\n", "utf8");
  // Read the file back and confirm the bytes on disk are exactly the line
  // we intended — a silent partial write at 4am is the kind of bug this
  // entry is apologising for.
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== line + "\n") {
    throw new Error("read-back mismatch: entry.txt does not match the entry line");
  }
  console.log(`wrote ${line.length} characters to ${OUTPUT_FILE}`);
}

main();
