import type { ChatInputProps } from './ChatInput.types'
import './ChatInput.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong ChatInput · Web · DOM `<button>` */
export function ChatInput(props: ChatInputProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-chat-input',
        `ak-chat-input--${variant}`,
        `ak-chat-input--${size}`,
        fullWidth && 'ak-chat-input--full-width',
        loading && 'ak-chat-input--loading',
      )}
    >
      {iconLeft && <span className="ak-chat-input__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-chat-input__icon">{iconRight}</span>}
    </button>
  )
}

export default ChatInput
