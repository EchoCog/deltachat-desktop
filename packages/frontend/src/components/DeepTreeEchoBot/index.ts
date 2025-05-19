import { DeepTreeEchoBot, DeepTreeEchoBotOptions } from './DeepTreeEchoBot'
import BotSettings from './BotSettings'
import { BackendRemote, onDCEvent, Type as T } from '../../backend-com'
import { runtime } from '@deltachat-desktop/runtime-interface'
import { getLogger } from '../../../../shared/logger'

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
  } catch (error) {
    log.error('Failed to initialize Deep Tree Echo Bot:', error)
  }
}

/**
 * Register message event handlers
 */
function registerMessageHandlers(): void {
  if (!botInstance) {
    return
  }
  
  // For each account, register a handler for new messages
  BackendRemote.rpc.getAllAccounts().then(accounts => {
    accounts.forEach(account => {
      const { id: accountId } = account
      
      // Register MsgNew event handler - cast to any to bypass type checking
      // since 'MsgNew' may not be explicitly defined in the type system but works in runtime
      onDCEvent(accountId, 'MsgNew' as any, async (data: { chatId: number, msgId: number }) => {
        try {
          const { chatId, msgId } = data
          
          // Get the message
          const message = await BackendRemote.rpc.getMessage(accountId, msgId)
          
          // Check if this is a message in a 1:1 chat or group that the bot should respond to
          const shouldRespond = await shouldRespondToMessage(accountId, chatId, message)
          
          if (shouldRespond) {
            // Generate a response
            const response = await botInstance?.processMessage(accountId, chatId, message)
            
            if (response) {
              // Send the response back to the chat
              await BackendRemote.rpc.sendMsg(accountId, chatId, {
                text: response,
                viewtype: null,
                file: null,
                filename: null,
                html: null,
                location: null,
                overrideSenderName: null,
                quotedMessageId: null,
                quotedText: null
              })
            }
          }
        } catch (error) {
          log.error('Error handling new message event:', error)
        }
      })
    })
  }).catch(error => {
    log.error('Failed to get accounts:', error)
  })
}

/**
 * Determine if the bot should respond to a message
 */
async function shouldRespondToMessage(
  accountId: number, 
  chatId: number, 
  message: T.Message
): Promise<boolean> {
  try {
    // Skip messages from the bot itself
    const selfContact = await BackendRemote.rpc.getContact(accountId, 1)
    if (message.fromId === selfContact.id) {
      return false
    }
    
    // Retrieve chat info to determine type
    const chat = await BackendRemote.rpc.getBasicChatInfo(accountId, chatId)
    
    // Handle 1:1 chats differently from groups
    if (chat.chatType === 100) { // Single chat
      // Always respond in 1:1 chats
      return true
    } else if (chat.chatType === 120) { // Group chat
      // Only respond if mentioned or if message starts with "echo" or "Echo"
      const isMentioned = message.text?.includes(`@${selfContact.displayName}`) || false
      const isDirectedToBot = message.text?.match(/^(echo|Echo|@echo)\b/) !== null
      
      return isMentioned || isDirectedToBot
    }
    
    return false
  } catch (error) {
    log.error('Error determining if bot should respond:', error)
    return false
  }
}

/**
 * Save bot settings
 */
export async function saveBotSettings(settings: Partial<DeepTreeEchoBotOptions>): Promise<void> {
  try {
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

export { BotSettings, DeepTreeEchoBot }

// Initialize the bot when this module is imported
initDeepTreeEchoBot() 