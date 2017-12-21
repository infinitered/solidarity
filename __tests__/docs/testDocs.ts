import jetpack from 'fs-jetpack'
import path from 'path'

test('Verify each markdown file has a link in sidebar', () => {
  const markdownFiles = jetpack.find('docs', { matching: ['*.md', '!_*.md'] })
  const sidebarContents = jetpack.read(`docs${path.sep}_sidebar.md`)
  markdownFiles.map(fileName => {
    expect(sidebarContents.includes(fileName.split(path.sep).join('/'))).toBe(true)
  })
})
