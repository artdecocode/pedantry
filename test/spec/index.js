import { equal } from 'zoroaster/assert'
import Context from '../context'
import pedantry from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof pedantry, 'function')
  },
  async 'calls package without error'() {
    await pedantry()
  },
  async 'calls test context method'({ example }) {
    await example()
  },
}

export default T
