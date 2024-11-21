import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { creds } from "./credentials.js";


export const generateSnapshotImage = async (name, sceneDescription, callback) => {
    const client = new BedrockRuntimeClient({ region: "us-east-1", credentials: creds});
    var rand_seed = generate_random_seed(0, 4294967295);
    console.log(sceneDescription);
    const params = {
        contentType: 'application/json',
        accept: '*/*',
        modelId: 'stability.stable-diffusion-xl-v1',
        body: `{
            "text_prompts":[
                {
                    "text":"${prompt}"
                }],
            "cfg_scale":10,
            "seed":${rand_seed},
            "width":640,
            "height":480,
            "steps":50}`,
    };
    try {
        const command = new InvokeModelCommand(params);
        const dataAsU8Array = await client.send(command);
        const jsonString = new TextDecoder().decode(dataAsU8Array.body);
        const bedrock_response = JSON.parse(jsonString)
        var b64Response = bedrock_response.artifacts[0].base64;
        var src = 'data:image/jpg;base64,'+b64Response;
        callback(name, src);
        return bedrock_response;
    } catch (e) {
        throw e;
    }
}

export const generateProfileImage = async (persona, callback) => {
    const client = new BedrockRuntimeClient({ region: "us-east-1", credentials: creds});
    var rand_seed = generate_random_seed(0, 4294967295);
    const prompt = `A single realistic photo of a ${persona.name}, who is ${persona.age} year old, ${persona.gender} ${persona.occupation}`;
    console.log(prompt);
    const params = {
        contentType: 'application/json',
        accept: '*/*',
        modelId: 'stability.stable-diffusion-xl-v1',
        body: `{
            "text_prompts":[
                {
                    "text":"${prompt}"
                }],
            "cfg_scale":10,
            "seed":${rand_seed},
            "width":512,
            "height":512,
            "steps":50}`,
    };
    try {
        const command = new InvokeModelCommand(params);
        const dataAsU8Array = await client.send(command);
        const jsonString = new TextDecoder().decode(dataAsU8Array.body);
        const bedrock_response = JSON.parse(jsonString)
        var b64Response = bedrock_response.artifacts[0].base64;
        var src = 'data:image/jpg;base64,'+b64Response;
        callback(persona.uuid, src);

        return bedrock_response;
    } catch (e) {
        throw e;
    }

}

function generate_random_seed(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}
