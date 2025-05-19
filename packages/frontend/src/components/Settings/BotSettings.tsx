import React, { useState, useEffect } from 'react'
import { getLogger } from '../../../../shared/logger'
import useTranslationFunction from '../../hooks/useTranslationFunction'
import { runtime } from '@deltachat-desktop/runtime-interface'
import Switch from '../Switch'
import { saveBotSettings } from '../DeepTreeEchoBot'
import type { SettingsStoreState } from '../../stores/settings'
import type { DesktopSettingsType } from '../../../../shared/shared-types'

const log = getLogger('render/components/Settings/BotSettings')

type Props = {
  settingsStore: SettingsStoreState
}

export default function BotSettings({ settingsStore }: Props) {
  const tx = useTranslationFunction()
  const [isLoading, setIsLoading] = useState(true)
  
  // State for all bot settings
  const [botEnabled, setBotEnabled] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(false)
  const [visionEnabled, setVisionEnabled] = useState(false)
  const [webAutomationEnabled, setWebAutomationEnabled] = useState(false)
  const [embodimentEnabled, setEmbodimentEnabled] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [personality, setPersonality] = useState('')
  
  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const desktopSettings = await runtime.getDesktopSettings()
        
        setBotEnabled(desktopSettings.deepTreeEchoBotEnabled || false)
        setMemoryEnabled(desktopSettings.deepTreeEchoBotMemoryEnabled || false)
        setVisionEnabled(desktopSettings.deepTreeEchoBotVisionEnabled || false)
        setWebAutomationEnabled(desktopSettings.deepTreeEchoBotWebAutomationEnabled || false)
        setEmbodimentEnabled(desktopSettings.deepTreeEchoBotEmbodimentEnabled || false)
        setApiKey(desktopSettings.deepTreeEchoBotApiKey || '')
        setApiEndpoint(desktopSettings.deepTreeEchoBotApiEndpoint || '')
        setPersonality(desktopSettings.deepTreeEchoBotPersonality || 'Deep Tree Echo is a helpful, friendly AI assistant that provides thoughtful responses to users in Delta Chat.')
        
        setIsLoading(false)
      } catch (error) {
        log.error('Failed to load bot settings:', error)
        setIsLoading(false)
      }
    }
    
    loadSettings()
  }, [])
  
  // Handle saving settings - uses both the runtime method and the saveBotSettings method
  const handleSaveSetting = (key: string, value: any) => {
    // Update setting using runtime API
    const settingKey = `deepTreeEchoBot${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof DesktopSettingsType
    runtime.setDesktopSetting(settingKey, value)
    
    // Also update using saveBotSettings for the bot to pick up changes immediately
    saveBotSettings({ [key]: value })
  }
  
  if (isLoading) {
    return <div className="loading-settings">Loading bot settings...</div>
  }
  
  return (
    <div>
      <div className='bot-setting-item'>
        <div className='bot-setting-header'>
          <h3>Enable Deep Tree Echo Bot</h3>
          <Switch 
            checked={botEnabled}
            onChange={value => {
              setBotEnabled(value)
              handleSaveSetting('enabled', value)
            }}
          />
        </div>
        <p className='setting-description'>
          When enabled, Deep Tree Echo will automatically respond to messages in your chats.
        </p>
      </div>
      
      <div className='bot-setting-item'>
        <div className='bot-setting-header'>
          <h3>Enable Memory</h3>
          <Switch 
            checked={memoryEnabled} 
            onChange={value => {
              setMemoryEnabled(value)
              handleSaveSetting('memoryEnabled', value)
            }}
            disabled={!botEnabled}
          />
        </div>
        <p className='setting-description'>
          Allows the bot to remember conversation history for more contextual responses.
        </p>
      </div>
      
      <div className='bot-setting-item'>
        <div className='bot-setting-header'>
          <h3>Enable Vision Capabilities</h3>
          <Switch 
            checked={visionEnabled} 
            onChange={value => {
              setVisionEnabled(value)
              handleSaveSetting('visionEnabled', value)
            }}
            disabled={!botEnabled}
          />
        </div>
        <p className='setting-description'>
          Allows the bot to analyze images using computer vision.
          Use command: <code>/vision [image attachment]</code>
        </p>
      </div>
      
      <div className='bot-setting-item'>
        <div className='bot-setting-header'>
          <h3>Enable Web Automation</h3>
          <Switch 
            checked={webAutomationEnabled} 
            onChange={value => {
              setWebAutomationEnabled(value)
              handleSaveSetting('webAutomationEnabled', value)
            }}
            disabled={!botEnabled}
          />
        </div>
        <p className='setting-description'>
          Allows the bot to search the web and take screenshots.
          Use commands: <code>/search [query]</code> or <code>/screenshot [url]</code>
        </p>
      </div>
      
      <div className='bot-setting-item'>
        <div className='bot-setting-header'>
          <h3>Enable Embodiment</h3>
          <Switch 
            checked={embodimentEnabled} 
            onChange={value => {
              setEmbodimentEnabled(value)
              handleSaveSetting('embodimentEnabled', value)
            }}
            disabled={!botEnabled}
          />
        </div>
        <p className='setting-description'>
          Enables physical awareness training capabilities through simulated movement.
          Use command: <code>/embodiment [start|stop|status|evaluate]</code>
        </p>
      </div>
      
      <div className='bot-setting-item'>
        <h3>API Configuration</h3>
        <div className='bot-setting-input'>
          <label>API Key:</label>
          <input 
            type="password" 
            value={apiKey} 
            onChange={e => {
              setApiKey(e.target.value)
              handleSaveSetting('apiKey', e.target.value)
            }}
            disabled={!botEnabled}
            placeholder="Enter your LLM API key"
          />
        </div>
        <div className='bot-setting-input'>
          <label>API Endpoint:</label>
          <input 
            type="text" 
            value={apiEndpoint} 
            onChange={e => {
              setApiEndpoint(e.target.value)
              handleSaveSetting('apiEndpoint', e.target.value)
            }}
            disabled={!botEnabled}
            placeholder="Enter LLM API endpoint"
          />
        </div>
        <p className='setting-description'>
          Configure the language model service for generating responses.
        </p>
      </div>
      
      <div className='bot-setting-item'>
        <h3>Bot Personality</h3>
        <textarea 
          value={personality}
          onChange={e => {
            setPersonality(e.target.value)
            handleSaveSetting('personality', e.target.value)
          }}
          disabled={!botEnabled}
          rows={5}
          placeholder="Define the bot's personality and behavior..."
        />
        <p className='setting-description'>
          Define how Deep Tree Echo should respond and interact with users.
        </p>
      </div>
      
      <div className='bot-setting-item'>
        <h3>Commands</h3>
        <ul className='bot-commands-list'>
          <li><code>/help</code> - List available commands</li>
          <li><code>/vision [image]</code> - Analyze attached images</li>
          <li><code>/search [query]</code> - Search the web</li>
          <li><code>/screenshot [url]</code> - Capture website screenshots</li>
          <li><code>/memory [status|clear|search]</code> - Manage conversation memory</li>
          <li><code>/embodiment [start|stop|status|evaluate]</code> - Physical awareness training</li>
          <li><code>/version</code> - Display bot version and status</li>
        </ul>
      </div>
    </div>
  )
} 