import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MenuComponent from '../components/pageHeader';
import {Card, List, Descriptions, Popconfirm} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

import type {RootState} from '../state-store/reducer.root';
import type {Bet} from '../types/bets';

const mapStateToProps = (state: RootState) => ({
  username: state.session.session.username,
  sessionActive: state.session.session.isSessionActive,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
type State = {
  bets: Bet[];
  loading: boolean;
};

class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bets: [
        {
          id: 'asdasd',
          ammount: 1000000,
          status: 'Terminada',
          team: 'Manchester',
          result: 'Ganaste',
        },
        {
          id: 'asdasd',
          ammount: 500,
          status: 'Terminada',
          team: 'Manchester',
          result: 'Perdiste',
        },
        {
          id: 'asdasd',
          ammount: 500,
          status: 'En espera',
          team: 'Barcelona',
        },
      ],
      loading: false,
    };
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
            Nombre del usuario
          </Descriptions.Item>
          <Descriptions.Item label={'Correo'}>
            Correo del usuario
          </Descriptions.Item>
          <Descriptions.Item label={'Saldo'} style={labelStyle}>
            $0
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
