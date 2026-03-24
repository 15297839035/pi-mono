import { describe, expect, test } from "vitest";
import { getEnvApiKey } from "../src/env-api-keys.js";
import { MODELS } from "../src/models.generated.js";
import { getModel, getModels } from "../src/models.js";

describe("zai-coding provider", () => {
	test("zai-coding is registered as a known provider in MODELS", () => {
		expect("zai-coding" in MODELS).toBe(true);
	});

	test("zai-coding has the same model set as zai", () => {
		const zaiModels = MODELS.zai;
		const zaiCodingModels = MODELS["zai-coding"];
		expect(Object.keys(zaiModels)).toEqual(Object.keys(zaiCodingModels));
	});

	test("zai-coding models use the coding endpoint URL", () => {
		for (const model of Object.values(MODELS["zai-coding"])) {
			expect(model.baseUrl).toBe("https://open.bigmodel.cn/api/coding/paas/v4");
			expect(model.provider).toBe("zai-coding");
		}
	});

	test("zai models use the standard endpoint URL", () => {
		for (const model of Object.values(MODELS.zai)) {
			expect(model.baseUrl).toBe("https://open.bigmodel.cn/api/paas/v4");
			expect(model.provider).toBe("zai");
		}
	});

	test("zai-coding models have zai thinkingFormat compat", () => {
		for (const model of Object.values(MODELS["zai-coding"])) {
			expect(model.compat?.thinkingFormat).toBe("zai");
			expect(model.compat?.supportsDeveloperRole).toBe(false);
		}
	});

	test("getModel returns zai-coding models correctly", () => {
		const glm5 = getModel("zai-coding", "glm-5");
		expect(glm5).toBeDefined();
		expect(glm5!.id).toBe("glm-5");
		expect(glm5!.provider).toBe("zai-coding");
		expect(glm5!.baseUrl).toBe("https://open.bigmodel.cn/api/coding/paas/v4");
	});

	test("getModels returns all zai-coding models", () => {
		const models = getModels("zai-coding");
		expect(models.length).toBeGreaterThan(0);
		for (const model of models) {
			expect(model.provider).toBe("zai-coding");
		}
	});

	test("zai-coding includes all key models", () => {
		const zaiCodingModels = MODELS["zai-coding"];
		const expectedModels = [
			"glm-4.5",
			"glm-4.5-air",
			"glm-4.5-flash",
			"glm-4.5v",
			"glm-4.6",
			"glm-4.6v",
			"glm-4.7",
			"glm-4.7-flash",
			"glm-4.7-flashx",
			"glm-5",
			"glm-5-turbo",
		];
		for (const expected of expectedModels) {
			expect(expected in zaiCodingModels).toBe(true);
		}
	});

	test("zai-coding models share the same costs as zai models", () => {
		const zaiModels = MODELS.zai;
		const zaiCodingModels = MODELS["zai-coding"];
		for (const modelId of Object.keys(zaiModels) as Array<keyof typeof zaiModels>) {
			const zaiModel = zaiModels[modelId];
			const zaiCodingModel = zaiCodingModels[modelId];
			expect(zaiCodingModel.cost).toEqual(zaiModel.cost);
		}
	});

	test("zai-coding models share the same context/maxTokens as zai models", () => {
		const zaiModels = MODELS.zai;
		const zaiCodingModels = MODELS["zai-coding"];
		for (const modelId of Object.keys(zaiModels) as Array<keyof typeof zaiModels>) {
			const zaiModel = zaiModels[modelId];
			const zaiCodingModel = zaiCodingModels[modelId];
			expect(zaiCodingModel.contextWindow).toBe(zaiModel.contextWindow);
			expect(zaiCodingModel.maxTokens).toBe(zaiModel.maxTokens);
		}
	});
});

describe("zai-coding env API key", () => {
	test("zai-coding uses ZAI_API_KEY env var", () => {
		const original = process.env.ZAI_API_KEY;
		process.env.ZAI_API_KEY = "test-zai-key";
		try {
			expect(getEnvApiKey("zai")).toBe("test-zai-key");
			expect(getEnvApiKey("zai-coding")).toBe("test-zai-key");
		} finally {
			if (original === undefined) {
				delete process.env.ZAI_API_KEY;
			} else {
				process.env.ZAI_API_KEY = original;
			}
		}
	});
});
