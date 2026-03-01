#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";

interface FlattenedEnv {
  [key: string]: any;
}

const args: string[] = process.argv.slice(2);
const inputFile: string | undefined = args.find((arg) => !arg.startsWith("--"));
const prefixArg: string | undefined = args.find((arg) =>
  arg.startsWith("--prefix="),
);
const noFlatten: boolean = args.includes("--no-flatten");

const prefix: string = prefixArg
  ? prefixArg.split("=")[1].replace(/['"]+/g, "")
  : "";

if (!inputFile) {
  console.error(
    '❌ Usage: convert-json-env <file.json> [--prefix="export "] [--no-flatten]',
  );
  process.exit(1);
}

/**
 * Recursive Flattener
 */
function flattenObject(
  obj: any,
  parentKey: string = "",
  res: FlattenedEnv = {},
): FlattenedEnv {
  for (let key in obj) {
    const propName = parentKey
      ? `${parentKey}_${key.toUpperCase()}`
      : key.toUpperCase();

    if (Array.isArray(obj[key])) {
      obj[key].forEach((val: any, i: number) => {
        flattenObject({ [`${i}`]: val }, propName, res);
      });
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

/**
 * Simple Formatter (No flattening)
 */
function simpleFormat(obj: any): FlattenedEnv {
  const res: FlattenedEnv = {};
  for (let key in obj) {
    res[key.toUpperCase()] = obj[key];
  }
  return res;
}

function run(): void {
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
    const dataToProcess = noFlatten ? simpleFormat(json) : flattenObject(json);

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
  } catch (e: any) {
    console.error("❌ Error:", e.message);
  }
}

run();
