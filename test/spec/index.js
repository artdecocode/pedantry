import { equal } from 'zoroaster/assert'
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
}

export default T
