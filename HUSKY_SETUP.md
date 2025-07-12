# Husky Git Hooks Setup

This project is configured with Husky for Git hooks to ensure code quality and consistency.

## What's Configured

### Pre-commit Hook

- **Prettier**: Automatically formats code according to project standards
- **ESLint**: Checks and fixes code quality issues
- **Lint-staged**: Only runs checks on staged files for better performance

### Available Scripts

```bash
# Run pre-commit checks manually
npm run pre-commit

# Check linting without fixing
npm run lint:check

# Check formatting without fixing
npm run format:check

# Fix linting issues
npm run lint

# Fix formatting issues
npm run format
```

### How It Works

1. When you run `git commit`, Husky automatically triggers the pre-commit hook
2. Lint-staged runs Prettier and ESLint only on staged files
3. If there are any errors that can't be auto-fixed, the commit is blocked
4. Fix the issues and try committing again

### Configuration Files

- `.husky/pre-commit` - Git hook configuration
- `package.json` - Lint-staged configuration
- `eslint.config.mjs` - ESLint rules and settings
- `.prettierrc` - Prettier formatting rules

### ESLint Rules

The project uses TypeScript ESLint with the following approach:

- Errors block commits
- Warnings are allowed but should be addressed
- Unsafe TypeScript operations are warnings (not errors)
- Unused variables starting with `_` are ignored

### Prettier Configuration

- Single quotes
- Trailing commas
- 100 character line width
- 2 space indentation
- Auto line endings (Windows/Unix compatible)
