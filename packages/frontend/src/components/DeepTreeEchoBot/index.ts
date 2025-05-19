import { DeepTreeEchoBot, DeepTreeEchoBotOptions } from './DeepTreeEchoBot'
import BotSettings from './BotSettings'
import { BackendRemote, onDCEvent, Type as T } from '../../backend-com'
import { runtime } from '@deltachat-desktop/runtime-interface'
import { getLogger } from '../../../../shared/logger'
import { LLMService } from './LLMService'
import { RAGMemoryStore } from './RAGMemoryStore'
import { PersonaCore } from './PersonaCore'
import { SelfReflection } from './SelfReflection'

const log = getLogger('render/components/DeepTreeEchoBot')

// Bot instance (singleton)
let botInstance: DeepTreeEchoBot | null = null

/**
 * Initialize the Deep Tree Echo Bot
 */
export async function initDeepTreeEchoBot(): Promise<void> {
  try {
    // Load settings
    const desktopSettings = await runtime.getDesktopSettings()
    
    // Check if bot is enabled
    if (!desktopSettings.deepTreeEchoBotEnabled) {
      log.info('Deep Tree Echo Bot is disabled in settings')
      return
    }
    
    // Initialize supporting services and components first
    initializeServices()
    
    // Create bot instance with settings from desktop settings
    botInstance = new DeepTreeEchoBot({
      enabled: desktopSettings.deepTreeEchoBotEnabled,
      apiKey: desktopSettings.deepTreeEchoBotApiKey,
      apiEndpoint: desktopSettings.deepTreeEchoBotApiEndpoint,
      memoryEnabled: desktopSettings.deepTreeEchoBotMemoryEnabled || false,
      personality: desktopSettings.deepTreeEchoBotPersonality,
      visionEnabled: desktopSettings.deepTreeEchoBotVisionEnabled || false,
      webAutomationEnabled: desktopSettings.deepTreeEchoBotWebAutomationEnabled || false,
      embodimentEnabled: desktopSettings.deepTreeEchoBotEmbodimentEnabled || false
    })
    
    log.info('Deep Tree Echo Bot initialized successfully')
    
    // Register message event handlers
    registerMessageHandlers()
    
    // Do an initial self-reflection on startup
    performStartupReflection()
  } catch (error) {
    log.error('Failed to initialize Deep Tree Echo Bot:', error)
  }
}

/**
 * Initialize supporting services like LLM, Memory, PersonaCore etc.
 */
function initializeServices(): void {
  // Initialize LLM service
  const llmService = LLMService.getInstance()
  const desktopSettings = runtime.getDesktopSettings()
  
  // Set LLM configuration based on settings
  llmService.setConfig({
    apiKey: desktopSettings.deepTreeEchoBotApiKey || '',
    apiEndpoint: desktopSettings.deepTreeEchoBotApiEndpoint || 'https://api.openai.com/v1/chat/completions'
  })
  
  // Initialize memory store
  const memoryStore = RAGMemoryStore.getInstance()
  memoryStore.setEnabled(desktopSettings.deepTreeEchoBotMemoryEnabled || false)
  
  // Initialize persona core
  PersonaCore.getInstance()
  
  // Initialize self-reflection
  SelfReflection.getInstance()
}

/**
 * Perform a startup reflection to ensure consistent identity across restarts
 */
async function performStartupReflection(): Promise<void> {
  try {
    if (botInstance) {
      const selfReflection = SelfReflection.getInstance()
      await selfReflection.reflectOnAspect('startup', 'I am being restarted and need to ensure continuity of my identity and memory.')
      log.info('Startup reflection completed')
    }
  } catch (error) {
    log.error('Error during startup reflection:', error)
  }
}

/**
 * Register message event handlers for responding to messages
 */
function registerMessageHandlers(): void {
  if (!botInstance) return
  
  // Listen for new messages
  onDCEvent('DcEventNewMsg', (accountId, chatId, msgId) => {
    handleNewMessage(accountId, chatId, msgId)
  })
  
  log.info('Registered message handlers')
}

/**
 * Handle a new incoming message
 */
async function handleNewMessage(accountId: number, chatId: number, msgId: number): Promise<void> {
  try {
    if (!botInstance || !botInstance.isEnabled()) return
    
    // Get message details
    const message = await BackendRemote.rpc.getMessage(accountId, msgId)
    
    // Skip messages from self
    if (message.fromId === 1) return
    
    // Todo: Process message and generate response
    log.info(`Received message in chat ${chatId}, message ID: ${msgId}`)
    
    // Store the message in memory if memory is enabled
    if (botInstance.isMemoryEnabled()) {
      const memoryStore = RAGMemoryStore.getInstance()
      await memoryStore.storeMemory({
        chatId,
        messageId: msgId,
        sender: 'user',
        text: message.text || ''
      })
    }
    
    // Handle commands or generate response
    await botInstance.processMessage(accountId, chatId, msgId, message)
  } catch (error) {
    log.error('Error handling new message:', error)
  }
}

/**
 * Save bot settings
 */
export async function saveBotSettings(settings: Partial<DeepTreeEchoBotOptions>): Promise<void> {
  try {
    // For persona-related settings, check with DeepTreeEcho first
    if (settings.personality) {
      const personaCore = PersonaCore.getInstance()
      const alignment = personaCore.evaluateSettingAlignment('personality', settings.personality)
      
      if (!alignment.approved) {
        log.warn(`Personality setting rejected by Deep Tree Echo: ${alignment.reasoning}`)
        // Remove personality from settings to prevent updating it
        delete settings.personality
      } else {
        // Update personality in persona core
        await personaCore.updatePersonality(settings.personality)
      }
    }
    
    // Update desktop settings
    for (const [key, value] of Object.entries(settings)) {
      // Convert from camelCase to snake_case with prefix
      const settingKey = `deepTreeEchoBot${key.charAt(0).toUpperCase() + key.slice(1)}` as any
      await runtime.setDesktopSetting(settingKey, value)
    }
    
    // Update bot instance if it exists
    if (botInstance) {
      botInstance.updateOptions(settings)
    } 
    // Create bot instance if it doesn't exist and is being enabled
    else if (settings.enabled) {
      await initDeepTreeEchoBot()
    }
  } catch (error) {
    log.error('Failed to save bot settings:', error)
  }
}

/**
 * Get the bot instance
 */
export function getBotInstance(): DeepTreeEchoBot | null {
  return botInstance
}

/**
 * Export bot settings component
 */
export { BotSettings }

// Initialize the bot when this module is imported
initDeepTreeEchoBot() 