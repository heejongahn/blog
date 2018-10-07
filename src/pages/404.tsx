import React from "react";
import Layout from "../components/Layout";
import { push } from "gatsby";
import PageHelmet from "../components/PageHelmet";

interface State {
  timeout: number;
}

class NotFoundPage extends React.Component<{}, State> {
  timer = -1;
  constructor(props: {}) {
    super(props);
    this.state = { timeout: 5 };
  }

  componentDidMount() {
    this.timer = window.setInterval(() => {
      if (this.state.timeout === 1) {
        push("/");
        return;
      }
      this.setState({ timeout: this.state.timeout - 1 });
    }, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  render() {
    return (
      <Layout>
        <PageHelmet
          title="ahn.heejong"
          description="404 Not Found"
          url="https://ahnheejong.name/404"
        />
        <h1 style={{ marginBottom: "1em" }}>404 Not Found</h1>
        <div>
          막다른 골목에 다다르셨어요.
          <br />
          {this.state.timeout}초 후 대문으로 이동합니다.
        </div>
      </Layout>
    );
  }
}

export default NotFoundPage;
