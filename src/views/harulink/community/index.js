// ** React Imports
import { Fragment, useState } from "react";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Third Party Components
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";

// ** Components
import NoticeTab from "./NoticeTab";
import EventTab from "./EventTab";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const CommunityManagement = () => {
  const [activeTab, setActiveTab] = useState("notice");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Fragment>
      <div className="title-wrapper">
        <h1 className="page-title">커뮤니티 관리</h1>
      </div>
      <p className="page-subtitle">커뮤니티관리 페이지</p>{" "}
      <Row>
        <Col sm="12">
          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab === "notice"}
                onClick={() => toggle("notice")}
                style={{ cursor: "pointer" }}
              >
                공지사항
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "event"}
                onClick={() => toggle("event")}
                style={{ cursor: "pointer" }}
              >
                이벤트
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="notice">
              {activeTab === "notice" && <NoticeTab />}
            </TabPane>
            <TabPane tabId="event">
              {activeTab === "event" && <EventTab />}
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  );
};

export default CommunityManagement;
