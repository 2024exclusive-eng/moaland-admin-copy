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
import FAQTab from "./FAQTab";
import ContentTab from "./ContentTab";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";

const CustomerServiceManagement = () => {
  const [activeTab, setActiveTab] = useState("faq");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Fragment>
      <div className="title-wrapper">
        <h1 className="page-title">고객센터 관리</h1>
      </div>
      <p className="page-subtitle">고객센터 관리 페이지</p>
      <Row>
        <Col sm="12">
          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab === "faq"}
                onClick={() => toggle("faq")}
                style={{ cursor: "pointer" }}
              >
                자주묻는 질문
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "service_guide"}
                onClick={() => toggle("service_guide")}
                style={{ cursor: "pointer" }}
              >
                서비스 가이드
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "terms_of_use"}
                onClick={() => toggle("terms_of_use")}
                style={{ cursor: "pointer" }}
              >
                이용약관
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "privacy_policy"}
                onClick={() => toggle("privacy_policy")}
                style={{ cursor: "pointer" }}
              >
                개인정보처리방침
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="faq">
              {activeTab === "faq" && <FAQTab type="faq" title="FAQ" />}
            </TabPane>
            <TabPane tabId="service_guide">
              {activeTab === "service_guide" && (
                <ContentTab type="service_guide" title="서비스 가이드" />
              )}
            </TabPane>
            <TabPane tabId="terms_of_use">
              {activeTab === "terms_of_use" && (
                <ContentTab type="terms_of_use" title="이용약관" />
              )}
            </TabPane>
            <TabPane tabId="privacy_policy">
              {activeTab === "privacy_policy" && (
                <ContentTab type="privacy_policy" title="개인정보처리방침" />
              )}
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  );
};

export default CustomerServiceManagement;
