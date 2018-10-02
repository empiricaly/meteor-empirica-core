import React from "react";

import { Classes, Icon } from "@blueprintjs/core";

export const Heading = ({
  level = "h1",
  children,
  icon,
  iconSize,
  className,
  ...rest
}) => {
  const classNames = [Classes.HEADING];
  if (className) {
    classNames.push(className);
  }
  return React.createElement(
    level,
    { className: classNames.join(" "), ...rest },
    <>
      {icon ? (
        <>
          <Icon icon={icon} iconSize={iconSize} />{" "}
        </>
      ) : null}
      {children}
    </>
  );
};

export const H1 = props => {
  return <Heading level="h1" {...props} />;
};

export const H2 = props => {
  return <Heading level="h2" {...props} />;
};

export const H3 = props => {
  return <Heading level="h3" {...props} />;
};

export const H4 = props => {
  return <Heading level="h4" {...props} />;
};

export const H5 = props => {
  return <Heading level="h5" {...props} />;
};

export const H6 = props => {
  return <Heading level="h6" {...props} />;
};
