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
import BannerNoticeTab from "./BannerNoticeTab";
import BannerEventTab from "./BannerEventTab";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const BannerManagement = () => {
  const [activeTab, setActiveTab] = useState("notice");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Fragment>
      <div className="title-wrapper">
        <h1 className="page-title">배너관리</h1>
      </div>
      <p className="page-subtitle">배너관리 페이지</p>{" "}
      <Row>
        <Col sm="12">
          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab === "notice"}
                onClick={() => toggle("notice")}
                style={{ cursor: "pointer" }}
              >
                홈배너
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "event"}
                onClick={() => toggle("event")}
                style={{ cursor: "pointer" }}
              >
                캠페인 우측 배너
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="notice">
              {activeTab === "notice" && <BannerNoticeTab />}
            </TabPane>
            <TabPane tabId="event">
              {activeTab === "event" && <BannerEventTab />}
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  );
};

export default BannerManagement;
