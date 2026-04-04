# EXACT TEST STEPS - Session 3 Mario-Style World Map

## ⚡ BEFORE YOU START
**Critical**: Clear browser cache to avoid old code
- **Mac**: Cmd+Shift+R while on http://localhost:8002
- **Windows/Linux**: Ctrl+Shift+R

---

## TEST 1: Can You Get Past the First Screen?

### Steps
1. Open http://localhost:8002 in browser
2. You should see **SPLASH SCREEN** with:
   - Title: "HEMODYNAMIC OVERLORD v4"
   - Input field for player name
   - Start buttons
3. Enter a name (e.g., "ROOKIE" or "STUDENT")
4. Click any **large red button** to start
5. **Expected Result**: Course selector appears with 4 course cards

### ✅ SUCCESS CRITERIA
- No JavaScript errors in console (F12)
- Course selector is visible with 4 course buttons:
  - Advanced Physiology & Pathophysiology I
  - Basics of Anesthesia
  - Chemistry and Physics for Anesthesia Practice
  - Advanced Health Assessment
- Store button visible at bottom

### ❌ FAILURE CHECKLIST
- [ ] Screen goes blank → Check console for JS errors
- [ ] Can't interact with buttons → Refresh (Cmd+Shift+R)
- [ ] Stuck on splash screen → Try entering name first

---

## TEST 2: Do You See the World Map?

### Steps
1. From course selector, click **"Advanced Physiology & Pathophysiology I"**
2. Wait 1 second for map to render
3. **Expected**: Full-screen scrollable world map appears

### ✅ SUCCESS CRITERIA (Verify ALL)
- [ ] **Map fills screen horizontally** (not cramped in small box)
- [ ] **17 nodes visible** spread across area (not in grid columns)
- [ ] **Nodes have numbers** (1-17) with short labels below
- [ ] **First node (1) is fully visible** at top-left (NOT clipped)
- [ ] **Curved dashed lines** connect nodes sequentially (visible as paths)
- [ ] **Back button** visible bottom-left corner
- [ ] **Store button** visible bottom-right corner
- [ ] **Nodes 16 & 17 have different colors** (red for synthesis, green for mastery)

### Spatial Layout Reference (Advanced Physiology)
```
1. Cell (top-left)
2. Transport (moves right)
3. APs (continues right)
...
15. Renal (top-right area)
16. 🧬 Synth (RED node, right side)
17. 🧠 Master (GREEN node, right side)
```

### ❌ FAILURE CHECKLIST
- [ ] Nodes in rigid 2-column grid → Old algorithm still running, refresh cache
- [ ] Nodes cramped in scrollbox → Container size issue, check CSS
- [ ] No dashed paths between nodes → SVG not rendering
- [ ] Nodes clipped/invisible → Layout coordinates wrong

---

## TEST 3: Can You Select Topics and Start Studying?

### Steps
1. On world map, **hover over a middle node** (e.g., node 5 "Cardiac")
   - **Expected**: Full title appears in tooltip
2. **Click the node**
   - **Expected**: Border glows green/neon green
3. Look for **"START STUDY SESSION"** button (should appear if a node is selected)
4. **Click "START STUDY SESSION"**
   - **Expected**: Game screen launches with questions

### ✅ SUCCESS CRITERIA
- [ ] Node highlights with green glow when clicked
- [ ] Tooltip shows full title on hover (e.g., "Cardiac Muscle and Rhythmic Excitation")
- [ ] Start Study Session button appears and is clickable
- [ ] Game launches with questions from selected topic
- [ ] Game header shows correct topic title

### 🎮 GAMEPLAY VERIFICATION
- Question text displays clearly
- Answer buttons are clickable (3-column grid)
- Game logic works (right/wrong feedback)
- Return to map works after game ends

---

## TEST 4: Different Courses, Different Worlds

### Steps
1. Click **"BACK"** button on map
2. Back on course selector, click **"Basics of Anesthesia"**
3. Observe the resulting world map layout
4. Repeat for **"Chemistry & Physics"** and **"Advanced Health Assessment"**

### ✅ SUCCESS CRITERIA
- [ ] Each course shows different node positions
- [ ] Anesthesia map feels unique (different spatial arrangement)
- [ ] Chemistry map has different feel
- [ ] Health Assessment map is distinctly different
- [ ] **NOT all the same grid layout** (this was the old problem)

### Layout References
- **Advanced Physiology**: L-shaped path, nodes curve down-right, synthesis/mastery on right edge
- **Anesthesia**: Spiral/curved path through middle of screen
- **Chemistry**: Linear progression left-to-right
- **Health Assessment**: Different spatial pattern

---

## TEST 5: Verify No Rendering Bugs

### Steps
1. On any map, scroll around
2. Try clicking all nodes (especially edge nodes like 1 and 17)
3. Try clicking back button → should return to course selector
4. Try clicking store button → should open shop modal

### ✅ SUCCESS CRITERIA
- [ ] All nodes remain clickable (no ghosting or deactivation)
- [ ] Back button works reliably
- [ ] Store button opens shop
- [ ] Can return to course and see map again
- [ ] Clicking multiple nodes works smoothly
- [ ] No visual jitter or rendering artifacts

---

## TEST 6: Mobile Responsiveness

### Steps
1. Open DevTools (F12)
2. Click **Device Toolbar** or **Responsive Design Mode**
3. Set viewport to **375px width** (mobile)
4. Observe map layout

### ✅ SUCCESS CRITERIA
- [ ] Map scrolls horizontally (nodes don't disappear)
- [ ] Back/Store buttons still clickable
- [ ] Nodes still selectable on touch/click
- [ ] No horizontal overlap issues

---

## CONSOLE DEBUGGING (if needed)

### Check JavaScript Errors
```javascript
// In browser console (F12 → Console tab):
// Should see NO errors about:
// - "Cannot read property 'appendChild' of null"
// - "getWorldLayout is not a function"
// - "selectTopic is not a function"

// Check if world layout loaded:
WORLD_LAYOUTS['adv-phys-path-1'].length  // Should return 17
```

### Test Core Functions
```javascript
// Check if functions exist:
typeof getWorldLayout === 'function'  // Should be true
typeof getTopicShortLabel === 'function'  // Should be true
typeof selectTopic === 'function'  // Should be true

// Check course data:
COURSES[0].title  // Should print "Advanced Physiology & Pathophysiology I"
COURSES[0].topics.length  // Should print 17
```

---

## EXPECTED BROWSER CONSOLE OUTPUT
```
[After pressing Start button]
✓ No errors
✓ No warnings about deprecated APIs

[After clicking course]
✓ Map renders silently
✓ SVG connectors draw
✓ Nodes position correctly

[After clicking node]
✓ selectTopic() executes
✓ Button class updates
```

---

## IF SOMETHING BREAKS

### 1️⃣ Stuck on First Screen
```bash
# Hard refresh
Mac: Cmd+Shift+R
Windows: Ctrl+Shift+R
Linux: Ctrl+Shift+R
```

### 2️⃣ Old UI Still Showing (grid layout)
- Clear localStorage: DevTools → Application → Clear Storage
- Then refresh

### 3️⃣ JavaScript Errors
- Open console (F12)
- Copy error message
- Check if error mentions:
  - `getWorldLayout`
  - `showTopicMap`
  - `selectTopic`

### 4️⃣ Nodes Don't Appear
- Verify server is running: `curl http://localhost:8002`
- Check console for DOM manipulation errors
- Verify WORLD_LAYOUTS loaded: `console.log(WORLD_LAYOUTS)`

### 5️⃣ Map Too Small/Cramped
- Check if CSS is applied: DevTools → Elements → inspect #section-grid
- Should see: `width: 1120px` or similar (not 800px)

---

## SUCCESS SIGNATURES

### ✅ You Know It's Working When:
1. **Splash → Course Selector** flows smoothly (no flash/error)
2. **Course → World Map** shows spatially-organized nodes (not grid)
3. **Hover reveals** full title in tooltip
4. **Click selects** node with green glow
5. **Visual paths** connect nodes with dashed curves
6. **Each course feels different** (unique spatial layout)
7. **Game launches** correctly and keeps topic consistency
8. **Back/Store buttons** work as designed landmarks

---

## COMPARISON: Before vs After

### BEFORE (Session 2)
```
❌ Complex nested detail cards
❌ Grid-based positioning
❌ Small scrollable box
❌ Details cards hidden/shown via hover
```

### AFTER (Session 3)
```
✅ Simple flat button structure
✅ Predefined spatial layouts (Mario-like)
✅ Full-screen scrollable world
✅ Native tooltips on hover (title attribute)
✅ Curved SVG connectors between nodes
✅ Each course feels like separate world
✅ Landmarks: Back/Store as world features
```

---

## FINAL VERIFICATION CHECKLIST

- [ ] Can get past splash screen
- [ ] Course selector visible with 4 buttons
- [ ] World map shows 17 nodes for Advanced Physiology
- [ ] Nodes NOT in grid (spatially arranged)
- [ ] Dashed lines connect nodes
- [ ] Node 1 fully visible (not clipped)
- [ ] Synthesis node is RED (node 16)
- [ ] Mastery node is GREEN (node 17)
- [ ] Can click nodes → they turn green
- [ ] Can start study session for selected topic
- [ ] Game has correct topic
- [ ] Back to map works
- [ ] Other courses have different layouts
- [ ] No console errors
- [ ] Works on mobile viewport

**Submit results when ready!**
