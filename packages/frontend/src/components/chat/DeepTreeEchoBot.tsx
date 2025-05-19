import React, { useEffect, useState } from 'react'
import { BackendRemote, Type, onDCEvent } from '../../backend-com'
import { selectedAccountId } from '../../ScreenController'
import { useSettingsStore } from '../../stores/settings'
import { getLogger } from '../../../../shared/logger'
import useMessage from '../../hooks/chat/useMessage'
import { LLMService } from '../../utils/LLMService'

const log = getLogger('render/DeepTreeEchoBot')

// RAG memory store for conversation history
interface MemoryEntry {
  chatId: number
  messageId: number
  text: string
  timestamp: number
  sender: string
  isOutgoing: boolean
}

export class RAGMemoryStore {
  private static instance: RAGMemoryStore
  private memory: MemoryEntry[] = []
  private storageKey = 'deep-tree-echo-memory'

  private constructor() {
    this.loadFromStorage()
  }

  public static getInstance(): RAGMemoryStore {
    if (!RAGMemoryStore.instance) {
      RAGMemoryStore.instance = new RAGMemoryStore()
    }
    return RAGMemoryStore.instance
  }

  public addEntry(entry: MemoryEntry): void {
    this.memory.push(entry)
    this.saveToStorage()
  }

  public getMemoryForChat(chatId: number): MemoryEntry[] {
    return this.memory.filter(entry => entry.chatId === chatId)
  }

  public getAllMemory(): MemoryEntry[] {
    return [...this.memory]
  }

  public searchMemory(query: string): MemoryEntry[] {
    const lowerQuery = query.toLowerCase()
    return this.memory.filter(entry => 
      entry.text.toLowerCase().includes(lowerQuery)
    )
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memory))
    } catch (error) {
      log.error('Failed to save memory to storage:', error)
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.memory = JSON.parse(stored)
      }
    } catch (error) {
      log.error('Failed to load memory from storage:', error)
    }
  }

  public clearMemory(): void {
    this.memory = []
    this.saveToStorage()
  }
}

interface DeepTreeEchoBotProps {
  enabled: boolean
}

/**
 * Deep Tree Echo bot component that handles automatic responses to messages
 * and integrates with RAG memory for learning from conversations
 */
const DeepTreeEchoBot: React.FC<DeepTreeEchoBotProps> = ({ enabled }) => {
  const accountId = selectedAccountId()
  const { sendMessage } = useMessage()
  const settingsStore = useSettingsStore()[0]
  const memory = RAGMemoryStore.getInstance()
  const llmService = LLMService.getInstance()
  
  // Configure LLM service when settings change
  useEffect(() => {
    if (!settingsStore?.desktopSettings) return
    
    llmService.setConfig({
      apiKey: settingsStore.desktopSettings.botApiKey || '',
      apiEndpoint: settingsStore.desktopSettings.botApiEndpoint || 'https://api.openai.com/v1/chat/completions'
    })
  }, [settingsStore?.desktopSettings?.botApiKey, settingsStore?.desktopSettings?.botApiEndpoint])
  
  // Listen for incoming messages
  useEffect(() => {
    if (!enabled || !settingsStore?.desktopSettings?.botEnabled) return

    return onDCEvent(accountId, 'IncomingMsg', async (event) => {
      try {
        const { chatId, msgId } = event
        
        // Get message details
        const message = await BackendRemote.rpc.getMessage(accountId, msgId)
        
        // Skip messages sent by bot itself
        if (message.isInfo || message.isOutgoing) return
        
        // Store message in RAG memory
        memory.addEntry({
          chatId,
          messageId: msgId,
          text: message.text,
          timestamp: message.timestamp,
          sender: message.sender.displayName,
          isOutgoing: message.isOutgoing
        })
        
        // Get chat info
        const chatInfo = await BackendRemote.rpc.getBasicChatInfo(accountId, chatId)
        
        // Skip if chat is a contact request
        if (chatInfo.isContactRequest) return

        // Generate bot response based on message content
        const response = await generateBotResponse(message.text, chatId)
        
        // Send the response
        if (response) {
          await sendMessage(accountId, chatId, {
            text: response
          })
          
          // Store the bot's response in memory too
          const sentMsgId = await BackendRemote.rpc.getLastMessageId(accountId, chatId)
          if (sentMsgId) {
            memory.addEntry({
              chatId,
              messageId: sentMsgId,
              text: response,
              timestamp: Math.floor(Date.now() / 1000),
              sender: 'Deep Tree Echo',
              isOutgoing: true
            })
          }
        }
      } catch (error) {
        log.error('Error handling incoming message:', error)
      }
    })
  }, [accountId, enabled, sendMessage, memory, settingsStore?.desktopSettings?.botEnabled])
  
  // Periodically run learning exercises to improve the bot
  useEffect(() => {
    if (!enabled || !settingsStore?.desktopSettings?.botEnabled || !settingsStore?.desktopSettings?.botLearningEnabled) return
    
    const intervalId = setInterval(() => {
      runLearningExercise()
    }, 24 * 60 * 60 * 1000) // Once a day
    
    return () => clearInterval(intervalId)
  }, [enabled, settingsStore?.desktopSettings?.botEnabled, settingsStore?.desktopSettings?.botLearningEnabled])
  
  const generateBotResponse = async (inputText: string, chatId: number): Promise<string> => {
    try {
      // Get chat history context from memory
      const chatMemory = memory.getMemoryForChat(chatId)
      const recentMessages = chatMemory
        .slice(-10) // Last 10 messages for context
        .map(m => `${m.sender}: ${m.text}`)
        .join('\n')
      
      // Get bot personality from settings
      const personality = settingsStore?.desktopSettings?.botPersonality || 
        'Deep Tree Echo is a helpful, friendly AI assistant that provides thoughtful responses to users in Delta Chat.'
      
      // Call the LLM service to generate a response
      return await llmService.generateResponseWithContext(
        inputText,
        recentMessages,
        personality
      )
    } catch (error) {
      log.error('Error generating bot response:', error)
      return "I'm sorry, I couldn't process your message at the moment."
    }
  }
  
  const runLearningExercise = async () => {
    try {
      log.info('Running learning exercise...')
      const allMemory = memory.getAllMemory()
      
      // Skip if no memory entries
      if (allMemory.length === 0) {
        log.info('No memories to process for learning')
        return
      }
      
      // Create a system prompt for the learning exercise
      const systemPrompt = 'You are an AI learning system. Your task is to analyze conversation patterns and extract insights from them to improve future responses. Identify common questions, topics, and communication patterns.'
      
      // Prepare conversation data for analysis
      const conversationData = allMemory
        .slice(-100) // Limit to most recent 100 entries
        .map(m => `[Chat: ${m.chatId}] ${m.sender}: ${m.text}`)
        .join('\n')
      
      // Request analysis from LLM
      const analysisPrompt = `Please analyze the following conversations and provide insights on how to improve responses:\n\n${conversationData}`
      
      const analysis = await llmService.generateResponseWithContext(
        analysisPrompt,
        '',
        systemPrompt
      )
      
      // Log the analysis (in a real implementation, this would be used to update the model)
      log.info('Learning analysis completed:', analysis)
      
      log.info(`Learning exercise completed. Processed ${allMemory.length} memories.`)
    } catch (error) {
      log.error('Error during learning exercise:', error)
    }
  }

  return null // This is a background component with no UI
}

export default DeepTreeEchoBot 