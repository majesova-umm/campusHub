import type { Task } from './tasks.ts';

export interface SubjectSummary {
  name: string;
  total: number;
  pending: number;
}

export const subjectNameMaxLength = 80;

function sameName(a: string, b: string): boolean {
  return a.toLocaleLowerCase('es') === b.toLocaleLowerCase('es');
}

export function isSubjectList(value: unknown): value is string[] {
  return Array.isArray(value) &&
    value.every(name => typeof name === 'string' && name.trim().length > 0 && name.length <= subjectNameMaxLength) &&
    new Set(value).size === value.length;
}

export function validateSubjectName(name: string, subjects: string[], current?: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'Escribe el nombre de la materia.';
  if (trimmed.length > subjectNameMaxLength) {
    return `El nombre debe tener como máximo ${subjectNameMaxLength} caracteres.`;
  }
  if (subjects.some(subject => subject !== current && sameName(subject, trimmed))) {
    return 'Ya existe una materia con ese nombre.';
  }
  return '';
}

// Las materias guardadas se combinan con las que ya usan las tareas para no perder ninguna.
export function mergeSubjects(saved: string[], tasks: Task[]): string[] {
  const names = [...saved, ...tasks.map(task => task.subject?.trim() ?? '')];
  return [...new Set(names.filter(Boolean))];
}

export function addSubject(subjects: string[], name: string): string[] {
  const error = validateSubjectName(name, subjects);
  if (error) throw new Error(error);
  return [...subjects, name.trim()];
}

export function renameSubject(subjects: string[], from: string, to: string): string[] {
  const error = validateSubjectName(to, subjects, from);
  if (error) throw new Error(error);
  return subjects.map(subject => subject === from ? to.trim() : subject);
}

export function removeSubject(subjects: string[], name: string): string[] {
  return subjects.filter(subject => subject !== name);
}

export function summarizeSubjects(subjects: string[], tasks: Task[]): SubjectSummary[] {
  return subjects.map(name => {
    const related = tasks.filter(task => task.subject === name);
    return { name, total: related.length, pending: related.filter(task => task.status !== 'completed').length };
  });
}

function withSubject(task: Task, subject: string): Task {
  const { subject: previous, ...rest } = task;
  return subject ? { ...rest, subject } : rest;
}

export function assignTaskSubject(tasks: Task[], id: string, subject: string): Task[] {
  const trimmed = subject.trim();
  if (trimmed.length > subjectNameMaxLength) throw new Error('Selecciona una materia válida.');
  return tasks.map(task => task.id === id ? withSubject(task, trimmed) : task);
}

export function replaceTaskSubject(tasks: Task[], from: string, to: string): Task[] {
  const trimmed = to.trim();
  return tasks.map(task => task.subject === from ? withSubject(task, trimmed) : task);
}
