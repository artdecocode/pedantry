/**
 * Exclude items from the array
 * @param {!Array<!Array<string>, !Array<string>>} acc left to exclude, and non-excluded
 * @param {string} current
 */
export const excludeReducer = (acc, current) => {
  const [ok, ex] = acc
  let i
  if (!ex.length || (i = ex.indexOf(current)) == -1) {
    return [
      [...ok, current],
      ex,
    ]
  }
  const before = ex.slice(0, i)
  const after = ex.slice(i + 1, -1)
  const newExcluded = [...before, ...after]
  return [
    ok,
    newExcluded,
  ]
}

const hasFile = (array, file) => {
  return array.some(a => a == file)
}

/**
 * @param {!Array<string>} files
 * @param {boolean} [reverse]
 */
export const getKeys = (files, reverse) => {
  const hasIndex = hasFile(files, 'index.md')
  const hasFooter = hasFile(files, 'footer.md')

  const excluded = ['index.md', 'footer.md']

  const included = files.filter(f => !excluded.includes(f))

  const sorted = included.sort((a, b) => {
    const res = a.localeCompare(b, undefined, { numeric: true })
    if (reverse) return -res
    return res
  })

  if (hasIndex && hasFooter) {
    return [
      'index.md',
      ...sorted,
      'footer.md',
    ]
  }
  if (hasIndex) {
    return [
      'index.md',
      ...sorted,
    ]
  }
  if (hasFooter) {
    return [
      ...sorted,
      'footer.md',
    ]
  }
  return sorted
}
