import "./chat-module.scss";
import { CaretRightFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { CalculationItem } from "../typings";
import { useEvaluateQueryHook } from "../hooks";

const socket = io("http://localhost:8081");

socket.on("connect", () => {
  console.log(socket.id);
});

const ChatModule: React.FunctionComponent = () => {
  const [query, setQuery] = useState<string>("");
  const evaluatedQuery = useEvaluateQueryHook(query);

  const [history, setHistory] = useState<CalculationItem[]>();
  socket.on("deliverHistory", (payload: CalculationItem[]) => {
    setHistory({ ...history, ...payload });
  });

  const onSubmitPressed = () => {
    if (query.length > 0) {
      if (query?.toLowerCase() === "history") {
        socket.emit("requestHistory");
      } else if (evaluatedQuery) {
        let calculation: CalculationItem = {
          originalQuery: query,
          calculation: evaluatedQuery,
          timestamp: new Date().toUTCString(),
        };
        socket.emit("addCalculation", calculation);
        if (history) {
          setHistory([...history, calculation]);
        } else {
          setHistory([calculation]);
        }
      } else {
        console.error("this command cannot be parsed");
      }
    }
  };

  useEffect(() => {
    console.log(evaluatedQuery);
  }, [evaluatedQuery]);

  return (
    <div className={"chat-module"}>
      <div className={"chat-module__heading"}>
        <div className={"chat-module__heading-icon"}></div>
        <div className={"chat-module__heading-title"}>Finway Calculator</div>
      </div>
      <div className={"chat-module__body"}>
        <div className={"chat-module__body-inner"}>
          {history &&
            Array.from(history).map((cItem) => {
              return (
                <div className={"chat-module__chat-item"}>
                  {cItem.originalQuery}
                </div>
              );
            })}
        </div>
        <div className={"chat-module__controls"}>
          <input
            className={"chat-module__input"}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={"Enter your calculation here"}
          />
          <button
            onClick={() => onSubmitPressed()}
            className={"chat-module__button"}
          >
            <CaretRightFilled />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;
