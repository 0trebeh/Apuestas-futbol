import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MenuComponent from '../components/pageHeader';
import BalanceForm from '../components/balanceForm';
import {List, Descriptions, Popconfirm, message, Skeleton, Tag} from 'antd';
import { PDFDownloadLink } from "@react-pdf/renderer";
import {PdfDocument} from '../components/bettingInformation';

import type {RootState} from '../state-store/reducer.root';
import type {Bet} from '../types/bets';
import axios from 'axios';

const mapStateToProps = (state: RootState) => ({
  username: state.session.username,
  sessionActive: state.session.isSessionActive,
  token: state.session.token,
  balance: state.session.balance,
});
const mapDispatchToProps = {
  reduxSetBalance: (balance: number) => ({
    type: 'SET_USER_BALANCE',
    balance: balance,
  }),
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
type State = {
  bets: Bet[];
  load: boolean;
  email: string;
  visible: boolean;
};

class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bets: [],
      load: true,
      email: '',
      visible: false,
    };
    this.getData.bind(this);
    this.deleteBet.bind(this);
  }

  private async getData() {
    try {
      this.setState({
        ...this.state,
        load: true,
      });
      const response = await axios.get('/users/user', {
        headers: {authorization: this.props.token},
      });
      this.setState({
        ...this.state,
        email: response.data.profile.email,
        load: false,
        bets: response.data.bets,
      });
      this.props.reduxSetBalance(response.data.profile.balance);
    } catch (err) {
      console.log(err);
      message.error('Error cargando el perfil :(');
    }
  }

  async deleteBet(id: string) {
    try {
      message.info('Eliminando apuesta...');
      const response = await axios.delete(`/bets/bet/${id}`, {
        headers: {authorization: this.props.token},
      });
      this.props.reduxSetBalance(response.data.balance);
      message.success('Apuesta eliminada');
    } catch (err) {
      message.error('Error borrando la apuesta');
    } finally {
      this.getData();
    }
  }

  componentDidMount() {
    this.getData();
  }

  private _listItem(item: Bet, index: number) {
    return (
      <Popconfirm
        title={'Selecciona una accion'}
        onConfirm={() => this.deleteBet(item.bet)}
        okText={item.status === 'PENDING' ? 'Cancelar apuesta' : 'Borrar'}
        cancelText={'X'}>
        <List.Item key={index}>
          <Descriptions layout={'vertical'} title={item.team_name}>
            <Descriptions.Item label={'Dinero apostado'}>
              {`$${item.ammount}`}
            </Descriptions.Item>
            <Descriptions.Item label={'Tipo de apuesta'}>
              {item.bet_name}
            </Descriptions.Item>
            <Descriptions.Item label={'Status'}>
              {item.status}
            </Descriptions.Item>
            <Descriptions.Item label={'Prediccion'}>
              {item.prediction}
            </Descriptions.Item>
          </Descriptions>
        </List.Item>
      </Popconfirm>
    );
  }

  render() {
    return (
      <div>
        <MenuComponent sessionActive={this.props.sessionActive} title={'Perfil'}/>
        <div>
          { 
          this.state.email !== 'futbol.apuestas.v01@gmail.com' 
          ?  
        <div>
          <Descriptions layout={'vertical'} bordered>
          <Descriptions.Item label={'Nombre'}>
            <Skeleton active loading={this.state.load} paragraph={{rows: 0}}>
              {this.props.username}
            </Skeleton>
          </Descriptions.Item>
          <Descriptions.Item label={'Correo'}>
            <Skeleton active loading={this.state.load} paragraph={{rows: 0}}>
              {this.state.email}
            </Skeleton>
          </Descriptions.Item>
          <Descriptions.Item label={'Saldo'} style={labelStyle}>
            <Skeleton active loading={this.state.load} paragraph={{rows: 0}}>
              {`$${this.props.balance}`}
              {'  '}
              <Tag
                color={'success'}
                style={{cursor: 'pointer'}}
                onClick={() => this.setState({...this.state, visible: true})}>
                Añadir saldo
              </Tag>
            </Skeleton>
          </Descriptions.Item>
        </Descriptions>
        <List
          loading={this.state.load}
          bordered
          size={'large'}
          dataSource={this.state.bets}
          itemLayout={'horizontal'}
          header={<b>Mis Apuestas</b>}
          renderItem={this._listItem.bind(this)}
        />
        <BalanceForm
          visible={this.state.visible}
          onCancel={() => this.setState({...this.state, visible: false})}
        /> 
        </div>
        : 
        <div>
          <PdfDocument Props={this.props}/>
          <div style={{ marginTop: 50, display: "flex", justifyContent: "center"}}>
          <PDFDownloadLink
            document={<PdfDocument Props={this.props}/>}
            fileName={"Apuestas "+new Date().toUTCString().substr(0,16)+".pdf"}
            style={{
              textDecoration: "none",
              padding: "10px",
              color: "#4a4a4a",
              backgroundColor: "#f2f2f2",
              border: "1px solid #4a4a4a",
            }}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download Pdf"
            }
          </PDFDownloadLink>
          </div>
        </div>
        }
        </div>
      </div>
    );
  }
}

const labelStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: 15,
};

export default connector(Profile);
