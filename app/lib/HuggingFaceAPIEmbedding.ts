import {
    HfInference,
    type Options as HfInferenceOptions,
  } from "@huggingface/inference";

import { BaseEmbedding } from "llamaindex";

export type HFConfig = HfInferenceOptions & {
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
      const res = await this.hf.featureExtraction({
          model: this.model,
          inputs: text,
      })
      return res as number[]
    }

    async getTextEmbeddings(texts: string[]): Promise<Array<number[]>> {
      const res = await this.hf.featureExtraction({
          model: this.model,
          inputs: texts,
      })
      return res as number[][]
    }
}