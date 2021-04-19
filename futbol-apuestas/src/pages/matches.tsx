import React from 'react';
import {Tabs, message, Table, Tag} from 'antd';
import Header from '../components/pageHeader';
import {connect, ConnectedProps} from 'react-redux';
import {MatchInfo} from '../types/tournaments';
import axios from 'axios';
import BettingForm from '../components/bettingForm';

import type {RootState} from '../state-store/reducer.root';
import type {ColumnsType} from 'antd/lib/table';

const mapStateToProps = (state: RootState) => ({
  username: state.session.username,
  sessionActive: state.session.isSessionActive,
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
interface State {
  tournament: string;
  matches: MatchInfo[];
  loading: boolean;
  visibile: boolean;
  match?: MatchInfo;
}

class Matches extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tournament: 'PD',
      matches: [],
      loading: true,
      visibile: false,
    };
    this.fetchData.bind(this);
    this.tabChanged.bind(this);
  }

  columns: ColumnsType<MatchInfo> = [
    {
      title: 'Equipos',
      dataIndex: 'teams',
      key: 'teams',
      children: [
        {
          title: 'Casa',
          key: 'Home team',
          children: [
            {
              title: 'Nombre',
              key: 'home_team_name',
              dataIndex: 'home_team_name',
            },
            {
              title: 'Goles',
              key: 'home_goals',
              dataIndex: 'home_goals',
            },
            {
              title: 'Resultado',
              key: 'home_status',
              dataIndex: 'home_status',
            },
          ],
        },
        {
          title: 'Visitante',
          key: 'Away team',
          children: [
            {
              title: 'Nombre',
              key: 'away_team_name',
              dataIndex: 'away_team_name',
            },
            {
              title: 'Goles',
              key: 'away_goals',
              dataIndex: 'away_goals',
            },
            {
              title: 'Resultado',
              key: 'away_status',
              dataIndex: 'away_status',
            },
          ],
        },
      ],
    },
    {
      title: 'Fecha',
      key: 'date',
      dataIndex: 'date',
      sorter: (recordA, recordB) =>
        new Date(recordA.date).getTime() - new Date(recordB.date).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Estado',
      key: 'match_status',
      dataIndex: 'match_status',
      filters: [
        {text: 'FINISHED', value: 'FINISHED'},
        {text: 'SCHEDULED', value: 'SCHEDULED'},
        {text: 'AWARDED', value: 'AWARDED'},
      ],
      onFilter: (value, record) => record.match_status === value,
      sortDirections: ['ascend', 'descend'],
      sorter: (recordA, recordB) =>
        recordA.match_status.length - recordB.match_status.length,
    },
    {
      title: 'Apuesta',
      key: 'bet',
      render: (value, record, index) => (
        <Tag
          onClick={() => {
            if (record.match_status === 'SCHEDULED') {
              this.setState({...this.state, visibile: true, match: record});
            }
          }}
          style={{cursor: 'pointer'}}
          color={record.match_status === 'SCHEDULED' ? 'gold' : 'volcano'}>
          {record.match_status === 'SCHEDULED'
            ? 'Apostar'
            : 'Apuestas cerradas'}
        </Tag>
      ),
    },
  ];

  private tabChanged(
    key: string,
    e: React.MouseEvent<Element, Event> | React.KeyboardEvent<Element>
  ) {
    this.setState({
      ...this.state,
      tournament: key,
      loading: true,
    });
    this.fetchData();
  }

  private async fetchData() {
    try {
      const response = await axios.get<{matches: MatchInfo[]}>(
        `/tournaments/${this.state.tournament}/matches`
      );
      this.setState({
        ...this.state,
        matches: response.data.matches,
      });
    } catch (err) {
      message.error('Error cargando los partidos.');
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div>
        <Header sessionActive={this.props.sessionActive} title={'Partidos y Apuestas'}/>
        <Tabs
          defaultActiveKey={'PD'}
          centered
          animated
          onTabClick={this.tabChanged.bind(this)}>
          <Tabs.TabPane tab={'Primera division'} key={'PD'} />
          <Tabs.TabPane tab={'Champions league'} key={'CL'} />
          <Tabs.TabPane tab={'Copa mundial'} key={'WC'} />
        </Tabs>
        <Table
          loading={this.state.loading}
          bordered
          dataSource={this.state.matches}
          columns={this.columns}
        />
        <BettingForm
          visible={this.state.visibile}
          match={this.state.match}
          onCancel={() => this.setState({...this.state, visibile: false})}
        />
      </div>
    );
  }
}

export default connector(Matches);
