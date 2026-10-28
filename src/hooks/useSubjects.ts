'use client';

import { useEffect, useState } from 'react';
import type { Task } from '../lib/tasks';
import { addSubject, mergeSubjects, removeSubject, renameSubject, summarizeSubjects } from '../lib/subjects';
import { loadSubjects, saveSubjects } from '../lib/subjectStorage';

export function useSubjects(tasks: Task[], replaceSubjectInTasks: (from: string, to: string) => void) {
  const [saved, setSaved] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Igual que useTasks: leer storage solo después de hidratar.
    setSaved(loadSubjects([]));
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) saveSubjects(saved);
  }, [saved, isReady]);

  const subjects = mergeSubjects(saved, tasks);

  function createSubject(name: string): void {
    setSaved(addSubject(subjects, name));
  }

  function editSubject(from: string, to: string): void {
    setSaved(renameSubject(subjects, from, to));
    replaceSubjectInTasks(from, to);
  }

  function deleteSubject(name: string): void {
    // Las tareas se conservan sin materia.
    setSaved(removeSubject(subjects, name));
    replaceSubjectInTasks(name, '');
  }

  return { subjects, summaries: summarizeSubjects(subjects, tasks), createSubject, editSubject, deleteSubject, isReady };
}
