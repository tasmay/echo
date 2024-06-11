import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/server"
import { AuthError } from "@supabase/supabase-js";
import { readPDF } from "@/utils/helpers";
import {
  Document,
  Settings,
  VectorStoreIndex,
  storageContextFromDefaults,
} from "llamaindex";
import { PineconeVectorStore } from "llamaindex/storage/vectorStore/PineconeVectorStore";
import { HuggingFaceAPIEmbedding } from "@/app/lib/HuggingFaceAPIEmbedding";

export const maxDuration = 40;

Settings.embedModel = new HuggingFaceAPIEmbedding({
  accessToken: process.env.HF_TOKEN!,
  model: process.env.EMBED_MODEL!
})

/* 
  * This method validates all files received at the server.
*/
const validateFiles = (files: File[]) => {
  let error = false, errorMsg = ""
  if (files.length === 0 || undefined || null) {
    error = true
    errorMsg = "Number of files should be more than 1."
  } else if (files.length > 3) {
    error = true
    errorMsg = "Number of files should not be more than 3."
  } else if (files.some((file) => file.size > 10*1024*1024)) {
    error = true
    errorMsg = "Each file should be less than 10 MB in size."
  } else {
    error = false
    errorMsg = ""
  }
  if (error)
    throw new Error(errorMsg)
}

/* 
  * This method creates LlamaIndex Document[] object from File[] with relevant metadata
*/
const loadData = async (userId: string, chatId: string, files: File[]) => {
  const start = performance.now();
  const documents: Document[] = []
  if (files != null) {
    for(let i=0; i < files.length; i++) {
      const pages = await readPDF(Buffer.from(await files[i].arrayBuffer()))
      const docs = pages.map((text, page) => {
        const id_ = `${files[i].name}_${page + 1}`;
        const metadata = {
          page_number: page + 1,
          fileName: files[i].name,
          userId: userId,
          chatId: chatId
        };
        console.log("making page", id_)
        return new Document({ text, id_, metadata });
      });
      documents.push(...docs)
    }
  }
  const end = performance.now();
  console.log("created document objects in ", (end - start), "ms")
  return documents
}

/*
  * This method loads the File objects into LlamaIndex Documents while injecting relevant Metadata like
  * chatId and userId into it. Then builds an index, creates embeddings and stores embeddings into Pinecone.
*/
const updateIndex = async (userId: string, chatId: string, files: File[]) => {
  try {
    // load objects from storage and convert them into LlamaIndex Document objects
    const documents = await loadData(userId, chatId, files)

    // create vector store
    const vectorStore = new PineconeVectorStore();
    console.log("vectorStore created - ", vectorStore)
    // create index from all the Documents and store them in Pinecone
    console.log("Creating embeddings...");
    const storageContext = await storageContextFromDefaults({ vectorStore });
    console.log("storageContextFromDefaults done - ", storageContext)
    await VectorStoreIndex.fromDocuments(documents, { storageContext });
    console.log("Embeddings created and stored in Pinecone successfully.",);
  } catch (error: any) {
    console.log("error in updateIndex: ", error)
    throw new Error(error)
  }
}

// upload files to supabase
const uploadFiles = async (userId: string, chatId: string, files: File[]) => {
    try {
      const supabase = createClient() 
      for (let i=0; i < files.length; i++) {
        const { data, error } = await supabase
          .storage
          .from(process.env.STORAGE_BUCKET!)
          .upload(`${userId}/${chatId}/${files[i].name}`, files[i])
          // TODO: persist file metadata to DB: {id, path, fullpath, userid, chatid}
          if (error) throw new Error(error.message)
      }
      console.log("All files uploaded to supabase.")
    } catch (error: any) {
      throw new Error(error)
    }
}

/*
  api/chat endpoint:
  1. validate inputs
  2. generate chatId
  3. update index (inject userid and chatid in metadata)
  4. upload files to supabase
  5. return the generated chatId
*/
export async function POST(request: Request) {
  try {
    // 0. Auth checks
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user)
      throw new AuthError("Unauthorized")
    const userId = user.id

    // 1. Extract files from formData and validate
    const formData = await request.formData()
    const files = formData.getAll("data").filter(f => f instanceof File).map(f => f as File)
    
    validateFiles(files)

    let start = performance.now()

    // 2. generate chatId
    const chatId = uuidv4()

    // 3. update index (inject userid and chatid in metadata)
    await updateIndex(userId, chatId, files)

    console.log("update index took", performance.now() - start, "ms")

    start = performance.now()

    // 4. upload files to supabase
    await uploadFiles(userId, chatId, files)

    console.log("uploadFiles took", performance.now() - start, "ms")

    // 5. return the generated chatId
    return NextResponse.json({ chatId: chatId }, { status: 200 })
    
  } catch (error) {
    // console.log(error)
    if (error instanceof AuthError)
      return NextResponse.json({ response: "Unauthorized user" }, { status: 401 })
    else
      return NextResponse.json({ response: "Bad request" }, { status: 400 })
  }
}