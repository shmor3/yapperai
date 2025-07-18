import type React from 'react'
import { useState } from 'react'
import type { ChatMessage } from '../state/chat'
import { PersonIcon, TypographyIcon, CopyIcon, SyncIcon } from '@primer/octicons-react'
import { clsx } from 'clsx'

interface ChatMessageComponentProps {
  message: ChatMessage
  onResend?: () => void
}

export const ChatMessageComponent: React.FC<ChatMessageComponentProps> = ({
  message,
  onResend,
}) => {
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(timestamp)
  }

  const renderContent = () => {
    if (message.isLoading) {
      return (
        <div className="flex items-center gap-2 text-base-content/60">
          <span className="loading loading-dots loading-sm" />
          <span className="text-sm">Thinking...</span>
        </div>
      )
    }

    if (message.error) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-error">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-label="Error icon">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Error</span>
          </div>
          <p className="text-sm text-error/80">{message.error}</p>
          {onResend && (
            <button
              type="button"
              onClick={onResend}
              className="btn btn-sm btn-outline btn-error gap-2"
            >
              <SyncIcon size={14} />
              Try Again
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="prose prose-sm max-w-none">
        {message.content.split('\n').map((line, index) => (
          <p key={index} className="mb-2 last:mb-0">
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'group flex gap-4 p-6 transition-colors',
        message.role === 'assistant' ? 'bg-base-100' : 'bg-base-50'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={clsx(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        message.role === 'assistant' 
          ? 'bg-primary text-primary-content'
          : 'bg-secondary text-secondary-content'
      )}>
        {message.role === 'assistant' ? (
          <TypographyIcon size={16} />
        ) : (
          <PersonIcon size={16} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold">
            {message.role === 'assistant' ? 'Assistant' : 'You'}
          </span>
          <span className="text-xs text-base-content/60">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        <div className="text-base-content">
          {renderContent()}
        </div>

        {/* Actions */}
        {(showActions || copied) && !message.isLoading && message.content && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={clsx(
                'btn btn-ghost btn-xs gap-1 transition-all',
                copied ? 'btn-success' : 'hover:btn-neutral'
              )}
            >
              <CopyIcon size={12} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
