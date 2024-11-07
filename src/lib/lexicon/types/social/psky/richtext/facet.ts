/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'

/** Annotation of a sub-string within rich text. */
export interface Main {
  index: ByteSlice
  features: (Mention | Link | Room | { $type: string; [k: string]: unknown })[]
  [k: string]: unknown
}

export function isMain(v: unknown): v is Main {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    (v.$type === 'social.psky.richtext.facet#main' ||
      v.$type === 'social.psky.richtext.facet')
  )
}

export function validateMain(v: unknown): ValidationResult {
  return lexicons.validate('social.psky.richtext.facet#main', v)
}

/** Facet feature for mention of another account. The text is usually a handle, including a '@' prefix, but the facet reference is a DID. */
export interface Mention {
  did: string
  [k: string]: unknown
}

export function isMention(v: unknown): v is Mention {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'social.psky.richtext.facet#mention'
  )
}

export function validateMention(v: unknown): ValidationResult {
  return lexicons.validate('social.psky.richtext.facet#mention', v)
}

/** Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL. */
export interface Link {
  uri: string
  [k: string]: unknown
}

export function isLink(v: unknown): v is Link {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'social.psky.richtext.facet#link'
  )
}

export function validateLink(v: unknown): ValidationResult {
  return lexicons.validate('social.psky.richtext.facet#link', v)
}

/** Facet feature for a room. The text usually includes a '#' prefix, but the facet reference should not (except in the case of a room tag that includes a '#' prefix) - TODO: update when rooms are actually implemented */
export interface Room {
  room: string
  [k: string]: unknown
}

export function isRoom(v: unknown): v is Room {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'social.psky.richtext.facet#room'
  )
}

export function validateRoom(v: unknown): ValidationResult {
  return lexicons.validate('social.psky.richtext.facet#room', v)
}

/** Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text. NOTE: some languages, like Javascript, use UTF-16 or Unicode codepoints for string slice indexing; in these languages, convert to byte arrays before working with facets. */
export interface ByteSlice {
  byteStart: number
  byteEnd: number
  [k: string]: unknown
}

export function isByteSlice(v: unknown): v is ByteSlice {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'social.psky.richtext.facet#byteSlice'
  )
}

export function validateByteSlice(v: unknown): ValidationResult {
  return lexicons.validate('social.psky.richtext.facet#byteSlice', v)
}
