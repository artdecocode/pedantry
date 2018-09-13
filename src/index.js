import { join } from 'path'
import { createReadStream } from 'fs'
import { PassThrough } from 'stream'
import { debuglog } from 'util'
import readDirStructure from '@wrote/read-dir-structure'
import { getKeys } from './lib'

const LOG = debuglog('pedantry')

const processDir = async ({
  stream, source, path = '.', content = {}, reverse = false,
  addNewLine,
}) => {
  const k = Object.keys(content)

  const keys = getKeys(k, reverse)

  const size = await keys.reduce(async (acc, name) => {
    let totalSize = await acc
    const { type, content: dirContent } = content[name]
    const relPath = join(path, name)

    let s
    if (type == 'File') {
      s = await processFile({
        stream, source, path: relPath, addNewLine,
      })
    } else if (type == 'Directory') {
      s = await processDir({
        stream, source, path: relPath, content: dirContent, reverse,
        addNewLine,
      })
    }
    totalSize += s
    return totalSize
  }, 0)

  LOG('dir %s size: %s B', path, size)
  return size
}

/**
 * @param {{ stream: Pedantry}} options
 */
const processFile = async (options) => {
  const {
    stream, source, path, addNewLine,
  } = options
  const fullPath = join(source, path)
  stream.emit('file', path)
  if (addNewLine && !stream.justStarted) {
    stream.push('\n')
  }
  const size = await new Promise((r, j) => {
    let s = 0
    createReadStream(fullPath)
      .on('data', (d) => {
        s += d.byteLength
      })
      .on('close', () => {
        r(s)
      })
      .on('error', (err) => {
        j(err)
      })
      .pipe(stream, { end: false })
  })
  stream.justStarted = false
  LOG('file %s :: %s B', fullPath, size)
  return size
}

// * @todo implement reading only on read ie change mode

export default class Pedantry extends PassThrough {
  /**
   * @constructor
   * Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order: the content of the `index.md` file will go first, then of all files and directories in the folder recursively in a sorted order, and the content of the `footer.md` file will go last if found.
   * @param {string} source Path to the root directory.
   * @param {Options} options Options for Pedantry.
 * @param {boolean} [options.reverse=false] Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. Default `false`.
   */
  constructor(source, options = {}) {
    const {
      reverse = false,
      addNewLine = false,
    } = options
    super()
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
          addNewLine,
        })
      } catch (err) {
        this.emit('error', err)
      } finally {
        this.end()
      }
    })()
  }
}

/**
 * A file event.
 * @event Pedantry#file
 * @param {string} file A path to the file currently being processed relative to the `Pedantry` source.
 */

/* documentary types/index.xml */
/**
 * @typedef {Object} Options Options for Pedantry.
 * @prop {boolean} [reverse=false] Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. Default `false`.
 */
