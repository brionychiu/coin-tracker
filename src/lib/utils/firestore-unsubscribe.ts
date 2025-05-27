const listeners: (() => void)[] = [];

export const addUnsubscribe = (fn: () => void) => {
  listeners.push(fn);
};

export const unsubscribeAll = () => {
  listeners.forEach((fn) => fn());
  listeners.length = 0;
};
