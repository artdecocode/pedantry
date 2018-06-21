import { resolve } from 'path'
import { createReadStream } from 'fs'
import { PassThrough } from 'stream'
import { debuglog } from 'util'
import { getKeys } from './lib'

const LOG = debuglog('pedantry')

/**
 * @param {Pedantry} stream
 * @param {string} path
 * @param {object} content
 */
const processDir = async (stream, path, content) => {
  const k = Object.keys(content)

  const keys = getKeys(k)

  const size = await keys.reduce(async (acc, name) => {
    let totalSize = await acc
    const { type, content: dirContent } = content[name]
    const fullPath = resolve(path, name)

    let s
    if (type == 'File') {
      s = await processFile(stream, fullPath)
    } else if (type == 'Directory') {
      s = await processDir(stream, fullPath, dirContent)
    }
    totalSize += s
    return totalSize
  }, 0)

  LOG('dir %s size: %s B', path, size)
  return size
}

const processFile = async (stream, fullPath) => {
  const size = await new Promise((r, j) => {
    let s = 0
    createReadStream(fullPath)
      .on('data', (d) => {
        s += d.byteLength
      })
      .on('close', () => {
        r(s)
      })
      .on('error', j)
      .pipe(stream, { end: false })
  })
  LOG('file %s :: %s B', fullPath, size)
  return size
}

const p = async (stream, ...args) => {
  await processDir(stream, ...args)
  stream.end()
}

export default class Pedantry extends PassThrough {
  /**
   * @constructor
   * Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order: the content of the `index.md` file will go first, then of all files and directories in the folder recursively in a sorted order, and the content of the `footer.md` file will go last if found.
   * @description
   * @param {string} source Path to the root directory.
   * @param {DirStructure} content Content as read by `wrote`.
   *
   * @todo embed wrote's read dir structure (20% progress)
   * @todo implement reading only on read ie change mode
   */
  constructor(source, content) {
    super()
    p(this, source, content)
  }
}
