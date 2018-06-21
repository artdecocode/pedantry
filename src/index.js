import { resolve } from 'path'
import { createReadStream } from 'fs'
import { PassThrough } from 'stream'

// this needs to go in `wrote` once it's rewritten

const readFile = (path, name) => {
  const p = resolve(path, name)
  const rs = createReadStream(p)
  return rs
}

const hasFile = (array, file) => {
  return array.some(a => a == file)
}

const processDir = async (stream, path, content) => {
  const k = Object.keys(content)
  const hasIndex = hasFile(k, 'index.md')
  const hasFooter = hasFile(k, 'footer.md')

  const keys = [
    ...(hasIndex ? ['index.md'] : []),
    ...k.filter(a => !['index.md', 'footer.md'].includes(a)).sort(),
    ...(hasFooter ? ['footer.md'] : []),
  ]

  await keys.reduce(async (acc, name) => {
    await acc
    const { type, content: dirContent } = content[name]
    if (type == 'File') {
      await new Promise((r, j) => {
        const rs = readFile(path, name)
        rs.pipe(stream, { end: false })
        rs.on('close', () => {
          r()
        })
        rs.on('error', j)
      })
    } else if (type == 'Directory') {
      await processDir(stream, resolve(path, name), dirContent)
    }
  }, {})
}

const p = async (stream, ...args) => {
  await processDir(stream, ...args)
  stream.end()
}

export default class Pedantry extends PassThrough {
  /**
   * Will read data from files in the directory
   * @constructor
   * @description
   * @param {string} source Path to the root directory.
   * @param {DirStructure} content Content as read by `wrote`.
   *
   * @todo embed wrote's read dir structure
   * @todo implement reading only on read ie change mode
   */
  constructor(source, content) {
    super()
    p(this, source, content)
  }
}
