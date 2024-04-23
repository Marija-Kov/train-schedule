import { Result } from "./types";

export function hasError(result: Result): result is { error: string } {
    return (result as { error: string }).error !== undefined;
  }