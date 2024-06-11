import { createClient } from "@/utils/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// api/chat/[chatId]/file/[fileName]: returns a file belonging to a user chat
export async function GET(
  request: Request,
  { params }: { params: { chatId: string, fileName: string } }
) {
  try {
    // get session
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (!data.session) 
      throw new Error("Session not found.")

    // get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user)
      throw new AuthError("Unauthorized")
    const userId = user.id

    // fetch pdf
    const res = await fetch(`${process.env.SUPABASE_FILE_ENDPOINT}/${userId}/${params.chatId}/${params.fileName}`, { 
      headers: {
        'Authorization': `Bearer ${data.session?.access_token}`
      },
    });
    // TODO: return streaming response from fetch
    return new Response(await res.arrayBuffer(), { headers: { 'content-type': 'application/pdf' } });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ response: "Something went wrong." }, { status: 404 }) 
  }
}