#!/usr/bin/env node
/**
 * vue-super-crud CLI
 * Install built-in Cursor Agent Skills to the current project's .cursor/skills/
 *
 * Usage:
 *   npx vue-super-crud install-skills
 *   npx vue-super-crud install-skills --force
 */

const fs = require('fs')
const path = require('path')

const COMMAND = process.argv[2]
const FORCE = process.argv.includes('--force')

const SKILLS_SRC = path.join(__dirname, '..', 'skills')
const SKILLS_DEST = path.join(process.cwd(), '.cursor', 'skills')

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry)
    const destPath = path.join(dest, entry)
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function installSkills() {
  if (!fs.existsSync(SKILLS_SRC)) {
    console.error('[vue-super-crud] Error: skills/ directory not found in package')
    process.exit(1)
  }

  if (!fs.existsSync(SKILLS_DEST)) {
    fs.mkdirSync(SKILLS_DEST, { recursive: true })
    console.log('[vue-super-crud] Created .cursor/skills/')
  }

  const skills = fs.readdirSync(SKILLS_SRC).filter(name =>
    fs.statSync(path.join(SKILLS_SRC, name)).isDirectory()
  )

  if (skills.length === 0) {
    console.log('[vue-super-crud] No skills found')
    return
  }

  let installed = 0
  let skipped = 0

  for (const skillName of skills) {
    const src = path.join(SKILLS_SRC, skillName)
    const dest = path.join(SKILLS_DEST, skillName)

    if (fs.existsSync(dest) && !FORCE) {
      console.log('[vue-super-crud] Skip: ' + skillName + ' (already exists, use --force to overwrite)')
      skipped++
      continue
    }

    copyDir(src, dest)
    console.log('[vue-super-crud] Installed: ' + skillName)
    installed++
  }

  console.log('\n[vue-super-crud] Done! Installed: ' + installed + ', Skipped: ' + skipped)
  if (skipped > 0) {
    console.log('[vue-super-crud] Tip: run "npx vue-super-crud install-skills --force" to overwrite')
  }
}

function printHelp() {
  console.log('Usage: npx vue-super-crud <command> [options]')
  console.log('')
  console.log('Commands:')
  console.log('  install-skills    Install Cursor Agent Skills to .cursor/skills/')
  console.log('')
  console.log('Options:')
  console.log('  --force           Overwrite existing skills')
}

if (COMMAND === 'install-skills') {
  installSkills()
} else {
  printHelp()
}