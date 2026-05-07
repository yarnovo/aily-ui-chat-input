/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * 7 件事:
 * - 渲染输出 (children / variant / size 反映)
 * - 用户交互 (click)
 * - 状态变化 (loading / disabled)
 * - 受控行为 (handler 触发)
 * - 边界 (空 children · ariaLabel)
 * - 防误触 (disabled / loading 不触发)
 * - icon 渲染
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatInput } from '../src/ChatInput'
import { buttonScenarios } from '../src/ChatInput.behavior'

describe('ChatInput (Web) · 渲染', () => {
  it('渲染 children', () => {
    render(<ChatInput>Click me</ChatInput>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('应用 variant class', () => {
    const { container } = render(<ChatInput variant="destructive">删除</ChatInput>)
    expect(container.querySelector('.ak-chat-input--destructive')).toBeTruthy()
  })

  it('应用 size class', () => {
    const { container } = render(<ChatInput size="lg">Big</ChatInput>)
    expect(container.querySelector('.ak-chat-input--lg')).toBeTruthy()
  })

  it('fullWidth 加 class', () => {
    const { container } = render(<ChatInput fullWidth>占满</ChatInput>)
    expect(container.querySelector('.ak-chat-input--full-width')).toBeTruthy()
  })

  it('icon-only · ariaLabel 必填 · 不报 a11y 错', () => {
    render(<ChatInput ariaLabel="搜索" iconLeft="🔍" />)
    expect(screen.getByRole('button', { name: '搜索' })).toBeInTheDocument()
  })
})

describe('ChatInput (Web) · 状态', () => {
  it('disabled 加 attribute', () => {
    render(<ChatInput disabled>禁用</ChatInput>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('loading 加 aria-busy + class', () => {
    const { container } = render(<ChatInput loading>加载</ChatInput>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    expect(container.querySelector('.ak-chat-input--loading')).toBeTruthy()
  })
})

describe('ChatInput (Web) · 行为契约 (共享 spec)', () => {
  for (const sc of buttonScenarios) {
    it(sc.name, () => {
      const onClick = vi.fn()
      render(<ChatInput {...sc.props} onClick={onClick}>X</ChatInput>)
      fireEvent.click(screen.getByRole('button'))
      if (sc.onPressOutcome === 'callback-fired') {
        expect(onClick).toHaveBeenCalledOnce()
      } else {
        expect(onClick).not.toHaveBeenCalled()
      }
    })
  }
})

describe('ChatInput (Web) · 双口径回调', () => {
  it('onClick 跟 onPress 同时传 · 都触发', () => {
    const onClick = vi.fn()
    const onPress = vi.fn()
    render(<ChatInput onClick={onClick} onPress={onPress}>X</ChatInput>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onPress).toHaveBeenCalledOnce()
  })

  it('只传 onPress · Web 端 click 也触发', () => {
    const onPress = vi.fn()
    render(<ChatInput onPress={onPress}>X</ChatInput>)
    fireEvent.click(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledOnce()
  })
})

describe('ChatInput (Web) · 边界', () => {
  it('空 children + 空 ariaLabel · 仍可渲染 (但不推荐 · TS 应警告)', () => {
    render(<ChatInput />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('type=submit · 提交表单', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <ChatInput type="submit">提交</ChatInput>
      </form>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
