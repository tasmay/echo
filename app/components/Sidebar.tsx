import { DocumentIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FileObject } from '@supabase/storage-js'

export interface SidebarProps {
    fileList: FileObject[];
    activeFile: string;
    openFile: (e: any, filename: FileObject) => void;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({ fileList, activeFile, openFile }: SidebarProps) {
  return (
    <div className="w-1/6 h-full pl-2 pt-2 flex flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/" className="font-spartan font-bold text-2xl">echo.</Link>
        <div className="p-1 font-inter">
            <div className="text-xs font-semibold leading-6 text-gray-400">Your files</div>
            <ul role="list" className="mt-2 space-y-1">
            {fileList.map((file, i) => (
                <li key={i} className={classNames( activeFile === file.id ? 'text-indigo-600' :'text-gray-700', 'break-all')}>
                    <a
                        href="#" onClick={(e) => { openFile(e, file) }}
                        className="flex flex-row group hover:text-indigo-600 hover:bg-gray-50 gap-x-3 rounded-md p-2 text-sm leading-6"
                    >
                    <DocumentIcon className="group-hover:text-indigo-600 h-6 w-6 shrink-0" />
                    {file.name}
                    </a>
                </li>
            ))}
            </ul>
        </div>
    </div>
  )
}
