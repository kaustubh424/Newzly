import { Cloud, Sun, CloudRain } from 'lucide-react'

export default function WeatherPanel() {
  // This is a mock weather data. In a real application, you'd fetch this from a weather API
  const weather = {
    temperature: 22,
    condition: 'Partly Cloudy',
    icon: Cloud,
  }

  return (
    <div className="flex items-center rounded-lg bg-gray-100 p-4 text-sm">
      <weather.icon className="mr-2 h-6 w-6" />
      <div>
        <div className="font-semibold">{weather.temperature}°C</div>
        <div className="text-gray-600">{weather.condition}</div>
      </div>
    </div>
  )
}