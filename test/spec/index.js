import { equal } from 'zoroaster/assert'
import SnapshotContext from 'snapshot-context'
import Context from '../context'
import Pedantry from '../../src'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  'is a function'() {
    equal(typeof Pedantry, 'function')
  },
  async 'reads the directory and puts files together'(
    { source, content, catchment: { catchment, promise }, SNAPSHOT_DIR },
    { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const pedantry = new Pedantry(source, content)
    pedantry.pipe(catchment)
    const res = await promise
    await test('compiled.md', res.trim())
  },
}

export default T
