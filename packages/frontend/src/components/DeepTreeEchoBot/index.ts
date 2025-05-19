import { DeepTreeEchoBot, DeepTreeEchoBotOptions } from './DeepTreeEchoBot'
import { LLMService, CognitiveFunctionType } from './LLMService'
import { PersonaCore } from './PersonaCore'
import { RAGMemoryStore } from './RAGMemoryStore'
import { SelfReflection } from './SelfReflection'
import BotSettings from './BotSettings'
import DeepTreeEchoSettingsScreen from './DeepTreeEchoSettingsScreen'
import { initDeepTreeEchoBot, saveBotSettings, getBotInstance, cleanupBot } from './DeepTreeEchoIntegration'
import { 
  DeepTreeEchoTestUtil,
  createTestGroup,
  sendTestMessage,
  processMessageWithBot,
  runDemo,
  cleanup as cleanupTestUtil
} from './DeepTreeEchoTestUtil'

export {
  DeepTreeEchoBot,
  BotSettings,
  DeepTreeEchoSettingsScreen,
  LLMService,
  PersonaCore,
  RAGMemoryStore,
  SelfReflection,
  CognitiveFunctionType,
  // Export integration functions
  initDeepTreeEchoBot,
  saveBotSettings,
  getBotInstance,
  cleanupBot,
  // Export test utilities
  DeepTreeEchoTestUtil,
  createTestGroup,
  sendTestMessage,
  processMessageWithBot,
  runDemo,
  cleanupTestUtil
}

export type { DeepTreeEchoBotOptions }

export default DeepTreeEchoBot 