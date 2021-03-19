import { connect } from "react-redux";

const Authorize = ({ perms, mainMenu, page, children, type }) => {
  let showed = perms[mainMenu].subs;
  page.forEach((p) => {
    showed = showed[p];
  });
  return showed[type] ? children : null;
};
const mapStateToProps = ({ user }) => {
  return { perms: user.data.userPermissions };
};

export default connect(mapStateToProps)(Authorize);
