import { useState, useEffect } from 'react'
import NewsCard from './NewsCard'
import { input } from 'framer-motion/client'

interface NewsGridProps {
  duration: string
  topics: string[]
  language: string
}

interface NewsCache {
  [key: string]: any[] // Cache to store news for specific combinations of inputs
}

export default function NewsGrid({ duration, topics, language }: NewsGridProps) {
  const [news, setNews] = useState<any[]>([]) // News state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache to store previous responses
  const [newsCache, setNewsCache] = useState<NewsCache>({})

  // Function to fetch news from FastAPI
  console.log("fetching....")
  const fetchNews = async () => {
    // Ensure both inputs are selected before making the API request
    if (!duration || topics.length === 0||!language) {
      setNews([]) // Clear the news if inputs are incomplete
      return
    }

    setLoading(true)
    setError(null)

    const cacheKey = `${duration}-${language}-${topics.join(', ')}` // Create a unique key based on inputs

    // Check if the news data for this combination already exists in the cache
    if (newsCache[cacheKey]) {
      setNews(newsCache[cacheKey])
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/get-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input1: duration,
          input2: topics.join(', '),
          input3: language,
        }),
      })
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch news') // Throw error for non-OK responses
      }

      const data = await response.json()
      if(language=='en'){
        console.log("english")
        // Assign a default topic if the `topic` field is missing
        const newsWithTopics = data.news.map((newsItem: any) => ({
          ...newsItem,
          news: newsItem.news.replace(/\n\n/g, '').trim(), // Clean the news string
          topic: newsItem.topic || topics[0] || 'Unknown', // Use the first selected topic or 'Unknown'
        }))

        setNews(newsWithTopics) // Set news data to state

        // Store the fetched news in the cache for this combination of inputs
        setNewsCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: newsWithTopics,
        }))
      }
      else{
        // Assign a default topic if the `topic` field is missing
        console.log("other")
        // const newsWithTopics = data.translated_news.map((newsItem: any) => ({
        //   ...newsItem,
        //   news: newsItem.translated_news.replace(/\n\n/g, '').trim(), // Clean the news string
        //   topic: newsItem.topic || topics[0] || 'Unknown', // Use the first selected topic or 'Unknown'
        // }))
        const newsWithTopics = (data.translated_news || []).map((newsItem: any) => ({
          ...newsItem,
          news: (newsItem.translated_news || '').replace(/\n\n/g, '').trim(), // Fallback to empty string
          topic: newsItem.topic || topics[0] || 'Unknown',
        }))
        console.log(newsWithTopics)        

        setNews(newsWithTopics) // Set news data to state

        // Store the fetched news in the cache for this combination of inputs
        setNewsCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: newsWithTopics,
        }))
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch news') {
        setError('News is not currently available due to a server issue.') // Server-side issue message
      } else {
        setError('An error occurred while fetching news. Please try again.') // General error message
      }
    } finally {
      setLoading(false)
    }
  }

  // Function to extract the link from the news string
  const extractLink = (newsString: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)$/ // Match the URL at the end of the string
    const match = newsString.match(urlRegex)
    return match ? match[0] : '' // Return the matched URL or an empty string if not found
  }

  // Fetch news whenever duration or topics change
  useEffect(() => {
    fetchNews()
  }, [duration, topics,language])

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )

  // Display error message if an error occurs
  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )

  // Prompt to select inputs if they are not selected yet
  if (!duration || topics.length === 0||!language) {
    return <div>Please select a duration and at least one topic.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((newsItem, index) => {
        const link = extractLink(newsItem.news) // Extract the link
        const title = newsItem.news.replace(link, '').trim() // Remove the link from the title

        return (
          <NewsCard
            key={index}
            title={title}
            summary={newsItem.summary || ''}
            sourceUrl={link} // Pass the extracted link
            topic={newsItem.topic} // Pass the topic
          />
        )
      })}
    </div>
  )
}
