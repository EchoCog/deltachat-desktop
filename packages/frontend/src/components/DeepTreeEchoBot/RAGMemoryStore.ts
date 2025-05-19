import { getLogger } from '../../../../shared/logger'

const log = getLogger('render/components/DeepTreeEchoBot/RAGMemoryStore')

export interface Memory {
  id: string
  text: string
  timestamp: number
  sender: 'user' | 'bot'
  chatId: number
  messageId: number | null
  metadata?: {
    [key: string]: any
  }
}

export interface MemoryStoreOptions {
  maxMemories?: number
  persistToDisk?: boolean
  dbPath?: string
}

/**
 * RAGMemoryStore - A Retrieval-Augmented Generation Memory Store for the Deep Tree Echo Bot
 * Stores conversation history and provides retrieval capabilities for context-aware responses
 */
export class RAGMemoryStore {
  private memories: Map<string, Memory> = new Map()
  private chatMemories: Map<number, string[]> = new Map()
  private options: MemoryStoreOptions

  constructor(options: MemoryStoreOptions = {}) {
    this.options = {
      maxMemories: 1000,
      persistToDisk: true,
      dbPath: 'deepTreeEchoMemory.json',
      ...options,
    }
    
    this.loadFromDisk().catch(err => {
      log.error('Failed to load memories from disk:', err)
    })
  }

  /**
   * Add a new memory to the store
   */
  async addMemory(memory: Omit<Memory, 'id' | 'timestamp'>): Promise<Memory> {
    const id = `memory_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const timestamp = Date.now()
    
    const newMemory: Memory = {
      ...memory,
      id,
      timestamp,
    }
    
    this.memories.set(id, newMemory)
    
    // Add to chat memories
    if (!this.chatMemories.has(memory.chatId)) {
      this.chatMemories.set(memory.chatId, [])
    }
    this.chatMemories.get(memory.chatId)?.push(id)
    
    // Enforce max memories limit if needed
    if (this.options.maxMemories && this.memories.size > this.options.maxMemories) {
      // Remove oldest memories
      const sortedMemories = Array.from(this.memories.values())
        .sort((a, b) => a.timestamp - b.timestamp)
      
      const memoriesToRemove = sortedMemories.slice(0, this.memories.size - this.options.maxMemories)
      
      for (const memory of memoriesToRemove) {
        this.memories.delete(memory.id)
        
        // Also remove from chat memories
        const chatMemoryIds = this.chatMemories.get(memory.chatId) || []
        const updatedChatMemoryIds = chatMemoryIds.filter(id => id !== memory.id)
        this.chatMemories.set(memory.chatId, updatedChatMemoryIds)
      }
    }
    
    // Persist to disk if enabled
    if (this.options.persistToDisk) {
      await this.saveToDisk()
    }
    
    return newMemory
  }

  /**
   * Get memories by chat ID
   */
  getMemoriesByChatId(chatId: number): Memory[] {
    const memoryIds = this.chatMemories.get(chatId) || []
    return memoryIds.map(id => this.memories.get(id)).filter(Boolean) as Memory[]
  }

  /**
   * Get the latest N messages from a chat
   */
  getLatestChatMemories(chatId: number, limit: number = 10): Memory[] {
    const memories = this.getMemoriesByChatId(chatId)
    return memories
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .reverse() // Return in chronological order
  }

  /**
   * Search for memories by text content
   */
  searchMemories(query: string, limit: number = 5): Memory[] {
    const matches: Array<{memory: Memory, score: number}> = []
    
    for (const memory of this.memories.values()) {
      // Simple matching algorithm - count occurrences of words
      const queryWords = query.toLowerCase().split(/\s+/)
      const memoryText = memory.text.toLowerCase()
      
      let score = 0
      for (const word of queryWords) {
        if (word.length < 3) continue // Skip short words
        
        const regex = new RegExp(word, 'g')
        const occurrences = (memoryText.match(regex) || []).length
        score += occurrences
      }
      
      if (score > 0) {
        matches.push({ memory, score })
      }
    }
    
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(match => match.memory)
  }

  /**
   * Delete all memories for a specific chat
   */
  async deleteChatMemories(chatId: number): Promise<void> {
    const memoryIds = this.chatMemories.get(chatId) || []
    
    for (const id of memoryIds) {
      this.memories.delete(id)
    }
    
    this.chatMemories.delete(chatId)
    
    if (this.options.persistToDisk) {
      await this.saveToDisk()
    }
  }

  /**
   * Save memories to disk
   */
  private async saveToDisk(): Promise<void> {
    if (!this.options.persistToDisk || !this.options.dbPath) {
      return
    }
    
    try {
      // In a real implementation, this would use proper storage APIs
      // For now we'll just log that we would save to disk
      log.info(`Would save ${this.memories.size} memories to disk at ${this.options.dbPath}`)
    } catch (error) {
      log.error('Failed to save memories to disk:', error)
    }
  }

  /**
   * Load memories from disk
   */
  private async loadFromDisk(): Promise<void> {
    if (!this.options.persistToDisk || !this.options.dbPath) {
      return
    }
    
    try {
      // In a real implementation, this would load from a file or database
      // For now, we'll just log that we'd load from disk
      log.info(`Would load memories from ${this.options.dbPath}`)
    } catch (error) {
      log.error('Failed to load memories from disk:', error)
    }
  }

  /**
   * Get memory statistics
   */
  getStats(): { totalMemories: number, chatCount: number } {
    return {
      totalMemories: this.memories.size,
      chatCount: this.chatMemories.size
    }
  }
} 