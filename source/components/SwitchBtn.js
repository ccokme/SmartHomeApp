import React, {Component} from 'react';
import {Switch} from 'react-native';
import {Colors} from '../ThemeStyle';

export default class SwitchBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  render() {
    return (
      <Switch
        thumbColor="#fff"
        disabled={this.props.disabled || false}
        trackColor={
          this.props.trackColor
            ? this.props.trackColor
            : {true: Colors.MainColor}
        }
        style={[
          {transform: [{scaleX: 0.8}, {scaleY: 0.8}]},
          this.props.cusStyle || {},
        ]}
        value={this.state.value}
        onValueChange={this.change.bind(this)}
      />
    );
  }

  change(e) {
    this.setState(
      {
        value: e,
      },
      () => {
        this.props.change(e);
      },
    );
  }
}
