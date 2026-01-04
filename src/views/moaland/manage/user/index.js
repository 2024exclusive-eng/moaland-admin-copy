// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Third Party Components
import { Row, Col } from "reactstrap";
import axios from "axios";

// ** Demo Components
import UserHeader from "./UserHeader";
import UsetList from "./userList";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const Tables = () => {
  // ** States
  const [stats, setStats] = useState({
    totalMembers: 0,
    newMembers: 0,
    withdrawnMembers: 0,
  });

  // ** Fetch user status on component mount
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get("/admin/manage/user/status");
        if (response.success) {
          const { usersCount, newMembersPast30Days, withdrawnMembers } =
            response.data;
          setStats({
            totalMembers: usersCount,
            newMembers: newMembersPast30Days,
            withdrawnMembers,
          });
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchUserStatus();
  }, []);

  return (
    <Fragment>
      <UserHeader stats={stats} />

      <Row>
        <Col sm="12">
          <UsetList />
        </Col>
      </Row>
    </Fragment>
  );
};

export default Tables;
