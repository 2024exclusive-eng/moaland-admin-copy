// ** React Imports
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// ** Icons Imports
import { Disc, X, Circle } from "react-feather";

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils";

const VerticalMenuHeader = (props) => {
  // ** Props
  const { menuCollapsed, setMenuCollapsed, setGroupOpen, menuHover } = props;

  // ** Vars
  const user = getUserData();

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  return (
    <div
      style={{
        padding: "10px 1rem 10px 1.64rem",
        borderBottom: "1px solid #E2E8F0"
      }}
    >
      <NavLink
        to={user ? getHomeRouteForLoggedInUser(user.role) : "/"}
        className="navbar-brand"
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "black"
        }}
      >
        ADMIN
      </NavLink>
      <h2 style={{ fontSize: "16px" }}>관리자아이디</h2>
    </div>
  );
};

export default VerticalMenuHeader;
