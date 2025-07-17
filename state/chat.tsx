import type React from 'react'
import { createContext, useContext, useReducer, useCallback } from 'react'

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isLoading?: boolean
  error?: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  isTyping: boolean
  error: string | null
}

type ChatAction = 
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_CONVERSATION'; payload: { id: string; updates: Partial<Conversation> } }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: ChatMessage } }
  | { type: 'UPDATE_MESSAGE'; payload: { conversationId: string; messageId: string; updates: Partial<ChatMessage> } }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isTyping: false,
  error: null,
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload }
    
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
        currentConversationId: action.payload.id,
      }
    
    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id
            ? { ...conv, ...action.payload.updates, updatedAt: new Date() }
            : conv
        ),
      }
    
    case 'DELETE_CONVERSATION':
      const newConversations = state.conversations.filter(conv => conv.id !== action.payload)
      return {
        ...state,
        conversations: newConversations,
        currentConversationId: state.currentConversationId === action.payload
          ? (newConversations[0]?.id ?? null)
          : state.currentConversationId,
      }
    
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversationId: action.payload }
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.conversationId
            ? {
                ...conv,
                messages: [...conv.messages, action.payload.message],
                updatedAt: new Date(),
              }
            : conv
        ),
      }
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.conversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === action.payload.messageId
                    ? { ...msg, ...action.payload.updates }
                    : msg
                ),
                updatedAt: new Date(),
              }
            : conv
        ),
      }
    
    case 'SET_TYPING':
      return { ...state, isTyping: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    default:
      return state
  }
}

interface ChatContextType {
  state: ChatState
  currentConversation: Conversation | null
  createConversation: (title?: string) => Promise<Conversation>
  deleteConversation: (id: string) => Promise<void>
  setCurrentConversation: (id: string | null) => void
  sendMessage: (content: string) => Promise<void>
  resendMessage: (messageId: string) => Promise<void>
  clearError: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const currentConversation = state.currentConversationId
    ? state.conversations.find(conv => conv.id === state.currentConversationId) ?? null
    : null

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const createConversation = useCallback(async (title?: string): Promise<Conversation> => {
    const newConversation: Conversation = {
      id: generateId(),
      title: title || 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    dispatch({ type: 'ADD_CONVERSATION', payload: newConversation })
    return newConversation
  }, [])

  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: id })
    // TODO: Add API call to delete from backend
  }, [])

  const setCurrentConversation = useCallback((id: string | null) => {
    dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: id })
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    let conversationId = state.currentConversationId

    // Create new conversation if none exists
    if (!conversationId) {
      const newConversation = await createConversation()
      conversationId = newConversation.id
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { conversationId, message: userMessage }
    })

    // Add loading assistant message
    const assistantMessageId = generateId()
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    }

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { conversationId, message: assistantMessage }
    })

    dispatch({ type: 'SET_TYPING', payload: true })

    try {
      // TODO: Replace with actual API call
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const responses = [
        "I understand you're looking for help with that. Let me provide you with a comprehensive response...",
        "That's an interesting question! Here's what I think about it...",
        "I'd be happy to help you with that. Let me break this down for you...",
        "Great question! From my understanding, here's how I would approach this...",
        "Thanks for asking! I can definitely provide some insights on this topic...",
      ]
      
      const responseContent = responses[Math.floor(Math.random() * responses.length)] + 
        "\n\nThis is a simulated response for demonstration purposes. In a real implementation, this would be connected to your AI service of choice."

      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          conversationId,
          messageId: assistantMessageId,
          updates: {
            content: responseContent,
            isLoading: false,
          }
        }
      })

      // Update conversation title if it's the first exchange
      const conversation = state.conversations.find(c => c.id === conversationId)
      if (conversation && conversation.messages.length <= 2) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
        dispatch({
          type: 'UPDATE_CONVERSATION',
          payload: { id: conversationId, updates: { title } }
        })
      }

    } catch (error) {
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          conversationId,
          messageId: assistantMessageId,
          updates: {
            isLoading: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
          }
        }
      })
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message. Please try again.' })
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false })
    }
  }, [state.currentConversationId, state.conversations, createConversation])

  const resendMessage = useCallback(async (messageId: string) => {
    if (!currentConversation) return

    const message = currentConversation.messages.find(m => m.id === messageId)
    if (!message || message.role !== 'user') return

    await sendMessage(message.content)
  }, [currentConversation, sendMessage])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  return (
    <ChatContext.Provider
      value={{
        state,
        currentConversation,
        createConversation,
        deleteConversation,
        setCurrentConversation,
        sendMessage,
        resendMessage,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
