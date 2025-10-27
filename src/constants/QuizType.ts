export const QUIZ_TYPE = {
    MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
    MATCHING: 'MATCHING',
    FILL_IN_BLANK: 'FILL_IN_BLANK'
} as const;

export type QuizType = typeof QUIZ_TYPE[keyof typeof QUIZ_TYPE];
