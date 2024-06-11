import { createClient } from "@/utils/supabase/server";
import { HuggingFaceInferenceAPI, Settings, VectorStoreIndex } from "llamaindex";
import { PineconeVectorStore } from "llamaindex/storage/vectorStore/PineconeVectorStore";
import { NextRequest, NextResponse } from "next/server";
import { AuthError } from "@supabase/supabase-js";
import { extractFinalResponse } from "@/utils/helpers";
import { HuggingFaceAPIEmbedding } from "@/app/lib/HuggingFaceAPIEmbedding";

// global llamaindex settings
Settings.llm = new HuggingFaceInferenceAPI({
    accessToken: process.env.HF_TOKEN!,
    model: process.env.MODEL_NAME!,
});
Settings.embedModel = new HuggingFaceAPIEmbedding({
    accessToken: process.env.HF_TOKEN!,
    model: process.env.EMBED_MODEL!
})

// api/chat/[chatId]: returns response against query from LlamaIndex
export async function POST(
    request: NextRequest,
    { params }: { params: { chatId: string } }
  ) {
    try {
      // get user from supabase session
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user)
        throw new AuthError("Unauthorized")
      const userId = user.id
      const chatId = params.chatId
      
      // get query from request
      const res = await request.json()
      const query = res.query

      // get index from pinecone vector store
      const pcvs = new PineconeVectorStore();
      const index = await VectorStoreIndex.fromVectorStore(pcvs);

      // get query response from query engine
      const queryEngine = await index.asQueryEngine({
          preFilters: {
            filters: [
              {
                key: "userId",
                value: userId,
                filterType: "ExactMatch",
              },
              {
                key: "chatId",
                value: chatId,
                filterType: "ExactMatch",
              },
            ],
          },
          similarityTopK: 3,
      });
      const answer = await queryEngine.query({ query: query! });
      const finalAnswer = extractFinalResponse(answer.response)
      console.log(answer)
      return NextResponse.json({ response: finalAnswer }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ response: "Something went wrong" }, { status: 500 })
    }
  }