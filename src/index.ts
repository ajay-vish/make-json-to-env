#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

interface FlattenedEnv {
  [key: string]: unknown;
}

/**
 * Recursive Flattener
 */
function flattenObject(
  obj: Record<string, unknown>,
  parentKey: string = "",
  res: FlattenedEnv = {},
): FlattenedEnv {
  for (let key in obj) {
    const propName = parentKey
      ? `${parentKey}_${key.toUpperCase()}`
      : key.toUpperCase();

    const value = obj[key];

    if (Array.isArray(value)) {
      value.forEach((val, i: number) => {
        flattenObject({ [`${i}`]: val }, propName, res);
      });
    } else if (typeof value === "object" && value !== null) {
      flattenObject(value as Record<string, unknown>, propName, res);
    } else {
      res[propName] = value;
    }
  }
  return res;
}

/**
 * Simple Formatter (No flattening)
 */
function simpleFormat(obj: Record<string, unknown>): FlattenedEnv {
  const res: FlattenedEnv = {};
  for (let key in obj) {
    res[key.toUpperCase()] = obj[key];
  }
  return res;
}

async function run(): Promise<void> {
  const argv = await yargs(hideBin(process.argv))
    .usage("Usage: $0 <inputFile> [options]")
    .positional("inputFile", {
      describe: "Input JSON file to convert",
      type: "string",
      demandOption: true,
    })
    .option("prefix", {
      alias: "p",
      type: "string",
      default: "",
      description: "Prefix for each environment variable key (e.g., 'export ')",
    })
    .option("no-flatten", {
      type: "boolean",
      default: false,
      description: "Do not flatten nested JSON objects",
    })
    .help()
    .alias("help", "h").argv;

  const { inputFile, prefix, noFlatten } = argv;

  const inputPath = path.resolve(process.cwd(), inputFile!);
  const fileInfo = path.parse(inputPath);
  const outputPath = path.join(fileInfo.dir, `${fileInfo.name}.env`);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputFile}`);
    process.exit(1);
  }

  try {
    const json = JSON.parse(fs.readFileSync(inputPath, "utf8"));

    // Choose strategy based on flag
    const dataToProcess = noFlatten
      ? simpleFormat(json)
      : flattenObject(json);

    const envContent = Object.entries(dataToProcess)
      .map(([key, value]) => {
        let val = value;

        // If no-flatten is on, objects stay objects, so we stringify them
        if (typeof val === "object" && val !== null) {
          val = JSON.stringify(val);
        } else if (val === null) {
          val = "";
        }

        let strVal = String(val);
        if (strVal.includes(" ")) strVal = `"${strVal}"`;

        return `${prefix}${key}=${strVal}`;
      })
      .join("\n");

    fs.writeFileSync(outputPath, envContent);
    console.log(`🚀 Done! Mode: ${noFlatten ? "Simple" : "Recursive Flatten"}`);
    console.log(`✅ Saved to: ${path.basename(outputPath)}`);
  } catch (e) {
    if (e instanceof Error) {
      console.error("❌ Error:", e.message);
    } else {
      console.error("❌ An unknown error occurred:", e);
    }
  }
}

run();
