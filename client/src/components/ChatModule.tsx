import "./chat-module.scss";
import { CaretRightFilled } from "@ant-design/icons";
import { useState } from "react";
import { io } from "socket.io-client";
import { CalculationItem } from "../typings";
import { evaluate } from "mathjs";

const socket = io("http://localhost:8081");

socket.on("connect", () => {
  console.log(socket.id);
});

const ChatModule: React.FunctionComponent = () => {
  const [query, setQuery] = useState<string>("");
  const [history, setHistory] = useState<CalculationItem[]>();

  socket.on("deliverHistory", (payload: CalculationItem[]) => {
    setHistory({ ...history, ...payload });
  });

  const onSubmitPressed = () => {
    if (query.length > 0) {
      if (query?.toLowerCase() === "history") {
        socket.emit("requestHistory");
      } else {
        try {
          const result = evaluate(query);
          let calculation: CalculationItem = {
            originalQuery: query,
            calculation: result,
            timestamp: new Date().toUTCString(),
          };
          socket.emit("addCalculation", calculation);
          setHistory({ ...history, ...[calculation] });
        } catch (err) {
          console.error("this command cannot be calculated", err);
        }
      }
    }
  };

  return (
    <div className={"chat-module"}>
      <div className={"chat-module__heading"}>
        <div className={"chat-module__heading-icon"}></div>
        <div className={"chat-module__heading-title"}>Finway Calculator</div>
      </div>
      <div className={"chat-module__body"}>
        <div className={"chat-module__body-inner"}>test</div>
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
