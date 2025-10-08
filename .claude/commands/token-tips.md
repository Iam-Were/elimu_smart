Show token optimization tips for elimu_smart development.

Display tips for saving 70-90% tokens:

1. **Read Focused Files** (Save 80%):
   - `.claude/mobile-readiness.md` (800 tokens) vs CLAUDE.md (12K tokens)
   - `.claude/integration-status.json` (2K tokens) vs full audit (80K tokens)

2. **Use Slash Commands** (Save 90%):
   - `/integration-status` → instant summary
   - `/mobile-readiness` → quick checklist
   - `/check-backend <function>` → find function location

3. **Check Quick Reference** (Save 70%):
   - `.claude/quick-reference.json` → function → file mapping
   - No grepping needed

4. **Focused Docs** (Coming Soon):
   - `.claude/docs/standards.md` → Code quality rules only
   - `.claude/docs/deployment.md` → VPS deployment only
   - `.claude/docs/mobile-prep.md` → Mobile dev summary

5. **MCP Intelligence Server** (Coming Soon):
   - `getFunctionMapping()` → 500 tokens vs 20K file reads
   - `getHardcodedData()` → instant locations
   - `getMobileReadiness()` → pre-calculated score

**Typical Savings**:
- Before: 80K tokens to audit codebase
- After: 8-15K tokens with optimizations (85% reduction)
