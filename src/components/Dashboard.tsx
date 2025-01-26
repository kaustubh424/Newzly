'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import NewsGrid from './NewsGrid'
import WeatherPanel from './WeatherPanel'

export default function Dashboard() {
  const [selectedDuration, setSelectedDuration] = useState('today')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage]=useState('en')
  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">News Summarizer</h1>
          <WeatherPanel />
        </div>
        <NewsGrid duration={selectedDuration} topics={selectedTopics} language={selectedLanguage} />
      </main>
    </div>
  )
}

