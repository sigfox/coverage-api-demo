import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import LevelMeter from './LevelMeter';
import RobustnessMeter from './RobustnessMeter';

if (__CLIENT__) {
  require('./coverageMeter.scss');
}

class CoverageMeter extends Component {
  static propTypes = {
    margins: PropTypes.array.isRequired,
    objectClass: PropTypes.number,
    usage: PropTypes.string,
    config: PropTypes.object
  }

  static defaultProps = {
    objectClass: 0,
    usage: 'indoor',
    config: {
      malus: {
        outdoor: [0, 4, 8, 12],
        indoor: [4, 24, 36, 42],
        deepIndoor: [24, 36, 48, 56]
      }
    }
  }

  calculateQuality = () => {
    const { margins, objectClass, usage, config } = this.props;
    const [a, b, c] = margins;
    const malus = config.malus[usage][objectClass];

    let score = 0;
    let level = 0;

    const a1 = a ? a - malus : -1;
    const b1 = b ? b - malus : -1;
    const c1 = c ? c - malus : -1;

    if (a1 > 0) score += 1; // 1
    if (a1 > 3) score += 1; // 2
    if (a1 > 5) score += 3; // 5
    if (a1 > 10) score += 8; // 13
    if (a1 > 20) score += 8; // 21

    if (b1 > 3) score += 2;
    if (b1 > 5) score += 3;
    if (b1 > 15) score += 5;

    if (c1 > 3) score += 1;
    if (c1 > 5) score += 1;
    if (c1 > 15) score += 3;

    switch (true) {
      case score === 0:             level = 0; break;
      case score === 1:             level = 1; break;
      case score === 2 && b1 <= 0:  level = 2; break;
      case score > 1 && score <= 4: level = 3; break;
      case score === 5:             level = 3; break;
      case score > 5 && score <= 8: level = 3; break;
      case score > 8 && score <= 12:level = 4; break;
      case score === 13: level = 4; break;
      case score > 13 && score <= 16: level = 5; break;
      case score > 16 && score <= 20: level = 6; break;
      case score === 21: level = 6; break;
      case score > 21 && score <= 24: level = 7; break;
      case score > 24: level = 8; break;
      default: level = 0;
    }

    return {
      score,
      level,
      margins: [a1, b1, c1]
    };
  }
  render() {
    const quality = this.calculateQuality();
    return (
      <div className="coverage-meter">
        <LevelMeter level={quality.level} />
        <RobustnessMeter
          score={quality.score}
          redundancy={quality.margins.reduce((a, b) => {return b > 0 ? a+= 1 : a}, 0)}
          />
      </div>
    );
  }
}

export default CoverageMeter;
