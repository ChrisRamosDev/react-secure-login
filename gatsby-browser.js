import React from "react";
import { silentAuth } from "./src/utils/auth";

class SessionCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  handleCheckSession = () => {
    this.setState({ loading: false });
  };

  componentDidMount() {
    silentAuth(this.handleCheckSession);
  }

  render() {
    return (
      this.state.loading === false && (
        <React.Fragment>{this.props.children}</React.Fragment>
      )
    );
  }
}

// wraps the root element so that silentAuth gets called only once when the page loads
export const wrapRootElement = ({ element }) => {
  return <SessionCheck>{element}</SessionCheck>;
};
