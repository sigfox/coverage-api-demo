import React, { PropTypes } from 'react';
import _ from 'lodash';

const LevelMeter = function LevelMeter(props) {
  return (
    <div className="level-meter" alt={props.level}>
      {_.times(props.level - props.min, i => <span key={i} className={`level-meter--bar level-meter--bar__${i}`} style={{
        marginLeft: `${props.spacing}px`,
        width: `calc(${(1 / (props.max - props.min)) * 100}% - ${props.spacing}px)`
      }} />)}
      {props.level === 0 && <span className='level-meter__no-coverage'>No coverage</span>}
    </div>
  );
};

LevelMeter.propTypes = {
  level: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  spacing: PropTypes.number
};

LevelMeter.defaultProps = {
  min: 0,
  max: 8,
  spacing: 2
};

export default LevelMeter;
