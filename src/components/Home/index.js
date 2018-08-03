import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AnsweredIcon from '@material-ui/icons/DoneAll';
import UnansweredIcon from '@material-ui/icons/InfoRounded';

// Misc
import TabContainer from '../TabContainer';
import QuestionList from '../QuestionList';
import Loading from '../Loading';
import Types from '../../utils/types';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class Home extends Component {
  state = {
    value: 0,
    isLoading: true,
  };

  componentDidMount() {
    const { handleGetQuestions } = this.props;
    handleGetQuestions()
      .then(() => this.setState({
        isLoading: false,
      }));
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };


  render() {
    const {
      answered,
      unanswered,
      isUserLogged,
      redirectToLogin,
      classes,
      theme,
    } = this.props;

    const { value, isLoading } = this.state;

    if (!isUserLogged()) {
      redirectToLogin();
      return false;
    }

    return (
      isLoading ? <Loading />
        : (
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Unanswered" icon={<UnansweredIcon />} />
                <Tab label="Answered" icon={<AnsweredIcon />} />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={this.handleChangeIndex}
            >
              <TabContainer dir={theme.direction}>
                <QuestionList questions={unanswered} />
              </TabContainer>
              <TabContainer dir={theme.direction}>
                <QuestionList questions={answered} />
              </TabContainer>
            </SwipeableViews>
          </div>
        )
    );
  }
}

Home.propTypes = {
  answered: PropTypes.arrayOf(Types.question).isRequired,
  unanswered: PropTypes.arrayOf(Types.question).isRequired,
  handleGetQuestions: PropTypes.func.isRequired,
  isUserLogged: PropTypes.func.isRequired,
  redirectToLogin: PropTypes.func.isRequired,
  classes: PropTypes.shape().isRequired,
  theme: PropTypes.shape().isRequired,
};

export default withStyles(styles, { withTheme: true })(Home);
