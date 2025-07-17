import type React from 'react'
import { useState } from 'react'
import { useChatContext } from '../state/chat'
import { PlusIcon, TrashIcon, CommentIcon } from '@primer/octicons-react'
import { clsx } from 'clsx'

export const ChatSidebar: React.FC = () => {
  const { 
    state, 
    currentConversation, 
    createConversation, 
    deleteConversation, 
    setCurrentConversation 
  } = useChatContext()
  
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleNewChat = async () => {
    if (isCreating) return
    setIsCreating(true)
    try {
      await createConversation()
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteConversation = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (deletingId) return
    
    setDeletingId(id)
    try {
      await deleteConversation(id)
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const groupedConversations = state.conversations.reduce((groups, conversation) => {
    const date = formatDate(conversation.updatedAt)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(conversation)
    return groups
  }, {} as Record<string, typeof state.conversations>)

  return (
    <div className="w-80 h-full bg-base-200 border-r border-base-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <button
          type="button"
          onClick={handleNewChat}
          disabled={isCreating}
          className="btn btn-primary w-full gap-2"
        >
          <PlusIcon size={16} />
          {isCreating ? 'Creating...' : 'New Chat'}
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedConversations).length === 0 ? (
          <div className="p-6 text-center text-base-content/60">
            <CommentIcon size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([date, conversations]) => (
            <div key={date} className="p-2">
              <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2 px-2">
                {date}
              </h3>
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <button
                    type="button"
                    key={conversation.id}
                    onClick={() => setCurrentConversation(conversation.id)}
                    className={clsx(
                      'group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 w-full text-left',
                      'hover:bg-base-300',
                      currentConversation?.id === conversation.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-base-300/50'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className={clsx(
                        'text-sm font-medium truncate',
                        currentConversation?.id === conversation.id
                          ? 'text-primary'
                          : 'text-base-content'
                      )}>
                        {conversation.title}
                      </h4>
                      <p className="text-xs text-base-content/60 truncate mt-1">
                        {conversation.messages.length > 0 
                          ? `${conversation.messages[conversation.messages.length - 1].content.slice(0, 60)}...`
                          : 'No messages yet'
                        }
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      disabled={deletingId === conversation.id}
                      className={clsx(
                        'btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity',
                        'hover:btn-error',
                        deletingId === conversation.id && 'loading'
                      )}
                    >
                      {deletingId === conversation.id ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <TrashIcon size={14} />
                      )}
                    </button>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-base-300">
        <div className="text-xs text-base-content/60 text-center">
          {state.conversations.length} conversation{state.conversations.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
