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
    { source, catchment: { catchment, promise }, SNAPSHOT_DIR },
    { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const pedantry = new Pedantry(source)
    pedantry.pipe(catchment)
    const res = await promise
    await test('compiled.md', res.trim())
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
