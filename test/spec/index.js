import { equal } from 'zoroaster/assert'
import Context from '../context'
import pedantic from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof pedantic, 'function')
  },
  async 'calls package without error'() {
    await pedantic()
  },
  async 'calls test context method'({ example }) {
    await example()
  },
}

export default T
