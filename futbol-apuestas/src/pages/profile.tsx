import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MenuComponent from '../components/pageHeader';
import {List, Descriptions, Popconfirm, message, Skeleton} from 'antd';

import type {RootState} from '../state-store/reducer.root';
import type {Bet} from '../types/bets';
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
  bets: Bet[];
  loading: boolean;
  email: string;
  balance: number;
};

class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bets: [],
      loading: true,
      email: '',
      balance: 0,
    };
    this.getData.bind(this);
  }

  private async getData() {
    try {
      this.setState({
        ...this.state,
        loading: true,
      });
      const response = await axios.get('/users/user', {
        headers: {authorization: this.props.token},
      });
      this.setState({
        ...this.state,
        email: response.data.profile.email,
        balance: response.data.profile.balance,
        loading: false,
      });
    } catch (err) {
      message.error('Error cargando el perfil :(');
    }
  }

  componentDidMount() {
    this.getData();
  }

  private _listItem(item: Bet, index: number) {
    return (
      <Popconfirm
        title={'Selecciona una accion'}
        okText={item.status === 'En espera' ? 'Editar' : 'Borrar'}
        cancelText={item.status === 'En espera' ? 'Cancelar' : 'X'}>
        <List.Item
          key={index}
          actions={[<b>{item.status}</b>, <b>{item.result}</b>]}>
          <List.Item.Meta title={item.team} description={`$${item.ammount}`} />
        </List.Item>
      </Popconfirm>
    );
  }

  render() {
    return (
      <div>
        <MenuComponent sessionActive={this.props.sessionActive} />
        <Descriptions layout={'vertical'} bordered title={'Perfil'}>
          <Descriptions.Item label={'Nombre'}>
            <Skeleton active loading={this.state.loading} paragraph={{rows: 0}}>
              {this.props.username}
            </Skeleton>
          </Descriptions.Item>
          <Descriptions.Item label={'Correo'}>
            <Skeleton active loading={this.state.loading} paragraph={{rows: 0}}>
              {this.state.email}
            </Skeleton>
          </Descriptions.Item>
          <Descriptions.Item label={'Saldo'} style={labelStyle}>
            <Skeleton active loading={this.state.loading} paragraph={{rows: 0}}>
              {`$${this.state.balance}`}
            </Skeleton>
          </Descriptions.Item>
        </Descriptions>
        <List
          bordered
          size={'large'}
          dataSource={this.state.bets}
          itemLayout={'horizontal'}
          header={<b>Apuestas</b>}
          renderItem={this._listItem.bind(this)}
        />
      </div>
    );
  }
}

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: 15,
};

export default connector(Profile);
