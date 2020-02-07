import {
  isClassComponent,
  isFunctionComponent,
  isReactComponent,
  isElement
} from "./componentChecker";

export const weightedRandom = values => {
  const samples = [];

  for (var i = 0; i < values.length; i += 1) {
    if (
      !values[i] ||
      !values[i].hasOwnProperty("value") ||
      !values[i].hasOwnProperty("weight")
    ) {
      throw "all values passed to weightedRandom must have a value and weight field";
    }
    for (var j = 0; j < values[i].weight; j += 1) {
      samples.push(values[i].value);
    }
  }

  return () => samples[Math.floor(Math.random() * samples.length)];
};

export const isReactComponents = components => {
  let isValid = true;

  if (components && _.isArray(components) && components.length > 0) {
    components.forEach(component => {
      if (
        !isClassComponent(component) &&
        !isFunctionComponent(component) &&
        !isReactComponent(component) &&
        !isElement(component)
      ) {
        console.error("component is not a React Component!", component);
        isValid = false;
        return;
      }
    });
  } else {
    console.error("components is not Valid!");
    isValid = false;
  }

  return isValid;
};
