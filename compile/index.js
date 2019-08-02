const _Pedantry = require('./pedantry')

class Pedantry extends _Pedantry {
  /**
   * Upon creation, `Pedantry` will start reading files in the `source` directory recursively in the following order: the content of the `index.md` file will go first, then of all files and directories in the folder recursively in a sorted order, and the content of the `footer.md` file will go last if found.
   * @param {string} source Path to the root directory.
   * @param {_pedantry.Options} [options] Options for Pedantry.
   */
  constructor(source, options) {
    super(source, options)
  }
}

module.exports = Pedantry

/* typal types/index.xml closure noSuppress */
/**
 * @typedef {_pedantry.Options} Options `＠record` Options for Pedantry.
 */
/**
 * @typedef {Object} _pedantry.Options `＠record` Options for Pedantry.
 * @prop {boolean} [reverse=false] Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`. Default `false`.
 * @prop {boolean} [addNewLine=false] Add a `\n` symbol between the content of each file. Default `false`.
 * @prop {boolean} [addBlankLine=false] Add a blank line between the content of each file, which is equivalent to inserting `\n\n`. Default `false`.
 * @prop {boolean} [includeFilename=false] When this is set to `true`, _Pedantry_ will write data in object mode, pushing an object with `file` and `data` properties. New and blank lines will have the `file` property set to `separator`. Default `false`.
 * @prop {boolean} [ignoreHidden=false] Don't read files that start with the `.` symbol. Default `false`.
 */
