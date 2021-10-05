import "./App.css";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { io } from "socket.io-client";

const { Header, Footer, Content } = Layout;
const socket = io("http://localhost:8081");

// client-side
socket.on("connect", () => {
  console.log(socket.id);
});

const App = () => {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>
        <button
          onClick={() => {
            console.log("testje");
            socket.emit("testevent");
          }}
        >
          test
        </button>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default App;
