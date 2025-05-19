import React, { useState, useEffect } from 'react'
import { getLogger } from '../../../../shared/logger'
import useTranslationFunction from '../../hooks/useTranslationFunction'
import { RAGMemoryStore } from '../chat/DeepTreeEchoBot'
import Switch from '../Switch'

const log = getLogger('render/BotSettings')

interface BotSettingsProps {
  settingsStore: {
    desktopSettings: {
      botEnabled?: boolean
      botLearningEnabled?: boolean
      botPersonality?: string
      botApiKey?: string
      botApiEndpoint?: string
    }
    // Add a method to update settings
    setDesktopSetting: (key: string, value: any) => void
  }
}

const BotSettings: React.FC<BotSettingsProps> = ({ settingsStore }) => {
  const tx = useTranslationFunction()
  const [botEnabled, setBotEnabled] = useState(
    settingsStore.desktopSettings.botEnabled || false
  )
  const [learningEnabled, setLearningEnabled] = useState(
    settingsStore.desktopSettings.botLearningEnabled || false
  )
  const [apiKey, setApiKey] = useState(
    settingsStore.desktopSettings.botApiKey || ''
  )
  const [apiEndpoint, setApiEndpoint] = useState(
    settingsStore.desktopSettings.botApiEndpoint || 'https://api.openai.com/v1/chat/completions'
  )
  const [personality, setPersonality] = useState(
    settingsStore.desktopSettings.botPersonality || 'Deep Tree Echo is a helpful, friendly AI assistant that provides thoughtful responses to users in Delta Chat.'
  )
  
  const memory = RAGMemoryStore.getInstance()

  // Update settings when they change
  useEffect(() => {
    settingsStore.setDesktopSetting('botEnabled', botEnabled)
  }, [botEnabled, settingsStore])

  useEffect(() => {
    settingsStore.setDesktopSetting('botLearningEnabled', learningEnabled)
  }, [learningEnabled, settingsStore])

  useEffect(() => {
    settingsStore.setDesktopSetting('botPersonality', personality)
  }, [personality, settingsStore])
  
  useEffect(() => {
    settingsStore.setDesktopSetting('botApiKey', apiKey)
  }, [apiKey, settingsStore])
  
  useEffect(() => {
    settingsStore.setDesktopSetting('botApiEndpoint', apiEndpoint)
  }, [apiEndpoint, settingsStore])

  const handleClearMemory = () => {
    if (window.confirm("Are you sure you want to clear all of Deep Tree Echo's memory? This action cannot be undone.")) {
      memory.clearMemory()
      alert("Memory has been cleared.")
    }
  }

  return (
    <div className='bot-settings-container'>
      <div className='bot-settings'>
        <h1>Deep Tree Echo Bot Settings</h1>
        
        <div className='bot-setting-item'>
          <div className='bot-setting-header'>
            <h3>Enable Deep Tree Echo Bot</h3>
            <Switch 
              checked={botEnabled}
              onChange={setBotEnabled}
            />
          </div>
          <p className='bot-setting-description'>
            When enabled, Deep Tree Echo will automatically respond to messages in your chats.
          </p>
        </div>
        
        <div className='bot-setting-item'>
          <div className='bot-setting-header'>
            <h3>Enable Learning</h3>
            <Switch 
              checked={learningEnabled} 
              onChange={setLearningEnabled}
              disabled={!botEnabled}
            />
          </div>
          <p className='bot-setting-description'>
            When enabled, Deep Tree Echo will periodically review conversations to improve its responses.
          </p>
        </div>
        
        <div className='bot-setting-item'>
          <h3>API Configuration</h3>
          <div className='bot-setting-input'>
            <label>API Key:</label>
            <input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              disabled={!botEnabled}
              placeholder="Enter your LLM API key"
            />
          </div>
          <div className='bot-setting-input'>
            <label>API Endpoint:</label>
            <input 
              type="text" 
              value={apiEndpoint} 
              onChange={(e) => setApiEndpoint(e.target.value)}
              disabled={!botEnabled}
              placeholder="Enter LLM API endpoint"
            />
          </div>
        </div>
        
        <div className='bot-setting-item'>
          <h3>Bot Personality</h3>
          <textarea 
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            disabled={!botEnabled}
            rows={5}
            placeholder="Define the bot's personality and behavior..."
          />
          <p className='bot-setting-description'>
            Define how Deep Tree Echo should respond and interact with users.
          </p>
        </div>
        
        <div className='bot-setting-item'>
          <h3>Memory Management</h3>
          <button 
            className='destructive-button'
            onClick={handleClearMemory}
            disabled={!botEnabled}
          >
            Clear Memory
          </button>
          <p className='bot-setting-description'>
            This will erase all stored conversation history used for context in responses.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BotSettings 