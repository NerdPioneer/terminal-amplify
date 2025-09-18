# Terminal Journal

A terminal-style portfolio journal that logs my technical journey. Built with AWS serverless tools — S3, Lambda, EventBridge, and Amplify — to automate log sync, metadata generation, and secure frontend access.

## 🎯 Project Goals

- **Portfolio Documentation**: Maintain a structured log of technical learning and project work
- **Serverless Architecture**: Demonstrate proficiency with AWS serverless technologies
- **Automated Workflows**: Implement event-driven metadata generation and deployment
- **Professional Presentation**: Create a clean, terminal-inspired interface for showcasing work

## 🏗️ Architecture

### Frontend
- **Technology**: HTML5, CSS3, JavaScript (Vanilla)
- **Hosting**: AWS Amplify
- **Features**: Terminal-style interface, responsive design, interactive file browsing

### Backend
- **Lambda Function**: `generateMetadata.js` - Scans S3 logs and generates metadata.json
- **Storage**: Amazon S3 for log files and metadata
- **Orchestration**: EventBridge for automated processing
- **Deployment**: GitHub Actions + AWS CLI

### Data Flow
1. Markdown log files uploaded to S3 `logs/` prefix
2. EventBridge triggers Lambda function on new file uploads
3. Lambda scans logs, extracts metadata, generates `metadata.json`
4. Frontend fetches metadata to display log index
5. Users can browse and view individual log entries

## 📁 Project Structure

```
terminal-journal/
├── frontend/                 # Static web interface
│   ├── index.html           # Main terminal interface
│   ├── styles.css           # Terminal styling
│   └── script.js            # Interactive functionality
├── lambda/                   # AWS Lambda function
│   ├── generateMetadata.js  # Metadata generation logic
│   └── package.json         # Node.js dependencies
├── logs/                     # Markdown log files
│   ├── 2025-09-01-vpc.md
│   ├── 2025-09-02-lambda-deployment.md
│   └── 2025-09-03-amplify-setup.md
├── metadata/                 # Generated metadata (gitignored)
├── .github/workflows/        # CI/CD pipeline
│   └── deploy.yml
├── amplify.yml              # Amplify build configuration
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Git

### Local Development
1. Clone the repository
2. Navigate to `frontend/` and open `index.html` in a browser
3. For Lambda development, install dependencies:
   ```bash
   cd lambda
   npm install
   ```

### AWS Deployment
1. Create S3 bucket for logs and metadata
2. Deploy Lambda function with appropriate IAM permissions
3. Configure EventBridge rules for automatic triggering
4. Set up Amplify app connected to this repository
5. Configure environment variables in Lambda

## 🔧 Configuration

### Environment Variables
- `LOGS_BUCKET_NAME`: S3 bucket containing log files
- `AWS_REGION`: AWS region for resources

### IAM Permissions
Lambda function requires:
- `s3:GetObject` on logs bucket
- `s3:PutObject` on metadata bucket
- `s3:ListBucket` on logs bucket

## 📝 Log Format

Log files follow this naming convention: `YYYY-MM-DD-topic.md`

Each log includes:
- **Title**: Descriptive heading
- **Date**: Log entry date
- **Topic**: Main subject area
- **Duration**: Time spent
- **Overview**: Brief summary
- **Accomplishments**: What was completed
- **Learnings**: Key insights gained
- **Next Steps**: Future actions
- **Resources**: Links and references

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://your-amplify-app.amplifyapp.com) (when deployed)
- [AWS Architecture Diagram](docs/architecture.md) (coming soon)
- [Deployment Guide](docs/deployment.md) (coming soon)

---

*Built with ❤️ using AWS serverless technologies*
