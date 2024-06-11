import { TrashIcon } from '@heroicons/react/24/outline';
import { filesize } from "filesize";

export interface FileUploaderProps {
    files: File[];
    removeFile: (index: number) => void;
}

export default function FileCard({files, removeFile}: FileUploaderProps) {

    const handleRemove = (e: React.MouseEvent<HTMLElement>, index: number) => {
        e.preventDefault()
        removeFile(index)
    }

    const filesArr = Array.prototype.slice.call(files)
    return (
        <ul role="list" className="divide-y divide-gray-100">
            {filesArr.map((f,i) => (
                <li key={i} className="flex items-center justify-between mb-2 py-4 pl-4 pr-5 text-sm leading-6 bg-white rounded-md">
                    <div className="flex w-0 flex-1 items-center">
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">{f.name}</span>
                        <span className="hidden flex-shrink-0 text-gray-400 lg:block">{filesize(f.size, {standard: "jedec"})}</span>
                        </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            type="button"
                            onClick={(e) => {
                                handleRemove(e, i);
                            }}
                            className="font-medium text-red-600 hover:text-red-500"
                        >
                            <TrashIcon className="h-6 w-6 shrink-0" />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
  }