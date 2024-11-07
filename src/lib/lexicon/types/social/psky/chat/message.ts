/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'
import * as SocialPskyRichtextFacet from '../richtext/facet'
import * as ComAtprotoRepoStrongRef from '../../../com/atproto/repo/strongRef'

export interface Record {
  /** Text content. */
  content: string
  room: string
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: SocialPskyRichtextFacet.Main[]
  reply?: ComAtprotoRepoStrongRef.Main
  [k: string]: unknown
}

export function isRecord(v: unknown): v is Record {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'social.psky.chat.message#main' ||
      v.$type === 'social.psky.chat.message')
  )
}

export function validateRecord(v: unknown): ValidationResult {
  return lexicons.validate('social.psky.chat.message#main', v)
}
