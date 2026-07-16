// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import { Card, CardBody, Row, Col } from "reactstrap";

// ** Styles
import "./MissionHeader.scss";

const MissionHeader = ({ stats }) => {
  return (
    <Fragment>
      {/* Page Title Section */}
      <div className="user-header-title">
        <div className="title-wrapper">
          <h1 className="page-title">캠페인 관리</h1>
          <div className="member-badge">{stats.totalMissions}캠페인</div>
        </div>
        <p className="page-subtitle">캠페인 리스트 관리 페이지</p>
      </div>

      {/* Statistics Cards */}
      <Row className="mission-stats-row">
        <Col md="4" sm="12">
          <Card className="stat-card">
            <CardBody>
              <p className="stat-label">총 캠페인</p>
              <h2 className="stat-value">
                {stats?.totalMissions ?? 0}
              </h2>
            </CardBody>
          </Card>
        </Col>
        <Col md="4" sm="12">
          <Card className="stat-card">
            <CardBody>
              <p className="stat-label">진행중</p>
              <h2 className="stat-value underlined">
                {stats?.inProgress ?? 0}
              </h2>
            </CardBody>
          </Card>
        </Col>
        <Col md="4" sm="12">
          <Card className="stat-card">
            <CardBody>
              <p className="stat-label">종료된 캠페인</p>
              <h2 className="stat-value">
                {stats?.ended ?? 0}
              </h2>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default MissionHeader;
