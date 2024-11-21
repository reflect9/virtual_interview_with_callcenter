// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BedrockClient,
  ListFoundationModelsCommand,
} from "@aws-sdk/client-bedrock";
import { creds } from "./credentials.js";

const REGION = "us-east-1";
const client = new BedrockClient({ region: REGION , credentials: creds});

export const listAllFoundationaModels = async () => {
  const command = new ListFoundationModelsCommand({});

  const response = await client.send(command);
  const models = response.modelSummaries;

  // console.log("Listing the available Bedrock foundation models:");

  // for (let model of models) {
  //   console.log("=".repeat(42));
  //   console.log(` Model: ${model.modelId}`);
  //   console.log("-".repeat(42));
  //   console.log(` Name: ${model.modelName}`);
  //   console.log(` Provider: ${model.providerName}`);
  //   console.log(` Model ARN: ${model.modelArn}`);
  //   console.log(` Input modalities: ${model.inputModalities}`);
  //   console.log(` Output modalities: ${model.outputModalities}`);
  //   console.log(` Supported customizations: ${model.customizationsSupported}`);
  //   console.log(` Supported inference types: ${model.inferenceTypesSupported}`);
  //   console.log(` Lifecycle status: ${model.modelLifecycle.status}`);
  //   console.log("=".repeat(42) + "\n");
  // }

  const active = models.filter(
    (m) => m.modelLifecycle.status === "ACTIVE",
  ).length;
  const legacy = models.filter(
    (m) => m.modelLifecycle.status === "LEGACY",
  ).length;

  console.log(
    `There are ${active} active and ${legacy} legacy foundation models in ${REGION}.`,
  );

  return response;
};

