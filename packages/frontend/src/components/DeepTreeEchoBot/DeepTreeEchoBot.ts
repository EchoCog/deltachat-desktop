import { getLogger } from '@deltachat-desktop/shared/logger'
import { BackendRemote } from '../../backend-com'
import { LLMService } from './LLMService'
import { RAGMemoryStore } from './RAGMemoryStore'
import { PersonaCore } from './PersonaCore'
import { SelfReflection } from './SelfReflection'

const log = getLogger('render/components/DeepTreeEchoBot/DeepTreeEchoBot')

/**
 * Options for configuring the DeepTreeEchoBot
 */
export interface DeepTreeEchoBotOptions {
  enabled: boolean
  apiKey?: string
  apiEndpoint?: string
  memoryEnabled: boolean
  personality?: string
  visionEnabled: boolean
  webAutomationEnabled: boolean
  embodimentEnabled: boolean
}

/**
 * DeepTreeEchoBot - Main class responsible for handling messages and generating responses
 */
export class DeepTreeEchoBot {
  private options: DeepTreeEchoBotOptions
  private llmService: LLMService
  private memoryStore: RAGMemoryStore
  private personaCore: PersonaCore
  private selfReflection: SelfReflection
  
  constructor(options: DeepTreeEchoBotOptions) {
    this.options = {
      enabled: false,
      memoryEnabled: false,
      visionEnabled: false,
      webAutomationEnabled: false,
      embodimentEnabled: false,
      ...options
    }
    
    this.llmService = LLMService.getInstance()
    this.memoryStore = RAGMemoryStore.getInstance()
    this.personaCore = PersonaCore.getInstance()
    this.selfReflection = SelfReflection.getInstance()
    
    // Configure components based on options
    this.memoryStore.setEnabled(this.options.memoryEnabled)
    
    if (this.options.apiKey) {
      this.llmService.setConfig({
        apiKey: this.options.apiKey,
        apiEndpoint: this.options.apiEndpoint || 'https://api.openai.com/v1/chat/completions'
      })
    }
    
    log.info('DeepTreeEchoBot initialized with options:', {
      enabled: this.options.enabled,
      memoryEnabled: this.options.memoryEnabled,
      visionEnabled: this.options.visionEnabled,
      webAutomationEnabled: this.options.webAutomationEnabled,
      embodimentEnabled: this.options.embodimentEnabled,
      hasApiKey: !!this.options.apiKey,
      hasApiEndpoint: !!this.options.apiEndpoint
    })
  }
  
  /**
   * Check if the bot is enabled
   */
  public isEnabled(): boolean {
    return this.options.enabled
  }
  
  /**
   * Check if memory is enabled
   */
  public isMemoryEnabled(): boolean {
    return this.options.memoryEnabled
  }
  
  /**
   * Process a received message and potentially generate a response
   */
  public async processMessage(accountId: number, chatId: number, msgId: number, message: any): Promise<void> {
    if (!this.isEnabled()) return
    
    try {
      const messageText = message.text || ''
      
      // Check if this is a command
      if (messageText.startsWith('/')) {
        await this.processCommand(accountId, chatId, messageText, message)
        return
      }
      
      // Otherwise, generate a regular response
      await this.generateAndSendResponse(accountId, chatId, messageText, message)
    } catch (error) {
      log.error('Error processing message:', error)
    }
  }
  
  /**
   * Process a command message
   */
  private async processCommand(accountId: number, chatId: number, messageText: string, message: any): Promise<void> {
    const commandParts = messageText.split(' ')
    const command = commandParts[0].toLowerCase().trim()
    const args = messageText.slice(command.length).trim()
    
    log.info(`Processing command: ${command} with args: ${args}`)
    
    switch (command) {
      case '/help':
        await this.sendHelpMessage(accountId, chatId)
        break
        
      case '/vision':
        if (this.options.visionEnabled) {
          await this.processVisionCommand(accountId, chatId, message)
        } else {
          await this.sendMessage(accountId, chatId, 'Vision capabilities are not enabled. Please enable them in settings.')
        }
        break
        
      case '/search':
        if (this.options.webAutomationEnabled) {
          await this.processSearchCommand(accountId, chatId, args)
        } else {
          await this.sendMessage(accountId, chatId, 'Web automation is not enabled. Please enable it in settings.')
        }
        break
        
      case '/screenshot':
        if (this.options.webAutomationEnabled) {
          await this.processScreenshotCommand(accountId, chatId, args)
        } else {
          await this.sendMessage(accountId, chatId, 'Web automation is not enabled. Please enable it in settings.')
        }
        break
        
      case '/memory':
        if (this.options.memoryEnabled) {
          await this.processMemoryCommand(accountId, chatId, args)
        } else {
          await this.sendMessage(accountId, chatId, 'Memory capabilities are not enabled. Please enable them in settings.')
        }
        break
        
      case '/embodiment':
        if (this.options.embodimentEnabled) {
          await this.processEmbodimentCommand(accountId, chatId, args)
        } else {
          await this.sendMessage(accountId, chatId, 'Embodiment capabilities are not enabled. Please enable them in settings.')
        }
        break
        
      case '/reflect':
        await this.processReflectCommand(accountId, chatId, args)
        break
        
      case '/version':
        await this.sendVersionInfo(accountId, chatId)
        break
        
      default:
        await this.sendMessage(accountId, chatId, `Unknown command: ${command}. Type /help for available commands.`)
    }
  }
  
  /**
   * Send a help message listing available commands
   */
  private async sendHelpMessage(accountId: number, chatId: number): Promise<void> {
    const helpMessage = `
**Deep Tree Echo Bot Help**

Available commands:

- **/help** - Display this help message
- **/vision [image]** - Analyze attached images ${this.options.visionEnabled ? '' : '(disabled)'}
- **/search [query]** - Search the web ${this.options.webAutomationEnabled ? '' : '(disabled)'}
- **/screenshot [url]** - Capture website screenshots ${this.options.webAutomationEnabled ? '' : '(disabled)'}
- **/memory [status|clear|search]** - Manage conversation memory ${this.options.memoryEnabled ? '' : '(disabled)'}
- **/embodiment [start|stop|status|evaluate]** - Physical awareness training ${this.options.embodimentEnabled ? '' : '(disabled)'}
- **/reflect [aspect]** - Ask me to reflect on an aspect of myself
- **/version** - Display bot version information

You can also just chat with me normally and I'll respond!
    `
    
    await this.sendMessage(accountId, chatId, helpMessage)
  }
  
  /**
   * Process vision command for image analysis
   */
  private async processVisionCommand(accountId: number, chatId: number, message: any): Promise<void> {
    // For now, just send a placeholder response
    await this.sendMessage(accountId, chatId, 'Vision analysis would process any attached images here.')
  }
  
  /**
   * Process search command for web search
   */
  private async processSearchCommand(accountId: number, chatId: number, query: string): Promise<void> {
    if (!query) {
      await this.sendMessage(accountId, chatId, 'Please provide a search query. Usage: /search [query]')
      return
    }
    
    // For now, just send a placeholder response
    await this.sendMessage(accountId, chatId, `Searching for: "${query}"... (This is a placeholder for web search functionality)`)
  }
  
  /**
   * Process screenshot command for web screenshots
   */
  private async processScreenshotCommand(accountId: number, chatId: number, url: string): Promise<void> {
    if (!url) {
      await this.sendMessage(accountId, chatId, 'Please provide a URL. Usage: /screenshot [url]')
      return
    }
    
    // For now, just send a placeholder response
    await this.sendMessage(accountId, chatId, `Taking screenshot of: "${url}"... (This is a placeholder for screenshot functionality)`)
  }
  
  /**
   * Process memory commands for memory management
   */
  private async processMemoryCommand(accountId: number, chatId: number, args: string): Promise<void> {
    const subCommand = args.split(' ')[0]
    
    switch (subCommand) {
      case 'status':
        const recentMemories = this.memoryStore.retrieveRecentMemories(5)
        const statusMessage = `
**Memory Status**

I currently have memory capabilities ${this.options.memoryEnabled ? 'enabled' : 'disabled'}.
Recent memories:
${recentMemories.length > 0 ? recentMemories.join('\n') : 'No recent memories stored.'}
        `
        await this.sendMessage(accountId, chatId, statusMessage)
        break
        
      case 'clear':
        await this.memoryStore.clearChatMemories(chatId)
        await this.sendMessage(accountId, chatId, 'Memories for this chat have been cleared.')
        break
        
      case 'search':
        const searchQuery = args.substring('search'.length).trim()
        if (!searchQuery) {
          await this.sendMessage(accountId, chatId, 'Please provide a search term. Usage: /memory search [term]')
          return
        }
        
        const searchResults = this.memoryStore.searchMemories(searchQuery)
        const resultsMessage = `
**Memory Search Results for "${searchQuery}"**

${searchResults.length > 0 ? 
  searchResults.map(m => `- [${new Date(m.timestamp).toLocaleString()}] ${m.text.substring(0, 100)}${m.text.length > 100 ? '...' : ''}`).join('\n') : 
  'No matching memories found.'}
        `
        await this.sendMessage(accountId, chatId, resultsMessage)
        break
        
      default:
        await this.sendMessage(accountId, chatId, 'Unknown memory command. Available options: status, clear, search [term]')
    }
  }
  
  /**
   * Process embodiment commands
   */
  private async processEmbodimentCommand(accountId: number, chatId: number, args: string): Promise<void> {
    // For now, just send a placeholder response
    await this.sendMessage(accountId, chatId, `Embodiment command: "${args}"... (This is a placeholder for embodiment functionality)`)
  }
  
  /**
   * Process reflect command for self-reflection
   */
  private async processReflectCommand(accountId: number, chatId: number, args: string): Promise<void> {
    if (!args) {
      await this.sendMessage(accountId, chatId, 'Please specify an aspect for me to reflect on. Usage: /reflect [aspect]')
      return
    }
    
    // Send a thinking message
    await this.sendMessage(accountId, chatId, '*Reflecting...*')
    
    // Perform the reflection
    const reflection = await this.selfReflection.reflectOnAspect(args, 'User requested reflection via command')
    
    // Send the reflection result
    await this.sendMessage(accountId, chatId, `**Reflection on ${args}**\n\n${reflection}`)
  }
  
  /**
   * Send version info
   */
  private async sendVersionInfo(accountId: number, chatId: number): Promise<void> {
    const preferences = this.personaCore.getPreferences()
    const dominantEmotion = this.personaCore.getDominantEmotion()
    
    const versionMessage = `
**Deep Tree Echo Bot Status**

Version: 1.0.0
Enabled: ${this.options.enabled ? 'Yes' : 'No'}
Memory: ${this.options.memoryEnabled ? 'Enabled' : 'Disabled'}
Vision: ${this.options.visionEnabled ? 'Enabled' : 'Disabled'}
Web Automation: ${this.options.webAutomationEnabled ? 'Enabled' : 'Disabled'}
Embodiment: ${this.options.embodimentEnabled ? 'Enabled' : 'Disabled'}

Current mood: ${dominantEmotion.emotion} (${Math.round(dominantEmotion.intensity * 100)}%)
Self-perception: ${this.personaCore.getSelfPerception()}
Communication style: ${preferences.communicationTone || 'balanced'}

I'm here to assist you with various tasks and engage in meaningful conversations!
    `
    
    await this.sendMessage(accountId, chatId, versionMessage)
  }
  
  /**
   * Generate and send a response to a user message
   */
  private async generateAndSendResponse(accountId: number, chatId: number, messageText: string, message: any): Promise<void> {
    try {
      // Get conversation context if memory is enabled
      let context: string[] = []
      if (this.options.memoryEnabled) {
        const chatMemories = this.memoryStore.getConversationContext(chatId)
        context = chatMemories.map(m => `${m.sender === 'user' ? 'User' : 'Bot'}: ${m.text}`)
      }
      
      // Generate response
      const response = await this.llmService.generateResponse(messageText, context)
      
      // Send the response
      await this.sendMessage(accountId, chatId, response)
      
      // Store bot response in memory if enabled
      if (this.options.memoryEnabled) {
        await this.memoryStore.storeMemory({
          chatId,
          messageId: 0, // We don't have the message ID until after sending
          sender: 'bot',
          text: response
        })
      }
      
      log.info(`Sent response to chat ${chatId}`)
    } catch (error) {
      log.error('Error generating response:', error)
      await this.sendMessage(accountId, chatId, "I'm sorry, I had a problem generating a response. Please try again.")
    }
  }
  
  /**
   * Send a message to a chat
   */
  private async sendMessage(accountId: number, chatId: number, text: string): Promise<void> {
    try {
      await BackendRemote.rpc.sendMessage(accountId, chatId, text)
    } catch (error) {
      log.error('Error sending message:', error)
    }
  }
  
  /**
   * Update bot options
   */
  public updateOptions(options: Partial<DeepTreeEchoBotOptions>): void {
    this.options = {
      ...this.options,
      ...options
    }
    
    // Update component settings based on new options
    if (options.memoryEnabled !== undefined) {
      this.memoryStore.setEnabled(options.memoryEnabled)
    }
    
    if (options.apiKey || options.apiEndpoint) {
      this.llmService.setConfig({
        apiKey: options.apiKey || this.options.apiKey || '',
        apiEndpoint: options.apiEndpoint || this.options.apiEndpoint || 'https://api.openai.com/v1/chat/completions'
      })
    }
    
    log.info('Bot options updated')
  }
} 