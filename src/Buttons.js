import React from "react";
import { ACTIONS } from "./App";

function Buttons(props) {
  const dispatchHandler = () => {
    props.dispatch({
      type: ACTIONS.ADD_DIGIT,
      payload: { digit: props.digit },
    });
  };
  return <button onClick={dispatchHandler}>{props.digit}</button>;
}

export default Buttons;
