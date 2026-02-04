# AGENTS.md

## Purpose

Welcome, agentic contributors! This document provides a canonical source of code style, testing, linting, and contribution guidelines for autonomous and human coders collaborating on this Rust backend repository. Follow these standards to ensure high-quality, idiomatic, and robust code that integrates seamlessly, passes CI, and is maintainable at scale.

> This codebase is a Rust backend, built and tested using Cargo. Code contributions—whether automated or manual—are expected to follow the specifications below to minimize friction and maximize impact.

---

## Quick Reference: Build/Lint/Test Commands

| Task               | Command                                                  |
|--------------------|---------------------------------------------------------|
| Build              | `cargo build`                                           |
| Run all tests      | `cargo test`                                            |
| Run one test       | `cargo test <testname>`                                 |
| Lint (Clippy, strict) | `cargo clippy --all-targets --all-features -- -D warnings` |
| Format code        | `cargo fmt`                                             |
| Check formatting (CI)| `cargo fmt -- --check`                                |
| Run migrations     | Code auto-runs `sqlx::migrate!()` on boot (see main.rs) |

> **Tip:** To filter and run a single test, use any substring of the test function name. E.g., `cargo test my_functionality`.

**Environment requirements:**
- Rust edition: 2024 (as per Cargo.toml)
- Set the `DATABASE_URL` environment variable (loads via dotenvy)
- Use `sqlx` CLI to create databases/migrate if needed (see [sqlx docs](https://docs.rs/sqlx/latest/sqlx/macro.migrate.html))

---

## Code Style Guidelines

### Imports
- Prefer scoped imports, bringing items to the top: `use crate::module::Type;`
- Group external (std, crates.io) imports above local modules.
- Avoid excessive absolute paths in code; use imports to shorten names.

### Formatting
- Adhere to stable `rustfmt` defaults (enforced by `cargo fmt`).
  - Indent with 4 spaces.
  - Prefer lines ≤ 100 chars.
  - Braces on the same line as declarations.
  - Use trailing commas in multi-line lists.
- Format all PRs before submitting: `cargo fmt`

### Types & Explicitness
- All public function signatures must be fully typed.
- Local variables can use type inference, but prefer explicitness for readability where possible.
- Use shadowing only when intent is clear.

### Naming Conventions
- **Types (structs, enums, traits):** `CamelCase`
- **Functions, variables:** `snake_case`
- **Module/file names:** `snake_case`
- **Constants/statics:** `SCREAMING_SNAKE_CASE`
- **Lifetimes:** short (usually `'a`, `'b`)

### Modules & Project Layout
- Put each major module in its own file/subdirectory as needed (e.g., `src/db/`).
- Module-level docs as `//!` at the top when useful.
- Keep modules small and focused.

### Functions & Methods
- Should do one thing and do it well.
- Parameter order: dependencies (e.g. context/pool), then inputs, then options.
- Document all public functions (see "Documentation").
- Avoid very large functions; refactor if > 50 lines when reasonable.

### Constants/Statics
- Place all constants at the top of their module.
- Use `const` for compile-time, `static` for runtime/global state; prefer `const`.

---

## Error Handling

- All recoverable errors should use `Result<T, E>` (favor `anyhow::Result` for app entrypoints).
- Add context to errors using `anyhow::Context`:
  ```rust
  let val = fs::read("foo.txt").context("Failed to read foo.txt")?;
  ```
- Use the `?` operator for propagating errors.
- **Panics** are only allowed for truly unrecoverable logic errors (e.g. assert invariants), not for user/environment issues.
- Avoid unwrap/expect except in test code or if logic has already validated the result.

---

## Testing and Documentation

### Unit & Integration Tests
- Place unit tests as inline `#[cfg(test)]` modules below implementation.
- Name tests after the behavior being validated.
- For integration tests or black-box CLI/API tests, use the `tests/` directory if added.

### Running Tests
- Always run the full suite before creating PRs: `cargo test`
- Run relevant single tests during development for speed: `cargo test some_feature`

### Documentation Standards
- All public modules, types, functions, and constants must have `///` doc comments.
- Document arguments and return values (Rustdoc-friendly style).
- For complex logic, add `//` in-line comments.
- Include `# Example` doc sections for public APIs when possible.

---

## Linting and Formatting Tools

- Use `cargo fmt` for formatting. No `.rustfmt.toml` overrides by default—add one only if consensus reached.
- Run `cargo clippy --all-targets --all-features -- -D warnings` before merge—treat warnings as errors in CI.
- Consider enabling additional strictness (Clippy's pedantic lints) if the project grows.

---

## Branching, CI, and PR Etiquette

- Create feature/fix branches for all nontrivial work. Do not commit directly to `main`/`master`.
- PRs must pass: `cargo build`, `cargo test`, format, and Clippy (strict) without warnings or errors.
- Reviewers may request doc/test/style changes to match this AGENTS.md.
- Write clear, actionable commit messages.
- Squash or rebase PRs as per reviewer/project guidance to keep history clean.

---

## Contributing Guidelines
- Be respectful of existing style—update it only with broad consensus.
- Keep PRs focused: one logical feature/fix per PR.
- Ask maintainers before introducing new third-party dependencies.
- Document all major design or architectural decisions using Markdown files or comments in-code where appropriate.

---

## References / Further Reading

- [Rust Style Guide](https://doc.rust-lang.org/1.0.0/style/)
- [rustfmt project](https://github.com/rust-lang/rustfmt)
- [Clippy official lints](https://rust-lang.github.io/rust-clippy)
- [The anyhow crate for error context](https://docs.rs/anyhow/)
- [SQLx async database toolkit](https://docs.rs/sqlx/)

---

**Keep this AGENTS.md up to date as the project evolves!**

Agents should follow all commands, code style requirements, lint/output expectations, and documentation practices described above for a seamless, future-proof codebase.
