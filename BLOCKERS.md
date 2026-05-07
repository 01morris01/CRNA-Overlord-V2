# Blockers

## Phase 5.1: Lazy-load question banks per course

**Status:** Deferred. Documented for future implementation.

**Issue:** nodeConfig.js uses 48+ static `import` statements that load all question banks eagerly at module evaluation time. Converting to dynamic `import()` requires making `getQuestionsForNode()`, `getNodesByCourse()`, and all downstream callers (menus.js, questionEngine.js, legacyShim.js) async. This is a breaking architectural change that touches nearly every file.

**What was tried:** Evaluated wrapping question arrays in lazy getters. The synchronous API surface (`NODE_CONFIG[nodeId].questions`) is used in too many places (game engine, normalization, session builder, review mode) to safely convert without a comprehensive test suite.

**Recommended next step:** Introduce an async `loadCourseQuestions(courseId)` function that dynamically imports only the question files for a given course. Call it in `_launchWithMode` before starting a session. Keep NODE_CONFIG metadata (titles, chapters, icons) eagerly loaded (tiny payload). This preserves the sync API for everything except the initial question load.

**Impact without fix:** Initial JS payload is ~2.5 MB (all 48 question banks). Users on slow connections may notice a 1-2 second delay on first load. After caching via the service worker, subsequent loads are instant.
