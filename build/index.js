const { join } = require('path');
const { createReadStream } = require('fs');
const { PassThrough } = require('stream');
const { debuglog } = require('util');
let readDirStructure = require('@wrote/read-dir-structure'); if (readDirStructure && readDirStructure.__esModule) readDirStructure = readDirStructure.default;
const { getKeys } = require('./lib');

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
 * @param {{ stream: Pedantry}} options
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

class Pedantry extends PassThrough {
  /**
   * @constructor
   * Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order: the content of the `index.md` file will go first, then of all files and directories in the folder recursively in a sorted order, and the content of the `footer.md` file will go last if found.
   * @param {string} source Path to the root directory.
   * @param {Options} options Options for Pedantry.
   * @param {boolean} [options.reverse=false] Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. Default `false`.
   * @param {boolean} [options.addNewLine=false] Add a `\n` symbol between the content of each file. Default `false`.
   * @param {boolean} [options.addBlankLine=false] Add a blank line between the content of each file, which is equivalent to inserting `\n\n`. Default `false`.
   * @param {boolean} [options.includeFilename=false] When this is set to `true`, _Pedantry_ will write data in object mode, pushing an object with `file` and `data` properties. New and blank lines will have the `file` property set to `separator`. Default `false`.
   * @param {boolean} [options.ignoreHidden=false] Don't read files that start with the `.` symbol. Default `false`.
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

/**
 * A file event.
 * @event Pedantry#file
 * @param {string} file A path to the file currently being processed relative to the `Pedantry` source.
 */

/* typal types/index.xml closure */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} Options Options for Pedantry.
 * @prop {boolean} [reverse=false] Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. Default `false`.
 * @prop {boolean} [addNewLine=false] Add a `\n` symbol between the content of each file. Default `false`.
 * @prop {boolean} [addBlankLine=false] Add a blank line between the content of each file, which is equivalent to inserting `\n\n`. Default `false`.
 * @prop {boolean} [includeFilename=false] When this is set to `true`, _Pedantry_ will write data in object mode, pushing an object with `file` and `data` properties. New and blank lines will have the `file` property set to `separator`. Default `false`.
 * @prop {boolean} [ignoreHidden=false] Don't read files that start with the `.` symbol. Default `false`.
 */


module.exports = Pedantry