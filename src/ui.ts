import color from 'picocolors'
import Grid from './grid'

export function clear() {
  console.log('\x1b[2J')
}

export function render(grid: Grid, all = false) {
  const narray = (n: number) => Array.from({ length: n }, (_x, i) => i)
  const npad   = (n: number) => String(n).padStart(2, ' ')
  const cnum   = (n: number) => color[n == 1 ? 'blue' : n === 2 ? 'green' : 'yellow'](n)
  const axis   = (n: number) => color.cyan(npad(n + 1))
  const rows   = grid.rows
  const cols   = grid.cols
  const pre    = '   '
  const vert   = color.dim('│')
  const top    = color.dim(pre + '┌' + '───┬'.repeat(cols - 1) + '───┐')
  const mid    = color.dim(pre + '├' + '───┼'.repeat(cols - 1) + '───┤')
  const bot    = color.dim(pre + '└' + '───┴'.repeat(cols - 1) + '───┘')
  const flag   = color.red('⚑')
  const bomb   = color.red('◎')
  const blank  = '▒'
  const empty  = '⋅'

  // console.log(pre + ' BOMBS: ' + npad(grid.bombs - grid.numFlagged()))
  // console.log('')
  console.log(pre + ' ' + narray(cols).map(n => axis(n)).join('  '))
  console.log(top)

  let str: string
  for (let y = 0; y < rows; y++) {
    str = axis(y) + ' ' + vert
    for (let x = 0; x < cols; x++) {
      let cell = grid.cell(x, y)
      str += ' '
      str += (all || cell.revealed)
        ? cell.bomb
          ? bomb
          : cell.neighbors > 0
            ? cnum(cell.neighbors)
            : empty
        : cell.flagged
          ? flag
          : blank

      str += ' ' + vert
    }

    console.log(str)
    console.log(y >= grid.rows - 1 ? bot : mid)
  }

  console.log('')
}
