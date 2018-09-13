import { join } from 'path'
import { createReadStream } from 'fs'
import { PassThrough } from 'stream'
import { debuglog } from 'util'
import readDirStructure from '@wrote/read-dir-structure'
import { getKeys } from './lib'

const LOG = debuglog('pedantry')

/**
 * @param {Pedantry} stream
 * @param {string} path
 * @param {object} content
 * @param {boolean} [reverse=false]
 */
const processDir = async (stream, source, path, content = {}, reverse = false) => {
  const k = Object.keys(content)

  const keys = getKeys(k, reverse)

  const size = await keys.reduce(async (acc, name) => {
    let totalSize = await acc
    const { type, content: dirContent } = content[name]
    const relPath = join(path, name)

    let s
    if (type == 'File') {
      s = await processFile(stream, source, relPath)
    } else if (type == 'Directory') {
      s = await processDir(stream, source, relPath, dirContent, reverse)
    }
    totalSize += s
    return totalSize
  }, 0)

  LOG('dir %s size: %s B', path, size)
  return size
}

/**
 *
 * @param {Pedantry} stream
 * @param {string} fullPath
 */
const processFile = async (stream, source, path) => {
  const fullPath = join(source, path)
  stream.emit('file', path)
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
  LOG('file %s :: %s B', fullPath, size)
  return size
}

// * @todo implement reading only on read ie change mode

export default class Pedantry extends PassThrough {
  /**
   * @constructor
   * Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order: the content of the `index.md` file will go first, then of all files and directories in the folder recursively in a sorted order, and the content of the `footer.md` file will go last if found.
   *
   * @param {string} source Path to the root directory.
   * @param {Options} options Options for Pedantry.
 * @param {boolean} [options.reverse=false] Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. Default `false`.
   */
  constructor(source, options = {}) {
    const {
      reverse = false,
    } = options
    super()
    ;(async () => {
      let content
      try {
        ({ content } = await readDirStructure(source))
      } catch (err) {
        const e = new Error(err.message)
        this.emit('error', e)
      }
      try {
        await processDir(this, source, '.', content, reverse)
      } catch (err) {
        this.emit('error', err)
      } finally {
        this.end()
      }
    })()
  }
}

/* documentary types/index.xml */
/**
 * @typedef {Object} Options Options for Pedantry.
 * @prop {boolean} [reverse=false] Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. Default `false`.
 */
