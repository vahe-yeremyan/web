import { spawnSync } from 'node:child_process'

// Each verify step runs its tool directly (not via `bun run`) so a failure
// surfaces a single clear message instead of bun's "script exited with code 1"
// cascade. `fix` is the command that resolves the failure, when one exists.
const steps = [
  {
    name: 'format (prettier)',
    cmd: 'prettier',
    args: ['--check', '.'],
    fix: 'bun run format',
  },
  {
    name: 'lint (eslint)',
    cmd: 'eslint',
    args: [],
    fix: 'bun run format',
  },
  {
    name: 'test (vitest)',
    cmd: 'vitest',
    args: ['run', '--passWithNoTests'],
    fix: null,
  },
]

for (const step of steps) {
  const { status } = spawnSync(step.cmd, step.args, { stdio: 'inherit' })
  if (status !== 0) {
    console.error(`\n✖ verify failed at: ${step.name}`)
    if (step.fix) console.error(`  Fix with: ${step.fix}`)
    process.exit(1)
  }
}

console.log('\n✔ verify passed')
