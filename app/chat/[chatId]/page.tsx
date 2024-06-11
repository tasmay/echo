'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import PdfViewer from '@/app/components/PdfViewer';
import Sidebar from '@/app/components/Sidebar';
import ChatWindow from '@/app/components/ChatWindow';
import { listFiles, buildFileUrl } from '../../actions';
import { FileObject } from '@supabase/storage-js'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ChatContainer({ params }: { params: { chatId: string } }) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string>("");
  const [chatId, setId] = useState<string>(params.chatId);
  const [fileList, setFileList] = useState<FileObject[]>([]);
  const [currPdfUrl, setCurrPdfUrl] = useState<string>("");
  const [activeFile, setActiveFile] = useState<string>("");
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      // check (anon) authenticated user
      if (!user) {
        router.push('/')
      }
      setUserId(user!.id)
      // TODO: check if chatId actually belongs to the userId
      // check supabase userid !== chatid
      // if (user && user.id !== params.chatId) {
      //   console.log("Unauthorized.")
      //   router.push('/')
      // }
      listFiles(user!.id, chatId).then((files) => {
        setFileList(files)
      })
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openFile = async (e: any, file: FileObject) => {
    e.preventDefault()
    setIsPdfLoading(true)
    const url = await buildFileUrl(chatId, file.name)
    setCurrPdfUrl(url)
    setIsPdfLoading(false)
    setActiveFile(file.id)
  }

  return (
    <div className="flex flex-row flex-1 overflow-auto w-full h-full">
      <Sidebar fileList={fileList} openFile={openFile} activeFile={activeFile}></Sidebar>
      <PdfViewer url={currPdfUrl} isLoading={isPdfLoading}></PdfViewer>
      <ChatWindow chatId={chatId} />
    </div>
  )
}
