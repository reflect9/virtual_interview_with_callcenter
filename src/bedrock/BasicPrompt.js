import {
    BedrockRuntimeClient,
    InvokeModelCommand,
  } from "@aws-sdk/client-bedrock-runtime";
import { creds } from "./credentials.js";

const DEFAULT_SETTINGS = {"MODEL_ID":"anthropic.claude-3-sonnet-20240229-v1:0",
"MAX_TOKENS": 2000,
"region":"us-east-1"};

export const executePrompt = async (PROMPT="Hi!", settings=DEFAULT_SETTINGS, callback) => {
    const region = settings.region;
    const client = new BedrockRuntimeClient({ region: region , credentials: creds});

    // Prepare the payload for the model.
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: settings.MAX_TOKENS,
        messages: [{ role: "user", content: [{ type: "text", text: PROMPT }] }],
    };

    // Invoke Claude with the payload and wait for the response.
    console.log(settings);
    console.log(payload);
    const apiResponse = await client.send(
        new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId: settings.MODEL_ID,
        }),
    );

    // Decode and return the response(s)
    const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
    /** @type {ResponseBody} */
    const responseBody = JSON.parse(decodedResponseBody);
    const responses = responseBody.content;

    if (responses.length === 1) {
        console.log(`Response: ${responses[0].text}`);
        callback(responses[0].text);
    } else {
        console.log("Haiku returned multiple responses:");
        console.log(responses);
        callback(responses);
    }

    console.log(`\nNumber of input tokens:   ${responseBody.usage.input_tokens}`);
    console.log(`Number of output tokens: ${responseBody.usage.output_tokens}`);
    return responseBody;
};