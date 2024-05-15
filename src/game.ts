import prompts from 'prompts'
import minimist from 'minimist'
import Grid from './grid'
import { clear, render } from './ui'

const argv = minimist(process.argv.slice(2), {
  alias: {
    rows: 'r',
    cols: 'c',
    mines: 'm',
    help: 'h'
  }
})

if (argv.help) {
  console.log('minesweeper [opts]')
  console.log('-r, --rows  <n>    (default: 10)')
  console.log('-c, --cols  <n>    (default: 10)')
  console.log('-m, --mines <n>    (default: 15%)')
  console.log('-h, --help')
  process.exit(0)
}

const rows  = argv.rows || 10
const cols  = argv.cols || 10
const mines = argv.mines

function prompt() {
  return prompts([
    {
      type: 'select',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { title: 'Reveal', description: 'check a cell', value: 'reveal' },
        { title: 'Flag',   description: 'mark a cell as a possible mine', value: 'flag' },
        { title: 'Unflag', description: 'unmark a cell as a possible mine', value: 'unflag' },
        { title: 'Quit',   value: 'quit' },
      ],
      initial: 0
    },
    {
      type: 'number',
      name: 'y',
      message: 'Row',
      initial: 1,
      min: 1,
      max: rows
    },
    {
      type: 'number',
      name: 'x',
      message: 'Col',
      initial: 1,
      min: 1,
      max: cols
    }
  ], {
    onSubmit: (_, answer) => {
      if (answer === 'quit') {
        return true
      }
    }
  })
}

async function main() {
  const grid = new Grid(rows, cols, mines)
  let playing = true
  let started = 0
  let tries = 0

  while (playing) {
    clear()
    render(grid)

    const input = await prompt()
    if (!input.action) {// ctrl+c
      break
    }

    const x = input.x - 1
    const y = input.y - 1
    switch (input.action) {
      case 'quit':
        grid.revealAll()
        playing = false
        break

      case 'reveal':
        grid.reveal(x, y)
        started ||= Date.now()
        break

      case 'flag':
        grid.flag(x, y)
        break

      case 'unflag':
        grid.unflag(x, y)
        break
    }

    tries++
    playing &&= !grid.isGameover()
  }

  // Display the fully revealed grid
  clear()
  render(grid, true)
  console.log(grid.isWon()
    ? `   You won in ${tries} tries!`
    : `   Oh no, you lost after ${tries} tries! :(`)

  if (started) {
    let secs = Math.floor((Date.now() - started) / 1000)
    console.log('   Time: ' + secs + ' seconds')
  }
}

main()
