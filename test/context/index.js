import { resolve } from 'path'
import Catchment from 'catchment'
import { PassThrough } from 'stream'
import { readDirStructure } from 'wrote'
import { debuglog } from 'util'

const LOG = debuglog('pedantry')

const FIXTURES = resolve(__dirname, '../fixtures')

const SOURCE = 'test/fixtures/directory'

const rds = (async () => {
  const p = resolve(FIXTURES, 'directory')
  const { content } = await readDirStructure(p)
  LOG('directory %s read', p)
  return content
})()

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    this._content = await rds
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  get content() {
    return this._content
  }
  async _destroy() {
    console.log('destroy context')
  }
  get fixture() {
    return resolve(FIXTURES, 'directory')
  }
  get catchment() {
    // console.log('getting catchment actually')
    const catchment = new Catchment()
    return {
      catchment,
      promise: catchment.promise,
    }
    // const promise = (async () => {
    //   const res = await c.promise
    //   const { length } = await c.promise
    //   LOG('catchment resolved %s B', length)
    //   return res
    // })()
    // return promise
  }
  get source() {
    return SOURCE
  }
}
