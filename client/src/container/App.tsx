import { Layout } from "antd";
import "antd/dist/antd.css";
import "./app.scss";
import ChatModule from "../components/ChatModule";

const { Header, Content } = Layout;

const App: React.FunctionComponent = () => {
  return (
    <Layout className={"container"}>
      <Header>Header</Header>
      <Content className={"main-content"}>
        <ChatModule />
      </Content>
    </Layout>
  );
};

export default App;
