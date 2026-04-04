import { loadState, saveState } from '../core/state.js';
import { filterQuestions } from '../core/questionEngine.js';

export function showMap({course='default'}={}) {
  const map = document.getElementById('level-map');
  const app = document.getElementById('game');
  if (map) map.classList.add('on');
  if (app) app.style.display = 'none';
}

export function hideMap() {
  const map = document.getElementById('level-map');
  if (map) map.classList.remove('on');
}

export function renderSectionList(sections=[]) {
  const path = document.getElementById('map-path');
  if (!path) return;
  path.innerHTML = '';

  sections.forEach(section=>{
    const node = document.createElement('button');
    node.className='map-node';
    node.innerHTML=`<div class='mn-icon'>${section.icon||'📍'}</div><div class='mn-info'><div class='mn-name'>${section.name}</div><div class='mn-desc'>${section.desc||''}</div></div><div class='mn-status'>${section.status||''}</div>`;
    node.onclick = ()=> {
      if(section.onClick) section.onClick(section);
    };
    path.appendChild(node);
  });
}

export function createSimpleCourseMap() {
  const state = loadState();
  const allQuestions = filterQuestions({mode:'all'});
  const section = {
    name:'Hemodynamic Mastery',
    desc:`${allQuestions.length} questions available`,
    status:'Ready',
    icon:'🎯',
    onClick:()=>{
      // no-op for now
      console.debug('Section selected');
    }
  };
  renderSectionList([section]);
}

export function setLastSeen(course, section, lesson) {
  const state = loadState();
  state.lastSeen = {course, section, lesson};
  saveState(state);
}
