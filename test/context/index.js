import { resolve } from 'path'
import Catchment from 'catchment'
import { debuglog } from 'util'

const LOG = debuglog('pedantry')

const FIXTURES = resolve(__dirname, '../fixtures')

const SOURCE = 'test/fixtures/directory'

/**
 * A testing context for the package.
 */
export default class Context {
  // async _init() {
  // }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  get content() {
    return this._content
  }
  // async _destroy() {
  //   console.log('destroy context')
  // }
  get fixture() {
    return resolve(FIXTURES, 'directory')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  get catchment() {
    const catchment = new Catchment()
    return {
      catchment,
      promise: catchment.promise,
    }
  }
  get source() {
    return SOURCE
  }
}
