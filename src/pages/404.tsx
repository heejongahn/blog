import Layout from "../components/Layout";
import { navigate } from "gatsby";
import PageHelmet from "../components/PageHelmet";
import { useEffect, useState } from "react";

interface State {
  timeout: number;
}

const NotFoundPage = () => {
  const [timeout, setTimeout] = useState(5);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (timeout === 1) {
        navigate("/");
        return;
      }

      setTimeout((prev) => prev - 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

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
        {timeout}초 후 대문으로 이동합니다.
      </div>
    </Layout>
  );
};

export default NotFoundPage;
