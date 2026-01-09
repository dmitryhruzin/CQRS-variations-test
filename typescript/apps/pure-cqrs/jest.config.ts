import { nodeConfig } from '@CQRS-variations-test/jest-config'
import type { Config } from 'jest'

export default async (): Promise<Config> => ({
  ...nodeConfig
})
