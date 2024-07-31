import { uniq } from 'lodash-es'

const ICONS = [
  'seven',
  'cherry',
  'diamond',
  'lemon',
  'horseshoe',
  'cloverleaf',
  'orange',
  'plum',
  'bell',
  'watermelon'
]

export const logResult = state => {
  console.log(ICONS[state.left], ICONS[state.center], ICONS[state.right])
}

export const resultResponse = result => {
  const uniqResult = uniq(Object.values(result))
  const win = uniqResult.length == 1
  const icon = win ? ICONS[uniqResult[0]] : null
  const cashPrize = icon === 'seven'

  return { win, icon, cashPrize }
}
