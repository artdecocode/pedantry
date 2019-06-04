import { equal } from '@zoroaster/assert'
import { Transform } from 'stream'
import Context from '../context'
import Pedantry from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof Pedantry, 'function')
  },
  async 'emits an error event'() {
    const s = 'not-a-source'
    const pedantry = new Pedantry(s)
    const error = await new Promise(r => {
      pedantry.once('error', (err) => {
        r(err)
      })
    })
    equal(error.message, `ENOENT: no such file or directory, lstat '${s}'`)
  },
  async 'runs in object mode'() {
    const pedantry = new Pedantry('test/fixture/directory', {
      includeFilename: true,
      addBlankLine: true,
    })
    const data = []
    const o = new Transform({
      objectMode: true,
      transform(chunk, encoding, next) {
        data.push(chunk)
        next()
      },
    })
    pedantry.pipe(o)
    await new Promise((r, j) => {
      pedantry.on('end', () => {
        r()
      }).on('error', j)
    })
    return data
  },
}

export default T