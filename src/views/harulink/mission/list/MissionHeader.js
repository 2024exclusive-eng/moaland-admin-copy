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
          <h1 className="page-title">회원 관리</h1>
          <div className="member-badge">{stats.totalMissions}명</div>
        </div>
        <p className="page-subtitle">회원 리스트 관리 페이지</p>
      </div>

      {/* Statistics Cards */}
      <Row className="mission-stats-row">
        <Col md="4" sm="12">
          <Card className="stat-card">
            <CardBody>
              <p className="stat-label">오늘 미션 생성수</p>
              <h2 className="stat-value danger">
                {stats?.mustSelectToday}
              </h2>
            </CardBody>
          </Card>
        </Col>
        <Col md="4" sm="12">
          <Card className="stat-card">
            <CardBody>
              <p className="stat-label">신규 지원</p>
              <h2 className="stat-value danger">
                {stats?.delayedEnrollments }
              </h2>
            </CardBody>
          </Card>
        </Col>
        <Col md="4" sm="12">
          <Card className="stat-card">
            <CardBody>
              <p className="stat-label">운영중</p>
              <h2 className="stat-value underlined">
                {stats?.inProgress}
              </h2>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default MissionHeader;
