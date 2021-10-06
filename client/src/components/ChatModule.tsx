import "./chat-module.scss";
import { CaretRightFilled } from "@ant-design/icons";
import { useState } from "react";
import { io } from "socket.io-client";
import { CalculationItem } from "../typings";
import { useEvaluateQueryHook } from "../hooks";

const socket = io("http://localhost:8081");

const ChatModule: React.FunctionComponent = () => {
  const [query, setQuery] = useState<string>("");

  // Attempt to evaluate the query string value as a function
  const evaluatedQuery = useEvaluateQueryHook(query);

  const [history, setHistory] = useState<CalculationItem[]>([]);

  // When receiving the history, update the payload
  socket.on("deliverHistory", (payload: CalculationItem[]) => {
    setHistory([...history, ...[...payload].reverse()]);
    setQuery("");
  });

  // on submit do the following:
  // if the query is equal to the string 'history', request the history from the socket
  // else check if the evaluatedQuery is a number, if it's not, show an error to the user
  // If evaluatedQuery is a number, create a new calculation with the original query and result and emit this to the socket
  // setHistory with the new calculation added
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

        setHistory([...history, calculation]);
        setQuery("");
      } else {
        alert("This command cannot be parsed. Please try again");
        console.error("this command cannot be parsed");
      }
    }
  };

  return (
    <div className={"chat-module"}>
      <div className={"chat-module__heading"}>
        <div className={"chat-module__heading-icon"}></div>
        <h3 className={"chat-module__heading-title"}>Finway Calculator</h3>
      </div>
      <div className={"chat-module__body"}>
        <div className={"chat-module__body-inner"}>
          {history.map((cItem) => {
            return (
              <div key={cItem.timestamp} className={"chat-module__chat-item"}>
                <div
                  className={
                    "chat-module__chat-balloon chat-module__chat-balloon--client"
                  }
                >
                  <span className={"chat-module__chat-balloon-text"}>
                    {cItem.originalQuery}
                  </span>
                  {cItem.timestamp ? (
                    <span className={"chat-module__chat-balloon-timestamp"}>
                      {new Date(cItem.timestamp).getHours()}:
                      {String(new Date(cItem.timestamp).getMinutes()).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  ) : null}
                </div>

                <div
                  className={
                    "chat-module__chat-balloon chat-module__chat-balloon--server"
                  }
                >
                  <span className={"chat-module__chat-balloon-text"}>
                    {cItem.calculation}
                  </span>
                  {cItem.timestamp ? (
                    <span className={"chat-module__chat-balloon-timestamp"}>
                      {new Date(cItem.timestamp).getHours()}:
                      {String(new Date(cItem.timestamp).getMinutes()).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  ) : null}
                </div>
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
            placeholder={
              "Enter your calculation here, or type history to get the 10 latest entries"
            }
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
