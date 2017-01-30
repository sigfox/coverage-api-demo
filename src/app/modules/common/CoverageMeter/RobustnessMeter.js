import React, { PropTypes } from 'react';
import classnames from 'classnames';
const RobustnessMeter = (props) => {
  const { score, redundancy } = props;
  let level = 0;
  if (redundancy > 0) {
    switch (true) {
      case score <= 8 : level = 1; break;
      case score >= 22 && score < 24: level = 1; break;
      case score <= 21: level = 2; break;
      case score >= 24 && score <= 28: level = 2; break;
      case score <= 24 || score > 28: level = 3; break;
    }
  }
  const classNames = classnames('robustness', `robustness__${level}`);
  return <div className={classNames}>{level}</div>;
};

RobustnessMeter.propTypes = {
  score: PropTypes.number.isRequired,
  redundancy: PropTypes.number.isRequired
};

export default RobustnessMeter;
