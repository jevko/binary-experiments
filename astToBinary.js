import { Buffer } from 'buffer';

export const astToBinary = (ast, bytes = []) => {
  const {subvalues, suffix} = ast

  const {length} = subvalues
  bytes.push(
    length & 0xff,
    (length >> 8 & 0xff),
    // assume rest is 0000
    // (length >> 16 & 0xff),
    // (length >> 32 & 0xff),
  )

  for (const {prefix, value} of subvalues) {
    const buf = Buffer.from(prefix, 'utf8')
    const {length} = buf
    bytes.push(
      length & 0xff,
      (length >> 8 & 0xff),
      (length >> 16 & 0xff),
      (length >> 24 & 0xff),
      // assume rest is 0000
    )

    for (let b of buf) {
      bytes.push(b)
    }

    astToBinary(value, bytes)
  }

  {
    const buf = Buffer.from(suffix, 'utf8')
    const {length} = buf
    bytes.push(
      length & 0xff,
      (length >> 8 & 0xff),
      (length >> 16 & 0xff),
      (length >> 24 & 0xff),
      // assume rest is 0000
    )

    for (let b of buf) {
      bytes.push(b)
    }
  }

  return bytes
}

// BPC = 2
// BPL = 4

// Jevko:
// BPC bytes: Subvalue Count (SC) -- number of elements
// (SC*Subvalue)
// BPL bytes: Suffix Length (SL) -- in bytes
// SL bytes: Suffix (S)

// Subvalue:
// BPL bytes: Prefix Length (PL) -- in bytes
// PL bytes: Prefix (P)
// (Jevko)