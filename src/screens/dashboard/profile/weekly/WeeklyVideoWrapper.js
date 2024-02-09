import React from 'react';
import { connect } from 'react-redux';
import WeeklyScreen from './WeeklyScreen';
import { getWeeklyVideos } from '../../../../../store/actions/user';

class WeeklyScreenWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
  }

  onFocus() {
    if (this.props.weeklyVideo && Object.keys(this.props.weeklyVideo).length == 0) {
      this.props.getWeeklyVideos();
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', this.onFocus);
  }
  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.onFocus);
  }

  render() {
    return (
      <WeeklyScreen
        isLoading={this.props.isLoading}
        weeklyVideo={this.props.weeklyVideo}
        navigation={this.props.navigation}></WeeklyScreen>
    );
  }
}

function mapStateToProps(state) {
  return {
    weeklyVideo: state.user.user.weeklyVideo,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWeeklyVideos: () => dispatch(getWeeklyVideos()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyScreenWrapper);
