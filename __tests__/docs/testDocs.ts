import jetpack from 'fs-jetpack'

test('Verify each markdown file has a link in sidebar', () => {
  const markdownFiles = jetpack.find('docs', { matching: ['*.md', '!_*.md'] })
  const sidebarContents = jetpack.read('docs/_sidebar.md')
  markdownFiles.map((fileName) => {
    expect(sidebarContents.includes(fileName)).toBe(true)
  })
})
