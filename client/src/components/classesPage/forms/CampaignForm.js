import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Card,
  Typography,
  Icon,
  Button,
  Fab
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Send from '@material-ui/icons/Send';
import moment from 'moment'

const styles = theme => ({
  container: {
    border: `1px solid ${theme.palette.secondary.main}`,
    ...theme.mixins.gutters(),
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 8,
    marginTop: theme.spacing.unit * 6,
    marginBottom: theme.spacing.unit * 4,
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.dark,
    [theme.breakpoints.down('sm')]: {
      width: '80%'
    },
    [theme.breakpoints.only('md')]: {
      width: '60%'
    },
    width: '50%'
  },
  cardList: {
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    margin: 20,
    width: 200,
    height: 200,
    padding: theme.spacing.unit * 3,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column'
  },
  activeCard: {
    margin: 10,
    width: '90%',
    height: 300,
    padding: theme.spacing.unit * 3,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
  },
  dateField: {
    marginTop: 20
  },
  iconCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none'
  },
  navDiv: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  buttonDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing.unit * 2
    }
  },
  hrStyle: {
    margin: '1rem auto',
    width: '100%'
  },
  leftBtn: {
    marginRight: theme.spacing.unit * 2,
    color: theme.palette.primary.main,
    background: theme.palette.secondary.main,
    width: 40,
    height: 40
  },
  rightBtn: {
    marginLeft: theme.spacing.unit * 2,
    color: theme.palette.primary.main,
    background: theme.palette.secondary.main,
    width: 40,
    height: 40,
  },
  scheduleDiv: {
    margin: '1rem 0',
  },
  scheduleText: {
    marginLeft: '1rem',
  }
});

function CampaignForm(props) {
  const [refreshrs, setRefreshrs] = useState([]);
  const [activeRefreshr, setActiveRefreshr] = useState(null);

  // For displaying on the page for the ease of user
  // current time, 2 days, 2 weeks, 2 months
  let [schedule, setSchedule] = useState({
    schedule0: null,
    schedule1: null,
    schedule2: null,
    schedule3: null,
  })

  const { classes } = props;
  let today = new Date(); // to set default for date inputs
  today = dateMapper(today);

  // fetch class refreshrs on mount
  useEffect(() => {
    getRefreshrs();
  }, []);

  const userID = localStorage.getItem('user_id');
  const token = localStorage.getItem('accessToken');

  const ax = axios.create({
    baseURL: 'http://localhost:9000',
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  /* putting the axios request here for now just to design the page. it may make more sense to make
  it in the parent component and then pass down props to the children components */
  const getRefreshrs = async () => {
    try {
      /* this should fetch the class's refreshrs from /refreshrs/classes/:classId,
        but the endpoint is not live yet so I'm using this for testing */
      // const res = await axios.get('https://refreshr.herokuapp.com/refreshrs');
      const res = await ax.get(
        'https://refreshr.herokuapp.com/refreshrs/teachers/190'
      );
      console.log(res.data);
      setRefreshrs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // got to be a cleaner way to do this, but it works for now
  function dateMapper(date) {
    const month =
      date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const handlePrev = e => {
    e.preventDefault();
    props.setStage({
      ...props.stage,
      onListForm: !props.stage.onListForm,
      onCampaignForm: !props.stage.onCampaignForm
    });
  };

  const scheduleRefreshr = () => {
    props.setCampaignData({
      ...props.campaignData,
      title: 'Your Refreshr Is Here!',
      subject: activeRefreshr.name,
      html_content: `<html><head><title></title></head><body><p>${
        activeRefreshr.review_text
      } [unsubscribe]</p></body></html>`,
      plain_content: `${activeRefreshr.review_text} [unsubscribe]`,
      refreshr_id: activeRefreshr.id
    });
    setActiveRefreshr(null);
  };

  const handleClick = id => {
    const [active] = refreshrs.filter(r => r.id === id);
    setActiveRefreshr(active);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.sendAllToSendgrid();
  };

  const alterTime = (e) => {
    e.preventDefault()
    const schedule0 = moment(`${e.target.value}T00:00:00`).format('ddd, MMMM Do, YYYY ha')
    const schedule1 = moment(`${e.target.value}T00:00:00`).add(2, 'day').format('ddd, MMMM Do, YYYY ha')
    const schedule2 = moment(`${e.target.value}T00:00:00`).add(2, 'weeks').format('ddd, MMMM Do, YYYY ha')
    const schedule3 = moment(`${e.target.value}T00:00:00`).add(2, 'month').format('ddd, MMMM Do, YYYY ha')

    const twoDaysUnix = moment(`${e.target.value}T00:00:00`).add(2, 'day').unix()
    const twoWeeksUnix = moment(`${e.target.value}T00:00:00`).add(2, 'weeks').unix()
    const twoMonthsUnix = moment(`${e.target.value}T00:00:00`).add(2, 'month').unix()

    const timeTriData = [
      { send_at: twoDaysUnix },
      { send_at: twoWeeksUnix },
      { send_at: twoMonthsUnix },
    ]

    setSchedule({
      ...schedule,
      schedule0,
      schedule1,
      schedule2,
      schedule3,
    })

    props.setTimeTriData([
      ...timeTriData
    ])
  }

  return (
    <Grid container className={classes.container}>
      <Typography
        variant="h6"
        color="secondary"
        style={{ textAlign: 'center' }}
      >
        Schedule Class
      </Typography>

      <hr className={classes.hrStyle} />

      {activeRefreshr ? (
        <Card className={classes.activeCard}>
          <h1>{activeRefreshr.name}</h1>
          <TextField
            variant="outlined"
            type="date"
            defaultValue={today}
            onChange={e => alterTime(e)}
          />
          <div className={classes.scheduleDiv}>
            <Typography
              variant={"p"}
              color="secondary"
            >
              Input: {schedule.schedule0 || ""}
            </Typography>
            <Typography
              className={classes.scheduleText}
              variant={"p"}
              color="secondary"
            >
              +2 days: {schedule.schedule1 || ""}
            </Typography>
            <Typography
              className={classes.scheduleText}
              variant={"p"}
              color="secondary"
            >
              +2 weeks: {schedule.schedule2 || ""}
            </Typography>
            <Typography
              className={classes.scheduleText}
              variant={"p"}
              color="secondary"
            >
              +2 months: {schedule.schedule3 || ""}
            </Typography>
          </div>
          <Button
            variant="outlined"
            color="secondary"
            onClick={scheduleRefreshr}
          >
            Load Schedule
          </Button>
        </Card>
      ) : (
        <Card className={classes.card}>
          <h4>select a refreshr to schedule</h4>
        </Card>
      )}

      <hr className={classes.hrStyle} />

      <Typography variant="p" color="secondary" style={{ textAlign: 'center' }}>
        Your Refreshrs
      </Typography>

      <Grid className={classes.cardList}>
        {refreshrs.map(refreshr => (
          <Card
            onClick={() => handleClick(refreshr.id)}
            className={classes.card}
            key={refreshr.id}
            id={refreshr.id}
            raised
          >
            <Typography variant="subtitle2">{refreshr.name}</Typography>
          </Card>
        ))}
        <Link to="/questions/create">
          <Card className={`${classes.card} ${classes.iconCard}`}>
            <Icon color="action" style={{ fontSize: 60 }}>
              add_circle
            </Icon>
          </Card>
        </Link>
      </Grid>

      <hr className={classes.hrStyle} />

      <div className={classes.navDiv}>
        <div className={classes.buttonDiv}>
          <Fab elevation={20} aria-label="Back" className={classes.leftBtn}>
            <ArrowBack onClick={e => handlePrev(e)} />
          </Fab>
          <Typography
            variant="body2"
            color="secondary"
            className={classes.nextText}
          >
            PREV
          </Typography>
        </div>
        <div className={classes.buttonDiv}>
          <Typography
            variant="body2"
            color="secondary"
            className={classes.nextText}
          >
            SEND
          </Typography>
          <Fab elevation={20} aria-label="Submit" className={classes.rightBtn}>
            <Send onClick={e => handleSubmit(e)} />
          </Fab>
        </div>
      </div>
    </Grid>
  );
}

export default withStyles(styles)(CampaignForm);
