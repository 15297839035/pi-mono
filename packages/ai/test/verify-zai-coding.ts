/**
 * Quick verification script for the zai-coding provider.
 *
 * Usage:
 *   ZAI_API_KEY=<your-key> npx tsx packages/ai/test/verify-zai-coding.ts
 */

import { complete, getModel } from "../src/index.js";
import type { Context } from "../src/types.js";

async function main() {
	const apiKey = process.env.ZAI_API_KEY;
	if (!apiKey) {
		console.error("Error: ZAI_API_KEY environment variable is not set.");
		process.exit(1);
	}

	const model = getModel("zai-coding", "glm-5-turbo");
	if (!model) {
		console.error("Error: getModel('zai-coding', 'glm-5-turbo') returned undefined.");
		process.exit(1);
	}

	console.log("Model resolved:");
	console.log(`  id:         ${model.id}`);
	console.log(`  provider:   ${model.provider}`);
	console.log(`  baseUrl:    ${model.baseUrl}`);
	console.log(`  api:        ${model.api}`);
	console.log(`  reasoning:  ${model.reasoning}`);
	console.log(`  input:      ${model.input}`);
	console.log(`  context:    ${model.contextWindow}`);
	console.log(`  maxTokens:  ${model.maxTokens}`);
	console.log();

	console.log("Sending a simple prompt...");
	const context: Context = {
		systemPrompt: "You are a helpful assistant. Be concise.",
		messages: [{ role: "user", content: "Say hello in one sentence.", timestamp: Date.now() }],
	};

	const response = await complete(model, context, { apiKey });

	if (response.errorMessage) {
		console.error(`\nError: ${response.errorMessage}`);
		process.exit(1);
	}

	console.log("Response:");
	for (const block of response.content) {
		if (block.type === "text") {
			console.log(`  ${block.text}`);
		}
	}

	console.log();
	console.log("Success! zai-coding provider is working.");
	console.log(
		`  usage: input=${response.usage.input}, output=${response.usage.output}, totalTokens=${response.usage.totalTokens}`,
	);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
