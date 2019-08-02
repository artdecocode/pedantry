/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml externs */
/** @const */
var _pedantry = {}
/**
 * Options for Pedantry.
 * @record
 */
_pedantry.Options
/**
 * Whether to print files in reverse order, i.e., `30-file.md` before `1-file.md`.
 * @type {boolean|undefined}
 */
_pedantry.Options.prototype.reverse
/**
 * Add a `\n` symbol between the content of each file.
 * @type {boolean|undefined}
 */
_pedantry.Options.prototype.addNewLine
/**
 * Add a blank line between the content of each file, which is equivalent to inserting `\n\n`.
 * @type {boolean|undefined}
 */
_pedantry.Options.prototype.addBlankLine
/**
 * When this is set to `true`, _Pedantry_ will write data in object mode, pushing an object with `file` and `data` properties. New and blank lines will have the `file` property set to `separator`.
 * @type {boolean|undefined}
 */
_pedantry.Options.prototype.includeFilename
/**
 * Don't read files that start with the `.` symbol.
 * @type {boolean|undefined}
 */
_pedantry.Options.prototype.ignoreHidden
