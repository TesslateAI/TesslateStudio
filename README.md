# Tesslate Studio

Tesslate Studio is an intelligent development environment that combines AI-powered assistance with a modern code editor. It features real-time chat interactions with various AI models, code generation, and project management capabilities.

![image](https://github.com/user-attachments/assets/7c811991-9092-4285-9f36-159fe74dec76)


## Features

- 🤖 Multiple AI Model Support
  - OpenAI integration
  - Custom model support (UIGEN-T1, Claude, Llama, Mistral, Gemini)
  - Model-specific responses and capabilities

- 💻 Code Editor
  - Syntax highlighting
  - Multiple language support (HTML, CSS, JavaScript, JSX)
  - Real-time preview
  - Code artifact management

- 📁 Project Management
  - Create and organize projects
  - Drag-and-drop chat organization
  - Project-specific conversations

- 📱 Responsive Design
  - Desktop and mobile support
  - Adaptive layout
  - Touch-friendly interface

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (version 14.0.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tesslatestudio.git
cd tesslatestudio
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

This will launch the application in development mode with hot reload capabilities.

### Platform-Specific Notes

#### Windows
- The application should work out of the box
- Use PowerShell or Command Prompt for running commands
- Default project location: `%USERPROFILE%\Documents\Projects`

#### macOS/Linux
- Use Terminal for running commands
- Default project location: `~/Documents/Projects`
- If you encounter EACCES permission errors:
```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```plaintext
VITE_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.featherless.ai/v1
```

### ESLint Configuration

The project uses ESLint for code quality. To enable TypeScript support:

1. Install TypeScript dependencies:
```bash
npm install --save-dev typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

2. Follow the TypeScript integration guide in the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)

## Known Issues

- Mobile sidebar may require double-tap to close in some browsers
- Code editor performance may vary with large files
- Some AI models may have response latency

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- AI capabilities powered by various language models
