import execa from 'execa'
import tempy from 'tempy'

const SOLIDARITY = `${process.cwd()}/bin/solidarity`
const origCwd = process.cwd()

beforeAll(() => {
  const tempDir = tempy.directory()
  process.chdir(tempDir)
})

test('default looks for .solidarity file', async done => {
  try {
    await execa(SOLIDARITY)
    done.fail()
  } catch (err) {
    expect(err.code).not.toBe(0)
    done()
  }
})

afterAll(() => {
  process.chdir(origCwd)
})
