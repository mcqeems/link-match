import { config } from 'dotenv';
import { BedrockClient, ListFoundationModelsCommand } from '@aws-sdk/client-bedrock';

// Load environment variables
config();

async function listAvailableModels() {
  console.log('Checking available Bedrock models...');

  const client = new BedrockClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  try {
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);

    console.log('\n✅ Available Models:');
    response.modelSummaries?.forEach((model: any) => {
      console.log(`- ${model.modelId} (${model.modelName})`);
    });

    // Check for our required models
    const requiredModels = ['amazon.titan-embed-text-v2:0', 'anthropic.claude-3-haiku-20240307-v1:0'];

    console.log('\n🔍 Required Models Status:');
    requiredModels.forEach((modelId) => {
      const hasAccess = response.modelSummaries?.some((m: any) => m.modelId === modelId);
      console.log(`${hasAccess ? '✅' : '❌'} ${modelId}`);
    });
  } catch (error: any) {
    console.error('❌ Error listing models:', error.message);
  }
}

listAvailableModels();
