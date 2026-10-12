import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/** One line of a V8 stack: `at [async] method (file:line:column)`, or `at file:line:column` when the function has no name. */
const STACK_FRAME = /^\s*at (?:async )?(?:(.+?) \()?(.+):(\d+):\d+\)?$/

/**
 * The first frame of the stack inside this backend's own code: the method and
 * file the error came from. Frames in `node_modules` and Node itself are
 * skipped, so an SDK or Supabase error points at the call of ours that failed.
 */
function originOf(stack: string) {
  for (const line of stack.split('\n').slice(1)) {
    const [, method = '<anonymous>', file, lineNo] = line.match(STACK_FRAME) ?? []
    if (!file || file.startsWith('node:') || file.includes('node_modules')) continue

    const path = file.startsWith('file://') ? fileURLToPath(file) : file

    return { method, file: `${relative(process.cwd(), path)}:${lineNo}` }
  }

  return { method: 'unknown', file: 'unknown' }
}

/**
 * Logs an error of the MMA cycle — an upload, a Create request or any step of
 * the pipeline behind it — with the method and file it came from.
 */
export function logMmaError(error: unknown) {
  const { message, stack = '' } = error instanceof Error ? error : new Error(String(error))
  const { method, file } = originOf(stack)

  console.error(`[MMA ${new Date().toISOString()}] ${message}\n  in ${method} (${file})`)
}
