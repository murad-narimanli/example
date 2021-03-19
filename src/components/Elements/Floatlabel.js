import React, { useState } from "react";

const FloatLabel = (props) => {
  const [focus, setFocus] = useState(false);
  const { children, label, value } = props;

  const labelClass = focus || value ? "label label-float" : "label";

  return (
    <div
      className="float-label"
      onChange={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
};

export default FloatLabel;
