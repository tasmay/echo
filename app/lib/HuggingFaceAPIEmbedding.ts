import {
    HfInference,
    type Options as HfInferenceOptions,
  } from "@huggingface/inference";

import { BaseEmbedding } from "llamaindex";

const DEFAULT_PARAMS = {
};

export type HFConfig = Partial<typeof DEFAULT_PARAMS> &
  HfInferenceOptions & {
    model: string;
    accessToken: string;
    endpoint?: string;
  };

export class HuggingFaceAPIEmbedding extends BaseEmbedding {
    
    model: string;
    hf: HfInference;

    constructor(init: HFConfig) {
        super();
        const {
            model,
            accessToken,
            endpoint,
            ...hfInferenceOpts
          } = init;

        this.hf = new HfInference(accessToken, hfInferenceOpts);
        this.model = model;
        if (endpoint) this.hf.endpoint(endpoint);
    }
    
    async getTextEmbedding(text: string): Promise<number[]> {
      const start = performance.now()
      const res = await this.hf.featureExtraction({
          model: this.model,
          inputs: text,
      })

      console.log("getTextEmbedding HF", performance.now() - start, "ms")
      return res as number[]
    }

    async getQueryEmbedding(query: string): Promise<number[]> {
      const start = performance.now()
      const res = await this.hf.featureExtraction({
          model: this.model,
          inputs: query,
      })
      console.log("getQueryEmbedding HF", performance.now() - start, "ms")
      return res as number[]
    }

    async getTextEmbeddings(texts: string[]): Promise<Array<number[]>> {
      const start = performance.now()
      const res = await this.hf.featureExtraction({
          model: this.model,
          inputs: texts,
      })
      console.log("getTextEmbeddings (batch) HF", performance.now() - start, "ms")
      return res as number[][]
    }
}