import { DeparturesResponseBody } from "train-schedule-types";

export function hasError(result: DeparturesResponseBody): result is { error: string } {
    return (result as { error: string }).error !== undefined;
  }