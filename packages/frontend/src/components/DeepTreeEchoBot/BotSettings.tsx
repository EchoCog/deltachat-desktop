import React, { useState, useEffect } from 'react'
import { DeepTreeEchoBotOptions } from './DeepTreeEchoBot'
import { runtime } from '@deltachat-desktop/runtime-interface'

interface BotSettingsProps {
  saveSettings: (settings: Partial<DeepTreeEchoBotOptions>) => void
}

const BotSettings: React.FC<BotSettingsProps> = ({ saveSettings }) => {
  const [settings, setSettings] = useState<DeepTreeEchoBotOptions>({
    enabled: false,
    apiKey: '',
    apiEndpoint: '',
    memoryEnabled: false,
    personality: '',
    visionEnabled: false,
    webAutomationEnabled: false,
    embodimentEnabled: false
  })
  
  const [isLoading, setIsLoading] = useState(true)
  
  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const desktopSettings = await runtime.getDesktopSettings()
        
        setSettings({
          enabled: desktopSettings.deepTreeEchoBotEnabled || false,
          apiKey: desktopSettings.deepTreeEchoBotApiKey || '',
          apiEndpoint: desktopSettings.deepTreeEchoBotApiEndpoint || '',
          memoryEnabled: desktopSettings.deepTreeEchoBotMemoryEnabled || false,
          personality: desktopSettings.deepTreeEchoBotPersonality || '',
          visionEnabled: desktopSettings.deepTreeEchoBotVisionEnabled || false,
          webAutomationEnabled: desktopSettings.deepTreeEchoBotWebAutomationEnabled || false,
          embodimentEnabled: desktopSettings.deepTreeEchoBotEmbodimentEnabled || false
        })
        
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load bot settings:', error)
        setIsLoading(false)
      }
    }
    
    loadSettings()
  }, [])
  
  // Handle changes to settings
  const handleChange = (key: keyof DeepTreeEchoBotOptions, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    
    // Save changes
    saveSettings({ [key]: value })
  }
  
  // Handle API key change
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('apiKey', e.target.value)
  }
  
  // Handle API endpoint change
  const handleApiEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('apiEndpoint', e.target.value)
  }
  
  // Handle personality change
  const handlePersonalityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange('personality', e.target.value)
  }
  
  if (isLoading) {
    return <div className='loading'>Loading settings...</div>
  }
  
  return (
    <div className='deep-tree-echo-settings'>
      <h3>Deep Tree Echo Bot Settings</h3>
      
      <div className='setting-section'>
        <label className='setting-item'>
          <div className='setting-label'>Enable Bot</div>
          <input
            type='checkbox'
            checked={settings.enabled}
            onChange={e => handleChange('enabled', e.target.checked)}
          />
        </label>
        
        <div className='setting-item'>
          <div className='setting-label'>API Key</div>
          <input
            type='password'
            value={settings.apiKey}
            onChange={handleApiKeyChange}
            placeholder='Enter your API key'
            disabled={!settings.enabled}
          />
          <div className='setting-description'>
            API key for accessing the language model service (OpenAI, Claude, etc.)
          </div>
        </div>
        
        <div className='setting-item'>
          <div className='setting-label'>API Endpoint</div>
          <input
            type='text'
            value={settings.apiEndpoint}
            onChange={handleApiEndpointChange}
            placeholder='Enter API endpoint URL (optional)'
            disabled={!settings.enabled}
          />
          <div className='setting-description'>
            Optional custom API endpoint (leave blank for default)
          </div>
        </div>
      </div>
      
      <div className='setting-section'>
        <h4>Features</h4>
        
        <label className='setting-item'>
          <div className='setting-label'>Enable Memory</div>
          <input
            type='checkbox'
            checked={settings.memoryEnabled}
            onChange={e => handleChange('memoryEnabled', e.target.checked)}
            disabled={!settings.enabled}
          />
          <div className='setting-description'>
            Allows the bot to remember conversation history
          </div>
        </label>
        
        <label className='setting-item'>
          <div className='setting-label'>Enable Vision</div>
          <input
            type='checkbox'
            checked={settings.visionEnabled}
            onChange={e => handleChange('visionEnabled', e.target.checked)}
            disabled={!settings.enabled}
          />
          <div className='setting-description'>
            Allows the bot to analyze images using TensorFlow.js
          </div>
        </label>
        
        <label className='setting-item'>
          <div className='setting-label'>Enable Web Automation</div>
          <input
            type='checkbox'
            checked={settings.webAutomationEnabled}
            onChange={e => handleChange('webAutomationEnabled', e.target.checked)}
            disabled={!settings.enabled}
          />
          <div className='setting-description'>
            Allows the bot to search the web and take screenshots
          </div>
        </label>
        
        <label className='setting-item'>
          <div className='setting-label'>Enable Embodiment</div>
          <input
            type='checkbox'
            checked={settings.embodimentEnabled}
            onChange={e => handleChange('embodimentEnabled', e.target.checked)}
            disabled={!settings.enabled}
          />
          <div className='setting-description'>
            Enables physical awareness training capabilities
          </div>
        </label>
      </div>
      
      <div className='setting-section'>
        <h4>Personality</h4>
        
        <div className='setting-item'>
          <div className='setting-label'>Custom Personality</div>
          <textarea
            value={settings.personality}
            onChange={handlePersonalityChange}
            placeholder='Enter a custom system prompt for the bot (optional)'
            disabled={!settings.enabled}
            rows={5}
          />
          <div className='setting-description'>
            Customize how the bot responds by providing a system prompt
          </div>
        </div>
      </div>
    </div>
  )
}

export default BotSettings 