import React from "react";

function isClassComponent(component) {
  return typeof component === "function" &&
    !!component.prototype.isReactComponent
    ? true
    : false;
}

function isFunctionComponent(component) {
  return typeof component === "function" &&
    String(component).includes("return React.createElement")
    ? true
    : false;
}

function isReactComponent(component) {
  return isClassComponent(component) || isFunctionComponent(component)
    ? true
    : false;
}

function isElement(element) {
  return React.isValidElement(element);
}

function isDOMTypeElement(element) {
  return isElement(element) && typeof element.type === "string";
}

function isCompositeTypeElement(element) {
  return isElement(element) && typeof element.type === "function";
}

module.exports = {
  isClassComponent,
  isFunctionComponent,
  isReactComponent,
  isElement,
  isDOMTypeElement,
  isCompositeTypeElement
};
