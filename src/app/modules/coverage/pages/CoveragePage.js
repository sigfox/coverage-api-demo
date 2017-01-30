import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import Page from 'common/layout/Page';
import PageSection from 'common/layout/PageSection';
import {Tabs, Tab} from 'common/nav/Tabs';

if (__CLIENT__) {
  require('./coverage.scss')
}

class CoveragePage extends Component {
  render() {
    return (
      <Page>
      <PageSection>
        <div>Coverage</div>
        <Tabs centered>
          <Tab to="/single">Single point</Tab>
          <Tab to="/batch">Batch</Tab>
        </Tabs>
      </PageSection>
      { this.props.children }
      </Page>
    )
  }
}

export default CoveragePage;
