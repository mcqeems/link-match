import { config } from 'dotenv';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Load environment variables
config();

async function testCredentials() {
  console.log('Testing AWS Bedrock credentials...');
  console.log('Region:', process.env.AWS_REGION);
  console.log('Access Key ID:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + '...');

  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  try {
    // Test with a simple embedding generation
    const payload = {
      inputText: 'Hello world test',
    };

    const input = {
      modelId: 'amazon.titan-embed-text-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    };

    console.log('Attempting to call Bedrock...');
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);

    console.log('✅ SUCCESS! Bedrock is working correctly.');
    console.log('Response metadata:', response.$metadata);
  } catch (err) {
    const error = err as any;
    console.error('❌ FAILED! Error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    if (error.name === 'UnauthorizedOperation' || error.message?.includes('not authorized')) {
      console.log('\n🔧 SOLUTION: Check your IAM permissions for Bedrock');
    } else if (error.message?.includes('credential')) {
      console.log('\n🔧 SOLUTION: Check your AWS credentials in .env file');
    } else if (error.message?.includes('region')) {
      console.log('\n🔧 SOLUTION: Check if Bedrock is available in your region');
    }
  }
}

testCredentials();
