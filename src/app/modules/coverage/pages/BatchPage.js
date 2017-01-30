import React, { PropTypes, Component } from 'react';
import {connect} from 'react-redux';
import Button from 'common/Button';

import PageSection from 'common/layout/PageSection';
import DropZone from 'common/CsvParseDropzone';
import CoverageMeter from 'common/CoverageMeter';


import { parseAddresses, clearAddresses, processBatch } from 'coverage';

class BatchPage extends Component {
  onParsed = (err, results) => {
    if(err) {
      console.error(err);
      alert('an error occured, please check developper console')
    } else {
      this.props.dispatch(parseAddresses(results));
    }
  }
  clear = () => {
    this.props.dispatch(clearAddresses());
  }
  process = () => {
    this.props.dispatch(processBatch())
  }
  render(){
    const {coverage: {addresses, geocoding, finished}} = this.props;
    return <PageSection>
      {addresses.length ?
        <div>
      <table className="table table-bordered" style={{width: '100%'}}>
          <thead>
            <tr>
              <th>Address</th>
              <th>Geocoded</th>
              <th>Coverage</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map(a => <tr key={a.address}>
              <td>{a.address}</td>
              <td>{a.coords ? 'yes' : 'no'}</td>
              <td>{a.coverage && <CoverageMeter margins={a.coverage} objectClass={0} usage="indoor"/> }</td></tr>)}
          </tbody>
        </table>
        {finished ? <p>Done !</p>
        : <p>Looks good ? <Button onClick={this.process} disabled={geocoding}>{geocoding ? 'processing...': 'Geocode and get coverages'}</Button> <Button onClick={this.clear}>Clear list</Button>
        </p>
        }
        </div>
        :
      <DropZone
        style={{textAlign: 'center'}}
        csvParseCallback={this.onParsed}
        >
        <h3>Drop a .txt or .csv file here, or click to open a file browser</h3>
        <em>One address per line, first line must contain column names. Simply put "address" on the first line if you use a simple .txt list.</em>
      </DropZone>
      }

    </PageSection>
  }
}

export default connect(state => ({coverage: state.coverage.batchCoverage}))(BatchPage);
