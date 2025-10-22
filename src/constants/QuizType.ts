export const QUIZ_TYPE = {
    MULTIPLE_CHOICE: 'Multiple Choice',
    MATCHING: 'Matching',
    FILL_IN_BLANK: 'Fill in the Blank'
} as const;

export type QuizType = typeof QUIZ_TYPE[keyof typeof QUIZ_TYPE];
