import React from 'react';
import {message, List, Tag} from 'antd';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';
import Header from '../components/pageHeader';

import type {RootState} from '../state-store/reducer.root';
import type {Notification} from '../types/bets';

const mapStateToProps = (state: RootState) => ({
  username: state.session.username,
  sessionActive: state.session.isSessionActive,
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface State {
  loading: boolean;
  notifications: Notification[];
}

class Matches extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      notifications: [],
    };
    this.getNotifications.bind(this);
  }

  private async getNotifications() {
    try {
      const response = await axios.get('/bets/notifications', {
        headers: {authorization: this.props.token},
      });
      this.setState({
        ...this.state,
        notifications: response.data.notifications,
      });
    } catch (err) {
      message.error('Error cargando las notificaciones!');
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  }

  componentDidMount() {
    this.getNotifications();
  }

  private _listItem = (item: Notification, index: number) => (
    <List.Item key={index}>
      <List.Item.Meta
        title={`${item.home_team} vs ${item.away_team}`}
        description={item.tournament_name}></List.Item.Meta>
      <List.Item.Meta
        title={`Bet: ${item.bet_type}`}
        description={item.status}></List.Item.Meta>
      <p
        style={{
          color: item.status === 'WINNER' ? 'green' : 'red',
        }}>
        {`${item.message.substring(0, 1)} $${item.message.substring(
          1,
          item.message.length
        )}`}
      </p>
    </List.Item>
  );

  render() {
    return (
      <div>
        <Header
          sessionActive={this.props.sessionActive}
          title={'Notificaciones'}
        />
        <List
          loading={this.state.loading}
          bordered
          dataSource={this.state.notifications}
          renderItem={this._listItem}
        />
      </div>
    );
  }
}

export default connector(Matches);
