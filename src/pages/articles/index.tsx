import React from "react";
import { navigateTo } from "gatsby";

class ArticlesMain extends React.Component {
  componentDidMount() {
    navigateTo("/");
  }

  render() {
    return null;
  }
}

export default ArticlesMain;
