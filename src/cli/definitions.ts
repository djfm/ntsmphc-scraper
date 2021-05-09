export const confFileName = 'ntsmphc-scraper.json';

export const ERR_MISSING_ACTION = 1;
export const ERR_UNKNOWN_ACTION = 2;
export const ERR_NO_HELP_TO_DISPLAY = 3;
export const ERR_OPTION_DEFINED_SEVERAL_WAYS = 4;
export const ERR_OPTION_UNDEFINED = 5;
export const ERR_NOT_A_DIRECTORY = 6;
export const ERR_DIR_NOT_EMPTY = 7;

export type Option = {
  primaryName: string;
  description: string;
  aliases: string[];
  defaultValue?: string;
  requiresValue: boolean;
  valueFriendlyName?: string;
};

export type Action = {
  verb: string;
  description: string;
  options: Option[];
};

type UserProvidedStringValidator = {
  validate: (userInput: string) => boolean;
  explainError: (userInput: string) => string;
};

type StringConverter = (userInput: string) => string | number | object;

export type QuestionSpec = {
  question: string[];
  varName: string;
  validators: UserProvidedStringValidator[];
  converter: StringConverter;
};

export type Wizard = {
  questions: QuestionSpec[];
  storageMap: Map<string, string | number | object>
};

export type Prompt = (prompt: string) => Promise<string>;

export type Logger = {
  normal: (message: string) => any;
  warning: (message: string) => any;
  error: (message: string) => any;
  success: (message: string) => any;
};
