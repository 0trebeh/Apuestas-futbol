import React from 'react';
import {message, Table, Input, Button, Space, Tabs, Tag, Calendar} from 'antd';
import Header from '../components/pageHeader';
import {connect, ConnectedProps} from 'react-redux';
import {MatchInfo} from '../types/tournaments';
import axios from 'axios';
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import BettingForm from '../components/bettingForm';
import moment from 'moment';

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
  searchText: string;
  searchedColumn: string;
  value: any;
}

class Matches extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tournament: 'PD',
      matches: [],
      loading: true,
      visibile: false,
      searchText: '',
      searchedColumn: '',
      value: moment(new Date().getFullYear()+"-"+(new Date().getMonth() + 1)+"-"+new Date().getDate()),
    };
    this.fetchData.bind(this);
    this.tabChanged.bind(this);
  }

  getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{padding: 8}}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          style={{width: 188, marginBottom: 8, display: 'block'}}
        />
        <div style={{
        width: '300px',
        border: '1px solid #f0f0f0',
        }}>
          {dataIndex === 'date' ?
            <Calendar fullscreen={false} value={this.state.value} 
            onSelect={e => {
              let ee = e.toString();
              setSelectedKeys(new Date(ee).toUTCString().substr(0,17) 
              ? [new Date(ee).toUTCString().substr(0,17)] 
              : []);
              this.onSelect(e);
            }} />
            :
            null
          }
        </div>
        <Space>
          <Button
            type='primary'
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{width: 90}}>
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size='small'
            style={{width: 90}}>
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({closeDropdown: false});
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}>
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text: any) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  onSelect = (value: any) => {
    let date = new Date(value).toUTCString().substr(0,17);
    this.setState({
      value: value,
      searchText: date
    });
  };

  handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters: any) => {
    clearFilters();
    this.setState({searchText: ''});
  };

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
              ...this.getColumnSearchProps('home_team_name'),
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
              ...this.getColumnSearchProps('away_team_name'),
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
      ...this.getColumnSearchProps('date'),
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
        <Header sessionActive={this.props.sessionActive} title={'Partidos y Apuestas'} />
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
