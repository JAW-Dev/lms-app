import React, { useEffect } from "react";

export const Input = (props) => {
  const { updateField, ...htmlProps } = props;
  useEffect(() => {
    updateField(props.name, false);
  }, []);

  return <input {...htmlProps} />;
};
