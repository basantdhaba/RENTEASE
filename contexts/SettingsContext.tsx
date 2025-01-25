import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { settings as defaultSettings } from "../lib/demo-data"

interface Settings {
  upiId: string
  interestedFees: { maxRent: number; fee: number }[]
  videoRequestFees: { maxRent: number; fee: number }[]
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
  }
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Settings) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    // In a real application, you would fetch the settings from an API here
    // For now, we'll use localStorage to persist settings
    const storedSettings = localStorage.getItem("appSettings")
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }
  }, [])

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    // In a real application, you would also update the backend here
    localStorage.setItem("appSettings", JSON.stringify(newSettings))
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

