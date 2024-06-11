'use client';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client';
import FileUploader from "@/app/components/FileUploader"
import FileCard from "@/app/components/FileCard"
import Error from "@components/Error"

export default function UploadContainer() {

  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const router = useRouter()
  const supabase = createClient();

  const validate = (f: File[]) => {
    if (f.length === 0 || undefined || null) {
      setError(true)
      setErrorMsg("You must upload at least one file.")
      return false
    } else if (files.length + f.length > 3) {
      setError(true)
      setErrorMsg("You must not upload more than 3 files.")
      return false
    } else if (Array.from(f).some((file) => file.size > 10e6)) {
      setError(true)
      setErrorMsg("File size should be less than 10 MB.")
      return false
    } else 
      return true
  }

  const addFiles = (f: File[]) => {
    if (validate(f)) {
      setError(false)
      setErrorMsg("")
      const fileArrayFromList = Array.from(f)
      const newFiles = [...files ,...fileArrayFromList];
      setFiles(newFiles)
    }
  }

  const removeFile = (index: number) => {
    setError(false)
    setErrorMsg("")
    const newFiles = files.filter((item, i) => i !== index)
    setFiles(newFiles)
  }

  const startConversation = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push("/")
    if(files.length > 0) {

      setLoading(true)
      setError(false)
      setErrorMsg("")
      
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append("data", files[i])
      }
      const userid = user?.id
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });
      const result = await res.json()
      console.log(result)
      const chatid = result.chatId
      router.push(`/chat/${chatid}`);
    } else {
      setError(true)
      setErrorMsg("You must upload at least one file.")
    }
  }

  return loading? (
        <div className="flex flex-col w-4/5 p-8 mt-6 items-center justify-center">
          <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-purple-600 fill-purple-600" />
        </div>
  ) 
  : (
    <div className="flex flex-col w-full lg:w-4/5 p-8 mt-6 bg-slate-100 rounded-lg shadow-md">
        <div className="pb-8 font-bold text-center lg:text-left">Upload files</div>
        <FileUploader addFiles={addFiles}></FileUploader>
        { error && <> <Error message={errorMsg}></Error> </> }
        { files.length > 0 ? 
        <div className="mt-6 max-h-48 overflow-y-auto">
            <FileCard files={files} removeFile={removeFile}></FileCard>
        </div> 
        :
        <div></div>
        }
        <div className="flex justify-center pt-5">
        <button
            type="button"
            onClick={startConversation}
            className="bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
            Get Started
        </button>
        </div>
    </div>
  )
}