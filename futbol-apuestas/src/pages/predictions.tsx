import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MenuComponent from '../components/pageHeader';
import {message, Table, Input, Button, Space, Tabs} from 'antd';
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons';

import type {RootState} from '../state-store/reducer.root';
import type {Prediction, PredictionMatches} from '../types/predictions';
import axios from 'axios';
import {ColumnsType} from 'antd/lib/table';

const mapStateToProps = (state: RootState) => ({
  username: state.session.username,
  sessionActive: state.session.isSessionActive,
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
type State = {
  prediction: Prediction[];
  predictionMatches: PredictionMatches[];
  loading: boolean;
  loading2: boolean;
  searchText: string;
  searchedColumn: string;
};

class Predictions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      prediction: [],
      predictionMatches: [],
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
      message.info('asd');
      const response = await axios.get('/tournaments/prediction/' + season, {
        headers: {authorization: this.props.token},
      });
      this.setState({
        ...this.state,
        prediction: response.data,
        loading: false,
      });
      const responseMatchs = await axios.get(
        'tournaments/prediction/matches/' + season,
        {
          headers: {authorization: this.props.token},
        }
      );
      this.setState({
        ...this.state,
        predictionMatches: responseMatchs.data,
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

  getColumnSearchProps = (dataIndex: string) => ({
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
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{width: 188, marginBottom: 8, display: 'block'}}
        />
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

  render() {
    const columns = [
      {
        title: 'Equipo',
        dataIndex: 'team_name',
        key: 'team_name',
      },
      {
        title: 'Probabilidad de victoria',
        dataIndex: 'p_winner',
        key: 'p_winner',
      },
      {
        title: 'Probabilidad de derrota',
        dataIndex: 'p_loser',
        key: 'p_loser',
      },
      {
        title: 'Probabilidad de empatar',
        dataIndex: 'p_draw',
        key: 'p_draw',
      },
    ];

    const columnsMatches: ColumnsType<PredictionMatches> = [
      {
        title: 'Equipo 1',
        dataIndex: 'name1',
        key: 'name1',
        ...this.getColumnSearchProps('name1'),
      },
      {
        title: 'Jugando',
        dataIndex: 'side1',
        key: 'side1',
      },
      {
        title: '1',
        dataIndex: 'tm1_winner',
        key: 'tm1_winner',
      },
      {
        title: 'x',
        dataIndex: 'tm_draw',
        key: 'tm_draw',
      },
      {
        title: '2',
        dataIndex: 'tm2_winner',
        key: 'tm2_winner',
      },
      {
        title: 'Equipo 2',
        dataIndex: 'name2',
        key: 'name2',
      },
      {
        title: 'Jugando',
        dataIndex: 'side2',
        key: 'side2',
      },
      {
        title: 'gano 1',
        dataIndex: 't1_winner',
        key: 't1_winner',
      },
      {
        title: 'empate x',
        dataIndex: 'draw',
        key: 'draw',
      },
      {
        title: 'gano 2',
        dataIndex: 't2_winner',
        key: 't2_winner',
      },
      {
        title: 'Estado',
        dataIndex: 'match_status',
        key: 'match_status',
      },
      {
        title: 'Fecha',
        dataIndex: 'date',
        key: 'date',
      },
    ];

    return (
      <div>
        <MenuComponent
          sessionActive={this.props.sessionActive}
          title={'Estadisticas'}
        />
        <Tabs
          defaultActiveKey={'635'}
          centered
          animated
          onTabClick={this.tabChanged.bind(this)}>
          <Tabs.TabPane tab={'Primera division'} key={'635'} />
          <Tabs.TabPane tab={'Champions league'} key={'1'} />
          <Tabs.TabPane tab={'Copa mundial'} key={'642'} />
        </Tabs>
        <h2>Predicciones por equipos:</h2>
        <Table
          dataSource={this.state.prediction}
          columns={columns}
          size='small'
          loading={this.state.loading}
        />

        <h2 style={{marginTop: 10}}>Predicciones por partidos: </h2>
        <Table
          dataSource={this.state.predictionMatches}
          columns={columnsMatches}
          size='small'
          loading={this.state.loading2}
        />
      </div>
    );
  }
}

export default connector(Predictions);
