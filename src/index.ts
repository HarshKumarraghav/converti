// src/index.ts

import { program } from "commander";
import fs from "fs";
import { cyan, green, red, yellow, blue, magenta, bold } from "kolorist";
import path from "path";
import prompts from "prompts";
import sharp from "sharp";
import os from "os";

async function convertToWebP(
  inputPath: string,
  outputPath: string
): Promise<void> {
  try {
    await sharp(inputPath).webp().toFile(outputPath);
    console.log(green(`Converted ${bold(inputPath)} to ${bold(outputPath)}`));
  } catch (error) {
    console.error(red(`Error converting ${bold(inputPath)}: ${error}`));
  }
}

async function processDirectory(
  inputDir: string,
  outputDir: string
): Promise<void> {
  const items = fs.readdirSync(inputDir);

  for (const item of items) {
    const inputPath = path.join(inputDir, item);
    const stat = fs.statSync(inputPath);

    if (stat.isFile() && path.extname(item).toLowerCase() === ".png") {
      const outputPath = path.join(outputDir, `${path.parse(item).name}.webp`);
      await convertToWebP(inputPath, outputPath);
    }
  }
}

async function browseDirectory(initialDir: string): Promise<string | null> {
  let currentDir = initialDir;

  while (true) {
    const items = fs.readdirSync(currentDir);
    const directories = items.filter((item) =>
      fs.statSync(path.join(currentDir, item)).isDirectory()
    );
    const pngFiles = items.filter(
      (item) => path.extname(item).toLowerCase() === ".png"
    );

    const choices = [
      {
        title: blue(bold("..")),
        value: "..",
        disabled: currentDir === initialDir,
      },
      ...directories.map((dir) => ({
        title: blue(`/${bold(dir)}`),
        value: dir,
      })),
      ...pngFiles.map((file) => ({ title: yellow(file), value: file })),
      {
        title: magenta(bold("Convert all PNGs in this directory")),
        value: "convert_all",
      },
    ];

    const response = await prompts({
      type: "select",
      name: "selection",
      message: cyan("Select a directory, PNG file, or action:"),
      choices,
    });

    if (!response.selection) return null;

    if (response.selection === "..") {
      currentDir = path.dirname(currentDir);
    } else if (response.selection === "convert_all") {
      const outputDir = `${currentDir}_webp`;
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      await processDirectory(currentDir, outputDir);
      console.log(
        magenta(
          `Conversion complete! Converted files are in ${bold(outputDir)}`
        )
      );
      return null;
    } else {
      const selectedPath = path.join(currentDir, response.selection);
      if (fs.statSync(selectedPath).isDirectory()) {
        currentDir = selectedPath;
      } else {
        // It's a PNG file
        const outputPath = path.join(
          path.dirname(selectedPath),
          `${path.parse(response.selection).name}.webp`
        );
        await convertToWebP(selectedPath, outputPath);
        console.log(magenta("Conversion complete!"));
        return null;
      }
    }
  }
}

async function main(): Promise<void> {
  const homeDir = os.homedir();
  const downloadsDir = path.join(homeDir, "Downloads");
  const desktopDir = path.join(homeDir, "Desktop");

  const initialChoice = await prompts({
    type: "select",
    name: "location",
    message: cyan("Choose a location to start:"),
    choices: [
      { title: yellow(bold("Downloads")), value: "downloads" },
      { title: magenta(bold("Desktop")), value: "desktop" },
      { title: blue(bold("Custom path")), value: "custom" },
    ],
  });

  let startDir: string;

  switch (initialChoice.location) {
    case "downloads":
      startDir = downloadsDir;
      break;
    case "desktop":
      startDir = desktopDir;
      break;
    case "custom":
      const customPath = await prompts({
        type: "text",
        name: "path",
        message: cyan("Enter the custom path:"),
      });
      startDir = path.resolve(customPath.path);
      break;
    default:
      console.error(red("Invalid choice. Exiting."));
      process.exit(1);
  }

  if (!fs.existsSync(startDir)) {
    console.error(
      red(`The directory ${bold(startDir)} does not exist. Exiting.`)
    );
    process.exit(1);
  }

  console.log(green(`Starting in: ${bold(startDir)}`));
  await browseDirectory(startDir);
}

main().catch((error) => {
  console.error(red(`An error occurred: ${bold(error.message)}`));
  process.exit(1);
});
