import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import UploadContainer from './components/UploadContainer';

export default async function Index() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="w-full h-full flex flex-row flex-1 overflow-auto justify-center">
      <div className="flex flex-col pt-6 w-full lg:w-2/3 max-w-full items-center">
        <div className="text-center text-4xl font-spartan font-bold hover:text-purple-700"><Link href="/">echo.</Link></div>
        <div className="px-1 mt-2 text-center text-md font-spartan">Retrieve information faster and ask questions about your documents with the power of AI.</div>
        <UploadContainer></UploadContainer>
      </div>
    </div>
  )
}