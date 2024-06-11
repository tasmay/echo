import Link from 'next/link'

export default function Footer() {
    return (
        <section className="flex flex-col text-white bg-black w-full max-w-full h-14 items-center justify-items-center font-mono text-xs lg:flex-row lg:justify-between p-3">
            <div className="flex flex-col w-full items-center lg:justify-start lg:flex-row">
                <p>Built with&nbsp;<Link href="https://llamaindex.ai/" className="hover:text-purple-700">LlamaIndex</Link>&nbsp;and&nbsp;<Link href="https://nextjs.org/" className="hover:text-purple-700">Next.js</Link>.</p>
            </div>
            <div className="flex flex-col w-full items-center lg:justify-end lg:flex-row hover:text-purple-700">
                <p><Link href="https://tasmay.dev">tasmay.dev</Link></p>
            </div>
        </section>
    )
}