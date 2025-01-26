import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface NewsCardProps{
  title: string
  summary: string
  sourceUrl: string
  topic: string
}

export default function NewsCard({
  title,
  summary,
  sourceUrl,
  topic,
}: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="flex-1 p-6">
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="mb-4 text-sm text-gray-600">{summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:underline"
          >
            Read full article
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
      <div className="bg-gray-800 px-6 py-2 flex items-center justify-start">
        <span className="text-xs font-medium text-white">{topic}</span>
      </div>
    </motion.div>
  )
}
