'use server'
import { createClient } from '@/utils/supabase/server';

export const listFiles = async (userId: string, chatId: string) => {
  console.log("userId = ", userId)
  console.log("chatId = ", chatId)
  const supabase = createClient();
  const { data, error } = await supabase
    .storage
    .from(process.env.STORAGE_BUCKET!)
    .list(`${userId}/${chatId}`, {
      sortBy: { column: 'name', order: 'asc' },
  })
  console.log("list files data: ", data)
  console.log("list files error: ", error)
  if (error)
    throw new Error(error.message)
  return data;
}

export const buildFileUrl = async (chatId: string, fname: string) => {
  return `/api/chat/${chatId}/file/${fname}`
}