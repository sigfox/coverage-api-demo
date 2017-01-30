import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import csvToJson from './csvToJson';

/**
 * A generic csv parse dropzone.
 */
class CsvParseDropzone extends Component {
  static propTypes = {
     /**
     * The dropzone contents
     */
    children: PropTypes.node.isRequired,
    /**
     * Csv parse callback (error, value) => (do something)
     */
    csvParseCallback: PropTypes.func.isRequired
  };

  onDrop = (files) => {
    const { csvParseCallback = () => {} } = this.props;
    const reader = new FileReader();
    reader.addEventListener("loadend", function() {
      let resultJson = [];
      try {
        resultJson = csvToJson({ csvString: reader.result });
      } catch (e) {
        csvParseCallback(e);
      }
      csvParseCallback(null, resultJson);
    });
    reader.readAsText(files[0]);
  };

  render() {
    const { children, className, ...props } = this.props;
    delete props.csvParseCallback;
    return (<Dropzone
      className={classNames('csv-parse-dropzone', className)}
      multiple={false}
      {...props}
      onDrop={this.onDrop}
      style={{
        fontFamily: '"Helvetica Neue", sans-serif',
        color: '#333',
        border: '2px dashed #ddd',
        padding: '25px',
        cursor: 'pointer',
      }}
    >{children}</Dropzone>)
  }
}

export default CsvParseDropzone;
