import { Clock, Hash, Cpu, Microscope, Briefcase, Landmark, Stethoscope, Plus, Globe } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  selectedDuration: string
  setSelectedDuration: (duration: string) => void
  selectedTopics: string[]
  setSelectedTopics: (topics: string[]) => void
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
}

const durations = ["today", "this week", "this month"]
const predefinedTopics = ["Technology", "Science", "Business", "Politics", "Health"]
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "fr", name: "French" },
]

const topicIcons = {
  Technology: Cpu,
  Science: Microscope,
  Business: Briefcase,
  Politics: Landmark,
  Health: Stethoscope,
}

export default function Sidebar({
  selectedDuration,
  setSelectedDuration,
  selectedTopics,
  setSelectedTopics,
  selectedLanguage,
  setSelectedLanguage,
}: SidebarProps) {
  const [customTopic, setCustomTopic] = useState("")
  const [dynamicTopics, setDynamicTopics] = useState<string[]>([])

  const selectTopic = (topic: string) => {
    setSelectedTopics([topic])
  }

  const addCustomTopic = () => {
    if (customTopic.trim() !== "" && !dynamicTopics.includes(customTopic)) {
      setDynamicTopics((prev) => [...prev, customTopic])
      setSelectedTopics([customTopic])
      setCustomTopic("")
    }
  }

  return (
    <aside className="w-64 bg-gray-100 p-6">
      <h2 className="mb-4 text-xl font-semibold">Filters</h2>
      <div className="mb-6">
        <h3 className="mb-2 flex items-center text-sm font-medium text-gray-600">
          <Clock className="mr-2 h-4 w-4" />
          Duration
        </h3>
        {durations.map((duration) => (
          <button
            key={duration}
            className={`mb-2 w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
              selectedDuration === duration ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={() => setSelectedDuration(duration)}
          >
            {duration}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="mb-2 flex items-center text-sm font-medium text-gray-600">
          <Hash className="mr-2 h-4 w-4" />
          Topics
        </h3>
        {predefinedTopics.map((topic) => {
          const Icon = topicIcons[topic as keyof typeof topicIcons]
          return (
            <button
              key={topic}
              className={`mb-2 flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selectedTopics.includes(topic) ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
              }`}
              onClick={() => selectTopic(topic)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {topic}
            </button>
          )
        })}
      </div>
      <div className="mb-6">
        <h3 className="mb-2 flex items-center text-sm font-medium text-gray-600">
          <Globe className="mr-2 h-4 w-4" />
          Language
        </h3>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="mb-2 flex items-center text-sm font-medium text-gray-600">
          <Plus className="mr-2 h-4 w-4" />
          Other
        </h3>
        <div className="flex">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="mr-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter topic"
          />
          <button
            onClick={addCustomTopic}
            className="rounded-md bg-black px-3 py-2 text-sm text-white transition-colors hover:bg-gray-800"
          >
            Add
          </button>
        </div>
        {dynamicTopics.map((topic) => (
          <button
            key={topic}
            className={`mb-2 mt-2 flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors ${
              selectedTopics.includes(topic) ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={() => selectTopic(topic)}
          >
            <Hash className="mr-2 h-4 w-4" />
            {topic}
          </button>
        ))}
      </div>
    </aside>
  )
}

