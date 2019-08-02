import { join } from 'path'
import { createReadStream } from 'fs'
import { PassThrough } from 'stream'
import { debuglog } from 'util'
import readDirStructure from '@wrote/read-dir-structure'
import { getKeys } from './lib'

const LOG = debuglog('pedantry')

const processDir = async ({
  stream, source, path = '.', content = {}, reverse = false,
  separator, includeFilename, ignoreHidden,
}) => {
  const k = Object.keys(content)

  const keys = getKeys(k, reverse)

  const size = await keys.reduce(async (acc, name) => {
    let totalSize = await acc
    const { type, content: dirContent } = content[name]
    const relPath = join(path, name)

    let s
    if (type == 'File') {
      const shouldIgnore = ignoreHidden && name.startsWith('.')
      if (!shouldIgnore) s = await processFile({
        stream, source, path: relPath, separator, includeFilename,
      })
    } else if (type == 'Directory') {
      s = await processDir({
        stream, source, path: relPath, content: dirContent, reverse,
        separator, includeFilename, ignoreHidden,
      })
    }
    totalSize += s
    return totalSize
  }, 0)

  LOG('dir %s size: %s B', path, size)
  return size
}

/**
 * @param {Object} options
 * @param {Pedantry} options.stream
 */
const processFile = async (options) => {
  const {
    stream, source, path, separator, includeFilename,
  } = options
  const fullPath = join(source, path)
  stream.emit('file', path)
  if (separator && !stream.justStarted) {
    if (includeFilename) {
      stream.push({ file: 'separator', data: separator })
    } else {
      stream.push(separator)
    }
  }
  const size = await new Promise((r, j) => {
    let s = 0
    const rs = createReadStream(fullPath)
    rs.on('data', (d) => {
      s += d.byteLength
    }).on('error', (err) => {
      j(err)
    }).on('close', () => {
      r(s)
    })
    if (includeFilename) {
      rs.on('data', (data) => {
        stream.push({ file: fullPath, data: `${data}` })
      })
    } else {
      rs.pipe(stream, { end: false })
    }
  })
  stream.justStarted = false
  LOG('file %s :: %s B', fullPath, size)
  return size
}

// * @todo implement reading only on read ie change mode

export default class Pedantry extends PassThrough {
  /**
   * Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order: the content of the `index.md` file will go first, then of all files and directories in the folder recursively in a sorted order, and the content of the `footer.md` file will go last if found.
   * @param {string} source Path to the root directory.
   * @param {_pedantry.Options} [options] Options for Pedantry.
   */
  constructor(source, options = {}) {
    const {
      reverse = false,
      addNewLine = false,
      addBlankLine = false,
      includeFilename = false,
      ignoreHidden = false,
    } = options
    super({
      objectMode: includeFilename,
    })
    let separator
    if (addNewLine) separator = '\n'
    else if (addBlankLine) separator = '\n\n'
    this.justStarted = true
    ;(async () => {
      let content
      try {
        ({ content } = await readDirStructure(source))
      } catch (err) {
        const e = new Error(err.message)
        this.emit('error', e)
      }
      try {
        await processDir({
          stream: this,
          source,
          content,
          reverse,
          separator,
          includeFilename,
          ignoreHidden,
        })
      } catch (err) {
        this.emit('error', err)
      } finally {
        this.end()
      }
    })()
  }
}

// /**
//  * A file event.
//  * @event Pedantry#file
//  * @param {string} file A path to the file currently being processed relative to the `Pedantry` source.
//  */

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').Options} _pedantry.Options
 */