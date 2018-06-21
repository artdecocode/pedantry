import { equal } from 'zoroaster/assert'
import Context from '../context'
import Pedantry from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof Pedantry, 'function')
  },
  async 'calls package without error'({ source, content, catchment: { catchment, promise } }) {
    const pedantry = new Pedantry(source, content)
    pedantry.pipe(catchment)
    const res = await promise
  },
}

export default T
