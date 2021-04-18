import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MenuComponent from '../components/pageHeader';
import {message, Table, Input, Button, Space, Tabs} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

import type {RootState} from '../state-store/reducer.root';
import type {Scorer, TopTeams} from '../types/scorers';
import axios from 'axios';

const mapStateToProps = (state: RootState) => ({
  username: state.session.username,
  sessionActive: state.session.isSessionActive,
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
type State = {
  top: Scorer[];
  topTeam: TopTeams[];
  loading: boolean;
  loading2: boolean;
  searchText: string,
  searchedColumn: string,
};

class Stats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      top: [],
      topTeam: [],
      loading: true,
      loading2: true,
      searchText: '',
      searchedColumn: '',
    };
    this.getData.bind(this);
    this.tabChanged.bind(this);
  }

  private async getData(season: string) {
    try {
      this.setState({
        ...this.state,
        loading: true,
        loading2: true,
      });
      const response = await axios.get('/stats/topScore/'+ season, {
        headers: {authorization: this.props.token},
      });
      this.setState({
        ...this.state,
        top: response.data,
        loading: false,
      });
      const responseTeam = await axios.get('/stats/topTeams/'+ season, {
        headers: {authorization: this.props.token},
      });
      this.setState({
        ...this.state,
        topTeam: responseTeam.data,
        loading2: false,
      });
    } catch (err) {
      message.error('Error al obtener Estadisticas :(');
    }
  }

  componentDidMount() {
    this.getData('635');
  }
  
  private tabChanged(
    key: string,
    e: React.MouseEvent<Element, Event> | React.KeyboardEvent<Element>
  ) {
    this.getData(key);
  }

  getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: (text: any) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters: any) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: 'Top',
        dataIndex: 'top',
        key: 'top',
      },
      {
        title: 'Equipo',
        dataIndex: 'team',
        key: 'team',
        ...this.getColumnSearchProps('team'),
      },
      {
        title: 'Jugador',
        dataIndex: 'player',
        key: 'player',
        ...this.getColumnSearchProps('player'),
        render: (name: string) => <a href={`https://www.google.com/search?q=${name}+futbol`} target="_blank" rel="noreferrer">{name}</a>,
      },
      {
        title: 'Goles',
        dataIndex: 'number_goals',
        key: 'number_goals',
      },
    ];

    const columnsTopTeams = [
      {
        title: 'Top',
        dataIndex: 'top',
        key: 'top',
      },
      {
        title: 'Equipo',
        dataIndex: 'team_name',
        key: 'team_name',
        ...this.getColumnSearchProps('team_name'),
        render: (name: string) => <a href={`https://www.google.com/search?q=${name}+futbol`} target="_blank" rel="noreferrer">{name}</a>,
      },
      {
        title: 'Total de Goles',
        dataIndex: 'total_goals',
        key: 'total_goals',
      },
      {
        title: 'Total de Victorias',
        dataIndex: 'total_winner',
        key: 'total_winner',
      },
      {
        title: 'Total de Derrotas',
        dataIndex: 'total_loser',
        key: 'total_loser',
      },
      {
        title: 'Total de Empates',
        dataIndex: 'total_draw',
        key: 'total_draw',
      },
    ];

    return (
      <div>
        <MenuComponent sessionActive={this.props.sessionActive} title={'Estadisticas'} />
        <Tabs
          defaultActiveKey={'635'}
          centered
          animated
          onTabClick={this.tabChanged.bind(this)}>
          <Tabs.TabPane tab={'Primera division'} key={'635'} />
          <Tabs.TabPane tab={'Champions league'} key={'1'} />
          <Tabs.TabPane tab={'Copa mundial'} key={'642'} />
        </Tabs>
        <h2>Top de Goleadores:</h2>
        <Table dataSource={this.state.top} columns={columns} size="small" loading={this.state.loading}/>

        <h2 style={{ marginTop: 10 }}>Top de Equipos: </h2>
        <Table dataSource={this.state.topTeam} columns={columnsTopTeams} size="small" loading={this.state.loading2}/>
      </div>
    );
  }
}

export default connector(Stats);