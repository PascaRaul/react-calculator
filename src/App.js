import "./App.css";
import { useReducer } from "react";
import Buttons from "./Buttons";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  ADD_OPERATION: "add-operation",
  EVALUATE: "evaluate",
  CHANGE_SIGN: "change_sign",
};

function reducer(state, actions) {
  switch (actions.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.evaluated && !state.previewOperand) {
        return {
          currentOperand: actions.payload.digit.toString(),
        };
      }

      if (
        actions.payload.digit === "." &&
        state.currentOperand?.includes(".")
      ) {
        return {
          ...state,
        };
      }

      if (actions.payload.digit === 0 && state.currentOperand === "0") {
        return {
          ...state,
        };
      }

      if (state.currentOperand === "0" && actions.payload.digit !== ".") {
        return {
          ...state,
        };
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${actions.payload.digit}`,
      };

    case ACTIONS.ADD_OPERATION:
      if (state.evaluate) {
        return {
          ...state,
          evaluated: false,
        };
      }

      if (!state.currentOperand && !state.previewOperand) {
        return state;
      }

      if (!state.currentOperand) {
        return {
          ...state,
          operation: actions.payload.operation,
        };
      }

      if (state.previewOperand && state.operation && !state.currentOperand) {
        return state;
      }

      if (state.currentOperand && state.previewOperand) {
        return {
          ...state,
          operation: actions.payload.operation,
          previewOperand: evaluate(state),
          currentOperand: "",
        };
      }

      if (state.currentOperand) {
        return {
          ...state,
          operation: actions.payload.operation,
          previewOperand: state.currentOperand,
          currentOperand: "",
        };
      }
      break;

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      if (!state.previewOperand) {
        return state;
      }

      return {
        ...state,
        evaluated: true,
        previewOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    case ACTIONS.CHANGE_SIGN:
      if (state.currentOperand === ".") {
        return {
          ...state,
        };
      }

      if (state.currentOperand) {
        const invertCurrentOperand = -state.currentOperand;
        const invertCurrentOperandString = invertCurrentOperand.toString();

        return {
          ...state,
          currentOperand: invertCurrentOperandString,
        };
      }

      return { ...state };

    case ACTIONS.DELETE_DIGIT:
      if (!state.currentOperand) return { ...state };
      if (state.evaluated) return { ...state };

      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: "" };
      }

      if (
        state.currentOperand.includes(".") &&
        state.currentOperand
          .split(".")[1]
          .split("0")
          .every((s) => s === "")
      ) {
        return {
          ...state,
          currentOperand: state.currentOperand.split(".")[0].slice(0, -1),
        };
      }

      if (
        state.currentOperand.includes(".") &&
        state.currentOperand.split(".")[1].slice(-1) === "0" &&
        state.currentOperand.length < 4
      ) {
        return {
          ...state,
        };
      }

      if (state.currentOperand.slice(-1) === ".") {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -2),
        };
      }

      if (
        state.currentOperand.includes(".") &&
        state.currentOperand.split(".")[0].length < 1 &&
        state.currentOperand
          .split(".")[1]
          .split("0")
          .every((s) => s === "")
      ) {
        return {
          ...state,
          currentOperand: "",
        };
      }

      if (
        state.currentOperand.length > 1 &&
        state.currentOperand.includes(".") &&
        state.currentOperand.split(".")[1].length > 2
      ) {
        const currentOperandArr = state.currentOperand.split(".");
        const decimal = currentOperandArr[1].slice(0, 2);
        const currentOperandComuted = currentOperandArr[0] + "." + decimal;

        return {
          ...state,
          currentOperand: currentOperandComuted,
        };
      }

      if (state.currentOperand.length > 1) {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        };
      }
      break;

    default:
      console.log("Action not found");
  }

  function evaluate({ currentOperand, previewOperand, operation }) {
    const curr = parseFloat(currentOperand);
    const prev = parseFloat(previewOperand);

    if (isNaN(curr) || isNaN(prev)) return "";

    let computation = "";

    switch (operation) {
      case "+":
        computation = curr + prev;
        break;

      case "-":
        computation = prev - curr;
        break;

      case "*":
        computation = curr * prev;
        break;

      case "÷":
        computation = prev / curr;
        break;

      default:
        console.log("No operation inserted");
    }

    return computation.toString();
  }
}

function App() {
  const [{ currentOperand, previewOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  const clear = () => {
    dispatch({ type: ACTIONS.CLEAR });
  };

  const evaluate = () => {
    dispatch({ type: ACTIONS.EVALUATE });
  };

  const deleteDigit = () => {
    dispatch({ type: ACTIONS.DELETE_DIGIT });
  };

  const changeSign = () => {
    dispatch({ type: ACTIONS.CHANGE_SIGN });
  };

  let currentOperandTransformed;
  if (currentOperand) {
    if (currentOperand === ".") {
      currentOperandTransformed = ".";
    } else if (currentOperand === "-" && currentOperand.length === 1) {
      currentOperandTransformed = "-";
    } else {
      currentOperandTransformed =
        parseFloat(currentOperand).toLocaleString("en");
    }
  }

  return (
    <div className="grid">
      <div className="output">
        <div className="prev-opperand">
          {previewOperand
            ? parseFloat(previewOperand).toLocaleString("en")
            : ""}
          {operation}
        </div>
        <div className="curr-opperand">{currentOperandTransformed}</div>
      </div>
      <button onClick={clear}>AC</button>
      <button onClick={changeSign}>+/-</button>
      <button onClick={deleteDigit}>DEL</button>
      <OperationButton dispatch={dispatch} operation={"÷"} />
      <Buttons dispatch={dispatch} digit={1} />
      <Buttons dispatch={dispatch} digit={2} />
      <Buttons dispatch={dispatch} digit={3} />
      <OperationButton dispatch={dispatch} operation={"*"} />
      <Buttons dispatch={dispatch} digit={4} />
      <Buttons dispatch={dispatch} digit={5} />
      <Buttons dispatch={dispatch} digit={6} />
      <OperationButton dispatch={dispatch} operation={"+"} />
      <Buttons dispatch={dispatch} digit={7} />
      <Buttons dispatch={dispatch} digit={8} />
      <Buttons dispatch={dispatch} digit={9} />
      <OperationButton dispatch={dispatch} operation={"-"} />
      <Buttons dispatch={dispatch} digit={"."} />
      <Buttons dispatch={dispatch} digit={0} />
      <button onClick={evaluate} className="span-two">
        =
      </button>
    </div>
  );
}

export default App;
