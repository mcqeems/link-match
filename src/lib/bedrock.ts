import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelCommandInput } from '@aws-sdk/client-bedrock-runtime';

// Lazy initialization of Bedrock client
let client: BedrockRuntimeClient | null = null;

// Rate limiting variables
let lastRequestTime = 0;
const REQUEST_DELAY = 1000; // 1 second between requests

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000]; // 2s, 4s, 8s

function getBedrockClient(): BedrockRuntimeClient {
  if (!client) {
    client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'ap-southeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

// Helper function to add delay between requests
async function addRequestDelay(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < REQUEST_DELAY) {
    const delay = REQUEST_DELAY - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  lastRequestTime = Date.now();
}

// Helper function to execute Bedrock command with retry logic
async function executeWithRetry<T>(
  commandFactory: () => InvokeModelCommand,
  parseResponse: (response: any) => T,
  operation: string
): Promise<T> {
  await addRequestDelay();

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const command = commandFactory();
      const response = await getBedrockClient().send(command);
      return parseResponse(response);
    } catch (error: any) {
      const isThrottling = error.name === 'ThrottlingException' || error.$metadata?.httpStatusCode === 429;

      if (isThrottling && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAYS[attempt];
        console.log(`${operation} throttled, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      console.error(`Error in ${operation}:`, error);
      throw new Error(`Failed to ${operation.toLowerCase()}`);
    }
  }

  throw new Error(`Failed to ${operation.toLowerCase()} after ${MAX_RETRIES + 1} attempts`);
}

// Text generation using Claude 3 Haiku or Titan
export async function generateMatchAnalysis(
  prompt: string,
  talentProfile: {
    name: string;
    headline?: string;
    description?: string;
    experiences?: string;
    skills?: string[];
    category?: string;
  }
): Promise<string> {
  const systemPrompt = `Anda adalah ahli pencocokan talenta profesional. Analisis seberapa baik profil talenta cocok dengan kebutuhan perekrut dan berikan penjelasan yang jelas dan ringkas dalam bahasa Indonesia.

Profil Talenta:
- Nama: ${talentProfile.name}
- Headline: ${talentProfile.headline || 'Tidak disebutkan'}
- Deskripsi: ${talentProfile.description || 'Tidak disebutkan'}
- Pengalaman: ${talentProfile.experiences || 'Tidak disebutkan'}
- Skills: ${talentProfile.skills?.join(', ') || 'Tidak disebutkan'}
- Kategori: ${talentProfile.category || 'Tidak disebutkan'}

Kebutuhan Perekrut: ${prompt}

Berikan penjelasan singkat (2-3 kalimat) dalam bahasa Indonesia mengapa talenta ini cocok, fokus pada skills spesifik, pengalaman, atau kualitas yang sesuai dengan kebutuhan. Gunakan bahasa yang natural dan mudah dipahami.`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: systemPrompt,
      },
    ],
  };

  const commandFactory = () =>
    new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

  const parseResponse = (response: any) => {
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  };

  return executeWithRetry(commandFactory, parseResponse, 'Generate match analysis');
}

// Generate embeddings using Titan Embeddings
export async function generateEmbedding(text: string): Promise<number[]> {
  const payload = {
    inputText: text,
  };

  const commandFactory = () =>
    new InvokeModelCommand({
      modelId: 'amazon.titan-embed-text-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

  const parseResponse = (response: any) => {
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.embedding;
  };

  return executeWithRetry(commandFactory, parseResponse, 'Generate embedding');
}

// Enhanced prompt analysis using AI
export async function analyzePromptForTalentSearch(prompt: string): Promise<{
  keywords: string[];
  skills: string[];
  experience_level: string;
  category: string;
  enhanced_search_text: string;
}> {
  const systemPrompt = `Analyze the following talent search prompt and extract key information for matching:

Prompt: "${prompt}"

Extract and return a JSON object with:
1. keywords: Array of important keywords for searching
2. skills: Array of technical skills mentioned
3. experience_level: "junior", "mid", "senior", or "not_specified"
4. category: Best matching category (e.g., "Software Development", "Design", "Marketing", etc.)
5. enhanced_search_text: An enhanced version of the prompt with synonyms and related terms

Respond only with valid JSON.`;

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: systemPrompt,
      },
    ],
  };

  const commandFactory = () =>
    new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

  const parseResponse = (response: any) => {
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const analysis = JSON.parse(responseBody.content[0].text);
    return analysis;
  };

  try {
    return await executeWithRetry(commandFactory, parseResponse, 'Analyze prompt');
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    // Fallback analysis
    return {
      keywords: prompt.split(' ').filter((word) => word.length > 3),
      skills: [],
      experience_level: 'not_specified',
      category: 'General',
      enhanced_search_text: prompt,
    };
  }
}
