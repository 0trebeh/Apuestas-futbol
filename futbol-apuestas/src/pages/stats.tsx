import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MenuComponent from '../components/pageHeader';
import {Table, Card, message} from 'antd';

import type {RootState} from '../state-store/reducer.root';
import type {Scorer} from '../types/scorers';
import axios from 'axios';

const mapStateToProps = (state: RootState) => ({
  username: state.session.session.username,
  sessionActive: state.session.session.isSessionActive,
  token: state.session.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
type State = {
  top: Scorer[];
  loading: boolean;
  season: number;
};

class Stats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      top: [],
      loading: true,
      season: 635,
    };
    this.getData.bind(this);
  }

  private async getData() {
    try {
      this.setState({
        ...this.state,
        loading: true,
      });
      const response = await axios.get('/stats/'+this.state.season, {
        headers: {authorization: this.props.token},
      });
      let list = [];
      for (let i = 0; i < response.data.length; i++) {
        let object = Object.assign({top: i+1}, response.data[i]);
        list.push(object);
      }
      console.log(list);
      this.setState({
        ...this.state,
        top: list,
        loading: false,
      });
    } catch (err) {
      message.error('Error al obtener Estadisticas :(');
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const columns = [
      {
        title: 'Top',
        dataIndex: 'top',
        key: 'top',
      },
      {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
      },
      {
        title: 'Name',
        dataIndex: 'player',
        key: 'player',
      },
      {
        title: 'Goals',
        dataIndex: 'number_goals',
        key: 'number_goals',
      },
    ];
    return (
      <div>
        <MenuComponent sessionActive={this.props.sessionActive} />
        <Card.Meta
          title={'Estadisticas'}
          description={'Scorers'}
        />
        <Table dataSource={this.state.top} columns={columns}/>
      </div>
    );
  }
}

export default connector(Stats);