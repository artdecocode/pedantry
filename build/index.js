const { join } = require('path');
const { createReadStream } = require('fs');
const { PassThrough } = require('stream');
const { debuglog } = require('util');
let readDirStructure = require('@wrote/read-dir-structure'); if (readDirStructure && readDirStructure.__esModule) readDirStructure = readDirStructure.default;
const { getKeys } = require('./lib');

const LOG = debuglog('pedantry')

const processDir = async ({
  stream, source, path = '.', content = {}, reverse = false,
  separator,
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
        stream, source, path: relPath, separator,
      })
    } else if (type == 'Directory') {
      s = await processDir({
        stream, source, path: relPath, content: dirContent, reverse,
        separator,
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
    stream, source, path, separator,
  } = options
  const fullPath = join(source, path)
  stream.emit('file', path)
  if (separator && !stream.justStarted) {
    stream.push(separator)
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

               class Pedantry extends PassThrough {
  /**
   * @constructor
   * Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order: the content of the `index.md` file will go first, then of all files and directories in the folder recursively in a sorted order, and the content of the `footer.md` file will go last if found.
   * @param {string} source Path to the root directory.
   * @param {Options} options Options for Pedantry.
 * @param {boolean} [options.reverse=false] Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. Default `false`.
 * @param {boolean} [options.addNewLine=false] Add a `\n` symbol between the content of each file. Default `false`.
 * @param {boolean} [options.addBlankLine=false] Add a blank line between the content of each file, which is equivalent to inserting `\n\n`. Default `false`.
   */
  constructor(source, options = {}) {
    const {
      reverse = false,
      addNewLine = false,
      addBlankLine = false,
    } = options
    super()
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
 * @prop {boolean} [addNewLine=false] Add a `\n` symbol between the content of each file. Default `false`.
 * @prop {boolean} [addBlankLine=false] Add a blank line between the content of each file, which is equivalent to inserting `\n\n`. Default `false`.
 */


module.exports = Pedantry
//# sourceMappingURL=index.js.map