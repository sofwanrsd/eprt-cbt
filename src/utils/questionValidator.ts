import { z } from 'zod';
import { Question } from '../types';

export const QuestionOptionMapSchema = z.object({
  A: z.string().min(1, 'Option A cannot be empty'),
  B: z.string().min(1, 'Option B cannot be empty'),
  C: z.string().min(1, 'Option C cannot be empty'),
  D: z.string().min(1, 'Option D cannot be empty'),
}).and(z.record(z.string(), z.string()));

export const QuestionSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
  section: z.enum(['listening', 'structure', 'reading']),
  part: z.enum(['Part A', 'Part B', 'Part C']),
  questionNumber: z.number().int().positive(),
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long'),
  options: QuestionOptionMapSchema,
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().default('Explanation unavailable.'),
  ruleCategory: z.string().optional(),
  audioUrl: z.string().optional(),
  transcript: z.string().optional(),
  speakerText: z.array(z.string()).optional(),
  passage: z.string().optional(),
  passageId: z.string().optional(),
  source: z.enum(['simulation', 'celoe', 'imported']).optional().default('simulation'),
  sourceTag: z.string().optional(),
});

export type ValidatedQuestion = z.infer<typeof QuestionSchema>;

export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
  question?: Question;
}

export function validateSingleQuestion(raw: unknown): QuestionValidationResult {
  const parsed = QuestionSchema.safeParse(raw);
  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map(
      (iss) => `${iss.path.join('.')}: ${iss.message}`
    );
    return { isValid: false, errors: errorMessages };
  }

  const q = parsed.data as Question;
  const semanticErrors: string[] = [];

  // Check if correctAnswer exists in options and is not empty or dummy placeholder
  const correctOptionText = q.options[q.correctAnswer];
  if (!correctOptionText || correctOptionText.trim() === '' || correctOptionText.trim() === '-') {
    semanticErrors.push(`Correct answer '${q.correctAnswer}' references an empty option.`);
  }

  // Ensure prompt does not contain corrupted JSON escape sequences
  if (q.prompt.includes('__cf_chl') || q.prompt.includes('<!DOCTYPE')) {
    semanticErrors.push('Prompt contains web scraping corruption or HTML markup artifacts.');
  }

  // Section specific checks
  if (q.section === 'listening' && (!q.speakerText || q.speakerText.length === 0) && !q.audioUrl) {
    semanticErrors.push('Listening question missing both dialogue transcript and audio source.');
  }

  if (q.section === 'reading' && (!q.passage || q.passage.trim().length < 20)) {
    semanticErrors.push('Reading question missing required reading passage text.');
  }

  if (semanticErrors.length > 0) {
    return { isValid: false, errors: semanticErrors, question: q };
  }

  return { isValid: true, errors: [], question: q };
}

export function validateQuestionBank(questions: unknown[]): {
  validQuestions: Question[];
  invalidCount: number;
  duplicateCount: number;
  errors: Array<{ index: number; id?: number; errors: string[] }>;
} {
  const validQuestions: Question[] = [];
  const seenIds = new Set<number>();
  const seenPrompts = new Set<string>();
  let duplicateCount = 0;
  const errorList: Array<{ index: number; id?: number; errors: string[] }> = [];

  questions.forEach((raw, idx) => {
    const res = validateSingleQuestion(raw);
    if (!res.isValid || !res.question) {
      errorList.push({
        index: idx,
        id: (raw as any)?.id,
        errors: res.errors,
      });
      return;
    }

    const q = res.question;

    // Check duplicate ID
    if (seenIds.has(q.id)) {
      duplicateCount++;
      // Auto-assign new unique ID if duplicate to avoid collisions
      q.id = Date.now() + idx;
    }
    seenIds.add(q.id);

    // Check duplicate prompt within same context (dialogue/passage)
    const contextPrefix = q.section === 'listening'
      ? (q.speakerText || []).join('|')
      : q.section === 'reading'
      ? (q.passageId || q.passage?.slice(0, 60) || '')
      : '';
    const promptKey = `${q.section}:${contextPrefix}:${q.prompt.trim().toLowerCase()}`;
    if (seenPrompts.has(promptKey)) {
      duplicateCount++;
      // Skip exact duplicate questions
      return;
    }
    seenPrompts.add(promptKey);

    validQuestions.push(q);
  });

  return {
    validQuestions,
    invalidCount: errorList.length,
    duplicateCount,
    errors: errorList,
  };
}
