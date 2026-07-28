import { AlgorithmStep } from "./StepTypes";

export class StepRecorder {
  private steps: AlgorithmStep[] = [];

  record(step: AlgorithmStep): void {
    this.steps.push(step);
  }

  getSteps(): AlgorithmStep[] {
    return this.steps;
  }
}