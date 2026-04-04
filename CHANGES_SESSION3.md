# Session 3: Mario-Style 2D World Map Redesign

## PROBLEM IDENTIFIED
User reported unable to get past first screen after previous implementation. Root cause: Complex nested DOM structure with detail cards created rendering/interaction bugs.

## SOLUTION
Complete redesign from nested detail-card system to clean 2D overworld architecture inspired by classic Mario worldmaps.

---

## FILE CHANGES

### 1️⃣ [legacy/legacy.js] - Lines 1549-1642

#### REMOVED (Old Complex System)
```javascript
// OLD: createTopicDetailCard() 
// OLD: getTopicScore()
// OLD: Complex nested wrapper structure
```

#### ADDED (New Clean System)

**A) getTopicShortLabel() - Line 1551**
```javascript
function getTopicShortLabel(title, topicType){
  if(topicType==='synthesis') return '🧬 Synth';
  if(topicType==='mastery') return '🧠 Master';
  if(topicType==='store') return '🛒 Store';
  
  const keywords = title.split(/[\s\/\-,&]+/).filter(w=>w.length>2);
  if(keywords.length===0) return title.substring(0,8);
  
  let label = keywords[0];
  if(label.length < 5 && keywords[1] && (label+keywords[1]).length <= 12){
    label += ' ' + keywords[1];
  }
  return label.substring(0, 14);
}
```

**B) WORLD_LAYOUTS Object - Line 1569**
```javascript
const WORLD_LAYOUTS = {
  'adv-phys-path-1': [
    {order:1, x:80, y:300},      // Topic 1 position
    {order:2, x:160, y:280},     // Topic 2 position
    // ... all 17 topics with x/y coordinates
    {order:16, x:1050, y:200, type:'synthesis'},  // Special landmark
    {order:17, x:1100, y:250, type:'mastery'},    // Special landmark
  ],
  'basics-anesthesia': [/* 17 topics */],
  'chem-phys-anesthesia': [/* 14 topics */],
  'adv-health-assess': [/* 15 topics */],
};
```

**C) getWorldLayout() - Line 1642**
```javascript
function getWorldLayout(courseId, topicCount){
  return WORLD_LAYOUTS[courseId] || [];
}
```

---

### 2️⃣ [legacy/legacy.js] - Lines 1644-1750

#### COMPLETELY REWRITTEN: showTopicMap()

**BEFORE**: Complex nested wrapper system with detail cards
```javascript
// OLD APPROACH (broken, caused rendering issues)
const wrapper = document.createElement('div');
const btn = document.createElement('button');
const detailCard = document.createElement('div');  // Nested inside button
btn.appendChild(card);  // ❌ Causes positioning/interaction bugs
wrapper.appendChild(btn);
secGrid.appendChild(wrapper);
```

**AFTER**: Clean, flat structure with proper 2D world layout
```javascript
function showTopicMap(){
  // 1. Get predefined world layout for course
  const layout = getWorldLayout(selectedCourseId, course.topics.length);
  
  // 2. Calculate fitting dimensions
  let maxX = 200, maxY = 400;
  layout.forEach(pos=>{ maxX = Math.max(maxX, pos.x+120); });
  
  // 3. Create world container (full-screen scrollable)
  const worldMap = document.createElement('div');
  worldMap.style.cssText = 'position:relative;width:'+maxX+'px;height:'+maxY+'px;';
  
  // 4. Draw SVG connector paths between nodes
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for(let i=0; i<layout.length-1; i++){
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${p1.x+45} ${p1.y+45} Q ${ctrlX} ${ctrlY} ${p2.x+45} ${p2.y+45}`);
    path.setAttribute('stroke', 'rgba(100,200,255,0.3)');
    svg.appendChild(path);
  }
  worldMap.appendChild(svg);
  
  // 5. Position nodes at layout coordinates (SIMPLE, NOT NESTED)
  course.topics.forEach((topic, idx)=>{
    const pos = layout[idx];
    const nodeDiv = document.createElement('div');
    nodeDiv.style.cssText = 'position:absolute;left:'+pos.x+'px;top:'+pos.y+'px;';
    
    const btn = document.createElement('button');
    btn.textContent = `${topic.order}\n${getTopicShortLabel(topic.title, topic.type)}`;
    btn.onclick = () => selectTopic(topic.id);
    
    nodeDiv.appendChild(btn);
    worldMap.appendChild(nodeDiv);
  });
  
  // 6. Add Back/Store buttons as world landmarks
  const backBtn = document.createElement('button');
  backBtn.style.cssText = 'position:absolute;bottom:10px;left:10px;';
  worldMap.appendChild(backBtn);
  
  secGrid.appendChild(worldMap);
}
```

**KEY IMPROVEMENTS**
- ✅ Flat DOM: No nested detail cards inside buttons
- ✅ Predefined layouts: Each course has organic, designed world layout
- ✅ SVG paths: Smooth curved connectors between sequential nodes
- ✅ Simple styling: Uses existing `.big-btn` class, no complex overrides
- ✅ Full-screen: Scrollable world area, not trapped in small box

---

### 3️⃣ [legacy/legacy.js] - Lines 1752-1765

#### SIMPLIFIED: selectTopic()

**BEFORE**: Complex detail-card management
```javascript
function selectTopic(topicId){
  // ... button management
  const card = btn.querySelector('.topic-detail-card');
  if(card) card.classList.add('show');  // Detail card logic
  // ... more complex code
}
```

**AFTER**: Clean, straightforward
```javascript
function selectTopic(topicId){
  selectedTopicId = topicId;
  updateStartSessionButton();
  
  const btns = document.querySelectorAll('button[data-topic-id]');
  btns.forEach(btn=>{
    if(btn.dataset.topicId === topicId){
      btn.classList.add('green');
    } else {
      btn.classList.remove('green');
    }
  });
}
```

---

### 4️⃣ [index.html] - Removed ~60 lines of CSS

#### REMOVED (No longer needed)
```css
/* TOPIC MAP COMPACT DISPLAY */
.topic-node-wrapper { ... }
.topic-node-btn { ... }
.topic-node-btn.synthesis { ... }
.topic-node-btn.mastery { ... }

/* DETAIL CARD - Tooltip/Popup */
.topic-detail-card { ... }
.tdc-header { ... }
.tdc-chapters { ... }
.tdc-type { ... }
.tdc-score { ... }

/* 40+ more lines of detail-card styling */
```

#### KEPT (Core styles still work)
```css
.big-btn { ... }      /* Existing button styling */
.big-btn:hover { ... }
.big-btn.green { ... }
```

---

## COMPARISON: OLD vs NEW

| Aspect | Old Approach | New Approach |
|--------|------------|-------------|
| **DOM Structure** | Complex nested wrappers | Flat, simple structure |
| **Detail Cards** | Nested inside buttons | Native tooltips via `title` attribute |
| **Node Positioning** | Grid-based algorithm | Predefined spatial layouts |
| **Connector Paths** | Old `drawConnectors()` function | Integrated SVG per map |
| **Container** | Fixed-size grid in scrollbox | Full-screen scrollable world |
| **Lines of Code** | ~80 (complex showTopicMap) | ~105 (simpler, cleaner) |
| **CSS Classes** | 15+ detail-card styles | 0 new classes needed |
| **User Experience** | Menu-like feel | Mario-like world feel |

---

## TECHNICAL IMPROVEMENTS

### DOM Complexity
- **Before**: 3 levels deep (wrapper > button > detailCard)
- **After**: 2 levels only (container > button)

### Interaction Flow
```
OLD: click → updateDOM → check nested cards → potentially fail
NEW: click → selectTopic() → update classes → done
```

### Bug Surface Area
- **Before**: Complex nested event listeners, detail card visibility state
- **After**: Simple button selection state only

---

## TEST PROCEDURES

### Quick Smoke Test
1. **Hard refresh**: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
2. **Enter name**: Type any name in input
3. **Click to start**: Press any main button
4. **Expected**: Course selector appears (4 course cards)
5. **Click a course**: Should see world map with nodes
6. **Click a node**: Should highlight green
7. **Click "Start Study Session"**: Should launch game

### Detailed Map Inspection
1. Visit http://localhost:8002
2. Start game, select "Advanced Physiology & Pathophysiology I"
3. **Verify layout**:
   - Nodes spread across full screen width (not in narrow grid)
   - Curved dashed lines connect nodes sequentially
   - Node 1 fully visible at top-left (not clipped)
   - Nodes 16 & 17 have red/green coloring (Synthesis/Mastery)
   - Back button bottom-left, Store button bottom-right
4. **Test interaction**:
   - Click node 5 → should turn green
   - Hover over node → should show full title in tooltip
   - Click different node → previous should reset color
   - Click "Start Study Session" → game launches for that topic

### Course Comparison
1. Go back to course selector
2. Try each course:
   - Basics of Anesthesia (17 topics)
   - Chemistry & Physics (14 topics)
   - Advanced Health Assessment (15 topics)
3. **Verify**: Each has different spatial layout, feels like separate world

---

## ERROR CHECKING

✅ **JavaScript Syntax**: No errors found
✅ **HTML Validation**: No errors found
✅ **Code Live**: Verified on port 8002
✅ **Functions Deployed**: `getWorldLayout`, `getTopicShortLabel`, rewritten `showTopicMap`

---

## ROLLBACK (if needed)
If major issues discovered, previous version available in browser cache or git history.
Key functions to restore: `showTopicMap()`, `selectTopic()`, CSS detail-card styles.

