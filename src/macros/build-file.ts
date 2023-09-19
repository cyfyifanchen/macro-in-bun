import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
// parse markdown to html
import { parse } from 'marked'

export async function buildFile() {
  const dir = `${process.cwd()}/docs`

  const dirRes = `${process.cwd()}/generated-html`
  if (!existsSync(dirRes)) {
    mkdirSync(dirRes)
  }

  const pages: string[] = []
  for (const file of readdirSync(dir)) {
    if (file.endsWith('.md')) {
      const baseName = file.replace('.md', '')
      pages.push(baseName)

      // Bun.file is Bun Zig native function, power as it is, Bun Author says it is like a "supercharged" version of Deno.readFile
      const mdFile = await Bun.file(`${dir}/${file}`)
      const markdown = await mdFile.text()
      const content = parse(markdown)

      // Again, Bun.write is Bun Zig native function, power as it is, Bun Author says it is like a "supercharged" version of Deno.writeFile
      Bun.write(`${dirRes}/${baseName}.html`, content)
    } else {
      copyFileSync(`${dir}/${file}`, `${dirRes}/${file}`)
    }
  }
  return pages
}
