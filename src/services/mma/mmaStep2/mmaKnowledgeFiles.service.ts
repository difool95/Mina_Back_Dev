import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { KNOWLEDGE_CATALOG_FILE, KNOWLEDGE_DIR, STILL_ENGINES } from '../../../lib/constants.js'
import { stepTiming } from '../../../lib/date.js'
import {
  KNOWLEDGE_ROUTER,
  estimateTokens,
  knowledgeFacts,
  knowledgeRoute,
} from '../../../lib/mmaStep2/mmaKnowledgeFilesLib.js'
import type {
  CreateAssetOutput,
  KnowledgeCatalog,
  KnowledgeDoc,
  KnowledgeFilesPayload,
  StillLane,
} from '../../../types/mma/mma.types.js'

/** A file of the knowledge folder, with Unix line endings: the sizes and hashes in the receipts are taken on those. */
async function readKnowledge(file: string) {
  const text = (await readFile(join(KNOWLEDGE_DIR, file), 'utf8')).replaceAll('\r\n', '\n')

  return { text, hash: createHash('sha256').update(text).digest('hex') }
}

// Read once, when the backend starts: a guide missing from the folder stops it
// there, rather than failing a customer's generation halfway through.
const catalogFile = await readKnowledge(KNOWLEDGE_CATALOG_FILE)
const catalog: KnowledgeCatalog = JSON.parse(catalogFile.text)
//This line is for reading the knowledge files from the catalog and creating an array of KnowledgeDoc objects. It maps over the guides in the catalog and reads each guide file
//using the readKnowledge function, returning an array of KnowledgeDoc objects with the appropriate properties set.
const docs: KnowledgeDoc[] = await Promise.all(
  catalog.guides.map(async (guide) => {
    const { text, hash } = await readKnowledge(guide.file)
    return { ...guide, content: text, chars: text.length, tokens: estimateTokens(text.length), content_hash: hash }
  }),
)

/**
 * MMA step 2, knowledge files: picks the guides step 3 hands Claude, by
 * checking the production facts of step 1's asset plan against the router
 * catalog. There is no AI call, so it takes no time.
 *
 * Returns the step's `mg_payload`, and the guides it picked with their text.
 */
export function runKnowledgeFiles(lane: StillLane, assetPlan: CreateAssetOutput) {
  const startedAt = new Date()
  //the facts are the result of the step 1 (asset plan), which are used to determine which guides to select from the knowledge catalog. 
  const facts = knowledgeFacts(assetPlan, STILL_ENGINES[lane])

  //This line is for creating the route for the knowledge files by calling the knowledgeRoute function with the catalog, catalogFile.hash, docs, and facts as parameters.
  //The route contains the selected guides and their corresponding information.
  const route = knowledgeRoute(catalog, catalogFile.hash, docs, facts)

  //THIS IS THE PAYLOAD THAT WILL BE RETURNED BY THE FUNCTION. IT CONTAINS THE INPUT, OUTPUT, AND TIMING INFORMATION FOR THE KNOWLEDGE FILES STEP.
  const payload: KnowledgeFilesPayload = {
    error: null,
    input: { lane, mode: 'create', facts },
    output: {
      route,
      method: KNOWLEDGE_ROUTER,
      selected: route.sent_ready_docs.map(({ key, chars, title, tokens }) => ({ key, chars, title, tokens })),
    },
    timing: stepTiming(startedAt),
  }

  return { payload, docs: docs.filter((doc) => route.selected_keys.includes(doc.key)) }
}
