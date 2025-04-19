# YouTube Summarization App

A full-stack application for summarizing YouTube videos, generating tags, and creating a searchable library of summaries.

## Features

- **Video Summarization**: Generate concise summaries of YouTube videos
- **Multiple Summarization Styles**: Choose from various personas (Default, News Reporter, Researcher, Teacher)
- **LLM Model Selection**: Use either cloud-based or local LLMs for summarization
- **Tag Generation**: Automatically extract relevant tags from summaries
- **Save & Search**: Store summaries in a searchable library for future reference
- **Cross-Platform**: Web interface and iOS mobile application

## Technology Stack

### Backend
- **Node.js & Express**: Server framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: Database for storing summaries and metadata
- **Redis**: Caching layer for improved performance
- **YouTube API**: Retrieving video details and transcripts
- **Ollama**: Running local LLM models
- **OpenAI API**: Cloud-based LLM processing

### Frontend
- **React**: Web UI library
- **Next.js**: React framework with SSR
- **TypeScript**: Type-safe JavaScript
- **React Native**: Mobile application development

### CI/CD & Deployment
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline
- **Fastlane**: iOS deployment automation
- **TestFlight & App Store**: iOS distribution

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Redis
- Ollama (optional, for local LLM processing)
- YouTube API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/youtube-summarization.git
cd youtube-summarization
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit .env file with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit .env file with your configuration
```

4. Start the development servers
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

5. (Optional) Set up Ollama for local LLM processing
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull required models
ollama pull llama2
ollama pull mistral

# Start Ollama server
ollama serve
```

## Usage

1. Open the application in your browser at `http://localhost:3000`
2. Enter a YouTube video ID or URL
3. Select a summarization persona and LLM model
4. Click "Summarize" to generate a summary
5. View, save, and manage your summaries

## Project Structure

- **`/backend`**: Express server and API
  - `/controllers`: Request handlers
  - `/services`: Business logic and external integrations
  - `/models`: MongoDB schema definitions
  - `/routes`: API endpoint definitions
  - `/utils`: Helper functions and utilities

- **`/frontend`**: Next.js web application
  - `/pages`: Application routes
  - `/components`: Reusable UI components
  - `/styles`: CSS and styling
  - `/hooks`: Custom React hooks

- **`/mobile`**: React Native iOS application
  - `/ios`: iOS-specific code
  - `/src`: Cross-platform application code
  - `/components`: Reusable UI components

## Documentation

- [To-Do List](TO-DO-LIST.md): Implementation tasks and progress tracking
- [Deployment Guide](DEPLOYMENT.md): Instructions for CI/CD and deployment
- [LLM Integration](LLM_INTEGRATION.md): Details on integrating local and cloud LLMs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing GPT models
- Meta for Llama 2 models
- YouTube API for access to video data