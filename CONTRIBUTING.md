# Contributing to Prism Hire

First off, thank you for considering contributing to Prism Hire! It's people like you that make Prism Hire such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and what behavior you expected**
* **Include screenshots if possible**
* **Include your environment details** (OS, Node.js version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Explain why this enhancement would be useful**
* **List any alternative solutions or features you've considered**

### Pull Requests

* Fill in the required template
* Follow the JavaScript/React style guide
* Include screenshots and animated GIFs in your pull request whenever possible
* End all files with a newline
* Avoid platform-dependent code

## Development Process

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** and test them thoroughly
3. **Add tests** if you've added code that should be tested
4. **Ensure the test suite passes**
5. **Make sure your code lints** (run `npm run lint`)
6. **Issue the pull request**

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/prism-hire.git
cd prism-hire

# Install dependencies
cd server && npm install
cd ../client && npm install
cd ../mobile && npm install

# Set up environment variables
cd ../server
cp .env.example .env
# Edit .env with your credentials

# Start development servers
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Web
cd client && npm run dev

# Terminal 3: Mobile (optional)
cd mobile && npm start
```

## Style Guides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Style Guide

* Use 2 spaces for indentation
* Use semicolons
* Use single quotes for strings
* Prefer `const` over `let`, avoid `var`
* Use arrow functions when possible
* Use async/await over promises when possible

### React/React Native Style Guide

* One component per file
* Use functional components with hooks
* Use PascalCase for component names
* Use camelCase for prop names
* Use meaningful component and variable names

## Project Structure

```
client/          - React web application
mobile/          - React Native mobile app
server/          - Node.js backend API
```

### Component Organization

```
src/
├── components/     - Reusable UI components
├── contexts/       - React Context providers
├── lib/            - Utility functions and helpers
├── pages/          - Page components (routes)
└── styles/         - CSS/styling files
```

## Testing

* Write unit tests for utilities and helpers
* Write integration tests for API endpoints
* Test components with React Testing Library
* Ensure all tests pass before submitting PR

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

Thank you for contributing! 🎉
