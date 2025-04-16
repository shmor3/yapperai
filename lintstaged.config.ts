import micromatch from 'micromatch'
const commands = {
  '**/*': 'pnpm cspell .',
  '**/*.{js,jsx,ts,tsx}': "run-p -c 'biome:lint' 'biome:fmt'",
  '**/*.{ts,tsx}': "run-p -c 'check:type'",
  '**/*.{json,jsonc}': 'pnpm jsonlint .',
  '**/*.md': 'markdownlint-cli ---fix',
}

const files = process.argv.slice(2)
console.log('🔍 Testing with files:', files)

const matchedFiles = Object.entries(commands).reduce(
  (acc: { [key: string]: string[] }, [pattern, command]) => {
    const match = micromatch(files, pattern, {
      ignore: [
        'node_modules/**/*',
        '.cache/**/*',
        '.vscode/**/*',
        '.husky/**/*',
        '.cspell/**/*',
      ],
    })
    console.log(`🔹 Checking pattern "${pattern}":`, match)
    if (match.length > 0) {
      console.log(`✅ Matched for pattern "${pattern}":`, match)
      acc[command] = (acc[command] || []).concat(match)
    }
    return acc
  },
  {},
)

console.log('🛠 Final matched files for execution:', matchedFiles)
