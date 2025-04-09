# HTML Editor

## Overview
This project is an HTML editor that features a snap-to-grid functionality, allowing users to create and manipulate HTML elements easily and intuitively.

## Features
- **Snap-to-Grid Functionality**: Align elements to a customizable grid for precise placement.
- **User-Friendly Interface**: A clean and intuitive interface that includes a sidebar for easy access to tools and options.

## Project Structure
```
dotEditor
├── src
│   ├── components
│   │   ├── Editor.tsx
│   │   ├── Grid.tsx
│   │   └── Sidebar.tsx
│   ├── hooks
│   │   └── useSnapToGrid.ts
│   ├── services
│   │   └── aiService.ts
│   ├── styles
│   │   ├── editor.css
│   │   └── grid.css
│   ├── utils
│   │   └── helpers.ts
│   └── index.tsx
├── public
│   ├── index.html
│   └── manifest.json
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd doteditor
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To start the development server, run:
```
npm start
```
Open your browser and navigate to `http://localhost:3000` to access the editor.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
