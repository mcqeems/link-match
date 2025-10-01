# Magic Matcher - AI-Powered Talent Matching

## Overview

Magic Matcher is an innovative feature that uses AI and semantic search to transform natural language descriptions into personalized talent recommendations. Users can describe their ideal candidate in plain English, and the system will find the best matches using AWS Bedrock AI services.

## Features

- 🤖 **AI-Powered Search**: Convert natural language prompts into intelligent talent searches
- 🔍 **Semantic Search**: Find candidates based on meaning, not just keywords
- 💝 **Tinder-Style Matching**: Swipe through candidates with smooth animations
- 📊 **Match Explanations**: AI-generated explanations for why each candidate is a good fit
- 📈 **Similarity Scoring**: Percentage-based matching scores
- 📱 **Mobile-Friendly**: Responsive design that works on all devices
- 📚 **Match History**: Track all your previous searches and decisions

## Architecture

### Backend Components

1. **Database Schema** (`prisma/schema.prisma`)
   - `match_requests`: Store user search prompts
   - `talent_matches`: Store AI-generated matches
   - `match_swipes`: Track user swipe decisions
   - `profile_embeddings`: Vector storage for semantic search

2. **AWS Bedrock Integration** (`src/lib/bedrock.ts`)
   - Text generation using Claude 3 Haiku
   - Embedding generation using Titan Embeddings
   - Prompt analysis and enhancement

3. **Semantic Search** (`src/lib/semantic-search.ts`)
   - Vector similarity calculations
   - Profile embedding generation
   - Cosine similarity matching

4. **API Routes**
   - `POST /api/magic-match`: Generate matches from prompts
   - `POST /api/magic-match/swipe`: Record swipe decisions
   - `GET /api/magic-match/matches`: Retrieve match details
   - `GET /api/magic-match/history`: Get search history

### Frontend Components

1. **MagicMatcherPage** (`src/components/magic-matcher/MagicMatcherPage.tsx`)
   - Main container with navigation
   - State management for different views

2. **PromptInput** (`src/components/magic-matcher/PromptInput.tsx`)
   - Natural language input interface
   - Example prompts and suggestions

3. **TalentCards** (`src/components/magic-matcher/TalentCards.tsx`)
   - Swipeable card interface
   - Smooth animations and gestures
   - Match information display

4. **MatchHistory** (`src/components/magic-matcher/MatchHistory.tsx`)
   - Historical search results
   - Statistics and analytics

## AWS Bedrock Setup

### Prerequisites

1. **AWS Account**: You need an active AWS account
2. **IAM Permissions**: Proper permissions for Bedrock services
3. **Model Access**: Request access to required models

### Required AWS Bedrock Models

#### 1. Amazon Titan Embeddings G1 - Text

- **Model ID**: `amazon.titan-embed-text-v1`
- **Purpose**: Generate vector embeddings for semantic search
- **Input**: Text content (profile descriptions, skills, etc.)
- **Output**: 1536-dimensional vector embeddings

#### 2. Anthropic Claude 3 Haiku

- **Model ID**: `anthropic.claude-3-haiku-20240307-v1:0`
- **Purpose**: Generate match explanations and analyze prompts
- **Input**: Structured prompts with talent and requirement data
- **Output**: Human-readable explanations and analysis

### Step-by-Step AWS Setup

#### 1. Request Model Access

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigate to "Model access" in the left sidebar
3. Click "Request model access"
4. Select the following models:
   - ✅ Amazon Titan Embeddings G1 - Text
   - ✅ Anthropic Claude 3 Haiku
5. Submit the request (usually approved instantly)

#### 2. Create IAM Policy

Create an IAM policy with the following JSON:

\`\`\`json
{
"Version": "2012-10-17",
"Statement": [
{
"Effect": "Allow",
"Action": [
"bedrock:InvokeModel",
"bedrock:InvokeModelWithResponseStream"
],
"Resource": [
"arn:aws:bedrock:*::foundation-model/amazon.titan-embed-text-v1",
"arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
]
}
]
}
\`\`\`

#### 3. Create IAM User or Role

1. Create a new IAM user for the application
2. Attach the policy created above
3. Generate access keys for the user
4. Store the credentials securely

#### 4. Configure Environment Variables

Add the following to your `.env` file:

\`\`\`env

# AWS Bedrock Configuration

AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your_access_key_here"
AWS_SECRET_ACCESS_KEY="your_secret_key_here"
\`\`\`

### Region Availability

AWS Bedrock is available in the following regions:

- `us-east-1` (N. Virginia) - **Recommended**
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)
- `ap-northeast-1` (Tokyo)

## Installation and Setup

### 1. Install Dependencies

\`\`\`bash
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/credential-providers
\`\`\`

### 2. Run Database Migration

\`\`\`bash
npx prisma migrate dev --name add_magic_matcher_tables
\`\`\`

### 3. Generate Profile Embeddings

Before using the Magic Matcher, generate embeddings for existing profiles:

\`\`\`bash
npm run generate-embeddings
\`\`\`

### 4. Environment Configuration

Copy `.env.example` to `.env` and fill in your AWS credentials:

\`\`\`bash
cp .env.example .env
\`\`\`

## Usage Flow

### 1. User Input

- User navigates to `/magic-matcher`
- Enters a natural language description of their ideal talent
- System validates and processes the input

### 2. AI Processing

- AWS Bedrock analyzes the prompt
- Extracts key skills, experience level, and requirements
- Enhances the search query with synonyms and related terms

### 3. Semantic Search

- Generates embedding for the enhanced prompt
- Compares against stored profile embeddings
- Calculates similarity scores using cosine similarity

### 4. Match Generation

- AI generates personalized explanations for each match
- Creates talent match records in the database
- Returns ranked results to the frontend

### 5. Interactive Matching

- Users swipe through candidates Tinder-style
- Right swipe = interested, Left swipe = not interested
- Swipes are recorded and can create conversations

### 6. History and Analytics

- All searches and decisions are stored
- Users can review past matches and decisions
- Statistics show matching success rates

## Example Prompts

Here are some example prompts that work well with Magic Matcher:

- "I need a senior React developer with TypeScript experience"
- "Looking for a UI/UX designer with mobile app experience"
- "Need a data scientist with Python and machine learning skills"
- "Seeking a marketing specialist with social media expertise"
- "Looking for a DevOps engineer with AWS and Docker experience"

## API Endpoints

### POST `/api/magic-match`

Generate matches from a natural language prompt.

**Request:**
\`\`\`json
{
"prompt": "I need a senior React developer with TypeScript experience"
}
\`\`\`

**Response:**
\`\`\`json
{
"match_request_id": 123,
"matches": [...],
"total_matches": 15,
"prompt_analysis": {...}
}
\`\`\`

### POST `/api/magic-match/swipe`

Record a swipe decision.

**Request:**
\`\`\`json
{
"talent_match_id": 456,
"swipe_direction": "right"
}
\`\`\`

### GET `/api/magic-match/matches?match_request_id=123`

Get detailed match results.

### GET `/api/magic-match/history`

Get user's search history with statistics.

## Performance Considerations

### 1. Embedding Generation

- Embeddings are generated asynchronously
- Rate limiting: 200ms delay between API calls
- Batch processing for initial setup

### 2. Vector Search

- In-memory cosine similarity (suitable for small datasets)
- For production: Consider using AWS OpenSearch or Pinecone

### 3. Caching

- Profile embeddings are cached in the database
- AI explanations are generated fresh for each search

## Cost Estimates

### AWS Bedrock Pricing (us-east-1)

#### Titan Embeddings G1 - Text

- **Input**: $0.0001 per 1K tokens
- **Example**: 100 profiles × 500 tokens = 50K tokens = $0.005

#### Claude 3 Haiku

- **Input**: $0.00025 per 1K tokens
- **Output**: $0.00125 per 1K tokens
- **Example**: 20 matches × 300 tokens = 6K tokens input + 4K tokens output = $0.0065

**Total cost per search**: ~$0.01 - $0.02

## Troubleshooting

### Common Issues

1. **Model Access Denied**
   - Ensure models are approved in Bedrock console
   - Check IAM permissions

2. **Embedding Generation Fails**
   - Verify AWS credentials
   - Check region configuration
   - Monitor rate limits

3. **No Search Results**
   - Ensure profiles have embeddings generated
   - Check database connections
   - Verify embedding similarity thresholds

### Debug Mode

Enable debug logging by setting:
\`\`\`env
NODE_ENV=development
\`\`\`

## Future Enhancements

1. **Vector Database Integration**: Replace in-memory search with proper vector DB
2. **Advanced Filtering**: Add filters for location, experience level, etc.
3. **Machine Learning**: Improve matching based on user feedback
4. **Real-time Updates**: WebSocket support for live match updates
5. **Mobile App**: React Native implementation

## Security Considerations

1. **AWS Credentials**: Never expose credentials in frontend code
2. **Rate Limiting**: Implement proper rate limiting for API endpoints
3. **Data Privacy**: Ensure compliance with data protection regulations
4. **Input Validation**: Sanitize all user inputs before processing

## Contributing

When contributing to Magic Matcher:

1. Follow the existing code style
2. Add unit tests for new features
3. Update documentation
4. Test with real AWS Bedrock integration
5. Consider performance implications

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review AWS Bedrock documentation
3. Open GitHub issues for bugs
4. Contact the development team for feature requests
