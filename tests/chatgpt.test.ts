import { spawnSync } from 'node:child_process'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { askChatGPT } from '../chatgpt.js'

vi.mock('node:child_process')

const mockedSpawnSync = vi.mocked(spawnSync)

describe('askChatGPT', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns output on success', () => {
    mockedSpawnSync.mockReturnValue({
      status: 0,
      stdout: 'Response from ChatGPT\n',
      stderr: '',
      pid: 123,
      output: ['', 'Response from ChatGPT\n', ''],
      signal: null
    })

    const result = askChatGPT('Ask ChatGPT on Mac', '/tmp/test.txt')

    expect(result).toEqual({
      ok: true,
      output: 'Response from ChatGPT'
    })
    expect(mockedSpawnSync).toHaveBeenCalledWith(
      'shortcuts',
      ['run', 'Ask ChatGPT on Mac', '-i', '/tmp/test.txt'],
      { encoding: 'utf8' }
    )
  })

  it('returns an error if the status is not 0', () => {
    mockedSpawnSync.mockReturnValue({
      status: 1,
      stdout: '',
      stderr: 'Shortcut not found\n',
      pid: 123,
      output: ['', '', 'Shortcut not found\n'],
      signal: null
    })

    const result = askChatGPT('Ask ChatGPT on Mac', '/tmp/test.txt')

    expect(result).toEqual({
      ok: false,
      error: 'Shortcut not found'
    })
  })

  it('returns an error if an exception is thrown', () => {
    mockedSpawnSync.mockImplementation(() => {
      throw new Error('Command not found')
    })

    const result = askChatGPT('Ask ChatGPT on Mac', '/tmp/test.txt')

    expect(result).toEqual({
      ok: false,
      error: 'Error: Command not found'
    })
  })

  it('handles stderr being empty', () => {
    mockedSpawnSync.mockReturnValue({
      status: 1,
      stdout: '',
      stderr: '',
      pid: 123,
      output: ['', '', ''],
      signal: null
    })

    const result = askChatGPT('Ask ChatGPT on Mac', '/tmp/test.txt')

    expect(result).toEqual({
      ok: false,
      error: ''
    })
  })
})