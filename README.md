# YouTube Video Summarization

A modern web application that allows users to get AI-generated summaries of YouTube videos.

## Features

- 🎥 Input any YouTube video URL
- 📝 Generate concise summaries using AI
- 💾 Save summaries for later reference
- 🚀 Fast and responsive user interface

## Technology Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB for data storage
- Redis for caching
- YouTube Data API for video information
- OpenAI API for generating summaries

### Frontend
- Next.js with React
- TypeScript
- Tailwind CSS for styling
- SWR for data fetching

### Infrastructure
- Docker for containerization
- Docker Compose for orchestration

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- YouTube API Key
- OpenAI API Key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/heegul/youtube-summarization.git
cd youtube-summarization
```

2. **Set up environment variables**

Copy the example environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Update the environment variables in both files with your API keys and configuration.

3. **Start the application with Docker Compose**

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Development

For local development without Docker:

1. **Backend:**

```bash
cd backend
npm install
npm run dev
```

2. **Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

For deployment options and instructions, please refer to the [DEPLOYMENT.md](DEPLOYMENT.md) file.

## Project Structure

```
├── backend/             # Express backend API
│   ├── src/             # Source code
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utility functions
│   │   └── server.ts    # Express app setup
│   ├── tests/           # Test files
│   └── Dockerfile       # Backend Docker configuration
├── frontend/           # Next.js frontend
│   ├── components/      # React components
│   ├── pages/           # Next.js pages
│   ├── styles/          # CSS styles
│   ├── utils/           # Utility functions
│   ├── __tests__/       # Test files
│   └── Dockerfile       # Frontend Docker configuration
└── docker-compose.yml   # Docker Compose configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
