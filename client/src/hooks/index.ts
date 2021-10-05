export const useEvaluateQueryHook = (formula: string): number | false => {
  try {
    var func = new Function("return " + formula);
    return func();
  } catch {
    return false;
  }
};
