# Convo - A PNG to WebP Converter CLI

This command-line tool allows you to easily convert PNG images to WebP format. It provides an interactive interface for browsing directories, selecting individual PNG files, or converting all PNG files in a directory.

## Features

- Interactive directory browsing
- Convert individual PNG files to WebP
- Batch convert all PNG files in a directory
- User-friendly command-line interface
- Colored output for better readability

## Prerequisites

- Node.js (version 12 or higher recommended)
- pnpm (Node Package Manager)

## Installation

1. Clone this repository or download the source code.
2. Navigate to the project directory.
3. Install the required dependencies:

```
pnpm install
```

## Usage

To run the tool, use the following command:

```
pnpm start
```

Upon launching, you'll be presented with three options to choose your starting location:

1. Downloads folder
2. Desktop folder
3. Custom path

After selecting a starting location, you can:

- Navigate through directories
- Select individual PNG files for conversion
- Choose to convert all PNG files in the current directory

## How It Works

1. The tool starts by prompting you to choose a starting location.
2. It then displays the contents of the selected directory, showing subdirectories and PNG files.
3. You can navigate through directories, select individual PNG files for conversion, or choose to convert all PNG files in the current directory.
4. When converting a single file or all files in a directory, the tool creates WebP versions of the PNG files.
5. Converted files are saved in the same directory as the original files (for single file conversion) or in a new directory named `[original_directory_name]_webp` (for batch conversion).

## Dependencies

- commander: For parsing command-line arguments
- fs: For file system operations
- kolorist: For colored console output
- path: For handling file paths
- prompts: For interactive command-line prompts
- sharp: For image processing and conversion

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
