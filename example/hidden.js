// import readDirStructure from '@wrote/read-dir-structure'

// ;(async () => {
//   // const { content } = await readDirStructure(HIDDEN)
//   // console.log(content)
//   const HIDDEN = 'example/hidden'
//   const pedantry = new Pedantry(HIDDEN, {
//     ignoreHidden: true,
//   })
//   pedantry.pipe(process.stdout)
// })()
/* start example */
import Pedantry from '../src'

const HIDDEN = 'example/hidden'
const pedantry = new Pedantry(HIDDEN, {
  ignoreHidden: true,
})
pedantry.pipe(process.stdout)
/* end example */