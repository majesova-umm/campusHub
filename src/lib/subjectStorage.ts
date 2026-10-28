import { isSubjectList } from './subjects.ts';

export const subjectStorageKey = 'campus-hub-subjects-v1';

export function loadSubjects(fallback: string[]): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(subjectStorageKey) ?? 'null');
    return isSubjectList(saved) ? saved : fallback;
  } catch {
    // Storage bloqueado o contenido inválido: las materias siguen derivándose de las tareas.
    return fallback;
  }
}

export function saveSubjects(subjects: string[]): void {
  try {
    localStorage.setItem(subjectStorageKey, JSON.stringify(subjects));
  } catch {
    // La persistencia es opcional; la sesión sigue en memoria.
  }
}
