#!/usr/bin/env node
import { Command } from "commander";
import { convertIastToRus } from "./converter.js";
import fs from "fs";
import path from "path";
import process from "process";

const program = new Command();

program
  .name("iast2rus")
  .description("Convert Sanskrit text from IAST to Russian diacritic notation")
  .version("0.1.0");

program
  .argument("[input]", "Input string or path to file. If omitted, read from stdin.")
  .option("-o, --output <file>", "Write result to a file instead of stdout")
  .action((input: string | undefined, options: { output?: string }) => {
    let raw = "";

    if (input) {
      if (fs.existsSync(input)) {
        raw = fs.readFileSync(input, "utf8");
      } else {
        raw = input;
      }
    } else {
      // Read from stdin synchronously
      raw = fs.readFileSync(0, "utf8");
    }

    const converted = convertIastToRus(raw);

    if (options.output) {
      fs.writeFileSync(path.resolve(options.output), converted, "utf8");
    } else {
      process.stdout.write(converted + "\n");
    }
  });

program.parse(); 