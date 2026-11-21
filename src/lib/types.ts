export type StepType = 'problem' | 'concept' | 'solution' | 'insight' | 'trade-off' | 'recap';

export interface CodeExample {
  code: string;
  language?: string;
  title?: string;
  beforeCode?: string;
}

export interface LessonStep {
  id: string;
  title: string;
  subtitle: string;
  type: StepType;
  content: string; // Markdown formatted educational text
  keyIdea?: string;
  codeExample?: CodeExample;
  interviewTip?: string;
  diagramState: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  moduleId: string;
  moduleTitle: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: LessonStep[];
  youllLearn: string[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface CourseProgress {
  completedSteps: Record<string, number[]>; // slug -> array of completed step indices
  currentLessonSlug: string;
  currentStepIndex: number;
}
