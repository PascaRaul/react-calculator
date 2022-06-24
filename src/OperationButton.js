import React from "react";
import { ACTIONS } from "./App";

function OperationButton(props) {
  const dispatchHandler = () => {
    props.dispatch({
      type: ACTIONS.ADD_OPERATION,
      payload: { operation: props.operation },
    });
  };
  return <button onClick={dispatchHandler}>{props.operation}</button>;
}

export default OperationButton;
