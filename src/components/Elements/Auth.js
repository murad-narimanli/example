import React from "react";
import { connect } from "react-redux";

class AuthProvider extends React.Component {
  renderChildren() {
    const { auth } = this.props;
    if (this.props.user >= auth) {
      return this.props.children;
    } else {
      return null;
    }
  }

  render() {
    return <>{this.renderChildren()}</>;
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user: user.data.role,
  };
};
export default connect(mapStateToProps)(AuthProvider);