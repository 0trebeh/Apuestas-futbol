import React, {useState, useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Form, Button, Modal, Input, message, Select, Typography} from 'antd';
import axios from 'axios';
import {LoadingOutlined} from '@ant-design/icons';

import type {RootState} from '../state-store/reducer.root';
import type {MatchInfo} from '../types/tournaments';

const mapDispatchToProps = {
  reduxSetBalance: (balance: number) => ({
    type: 'SET_USER_BALANCE',
    balance: balance,
  }),
};
const mapStateToProps = (state: RootState) => ({
  token: state.session.token,
  balance: state.session.balance,
});
const connector = connect(mapStateToProps, mapDispatchToProps);
const scoreRegex: RegExp = /^[0-9]{1,2}:[0-9]{1,2}$/g;
const goalsRegex: RegExp = /^[0-9]{1,2}$/g;

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  visible: boolean;
  onCancel: () => void;
  match?: MatchInfo;
};

interface FormValues {
  prediction: string;
  bet_type?:
    | '1'
    | '2'
    | 'X'
    | '1X'
    | 'X2'
    | '1 or 2'
    | 'over'
    | 'under'
    | 'Correct score';
  ammount: number;
}

function BettingForm(props: Props) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('Submit');
  const [bet_type, setBet_type] = useState<string | undefined>();
  const [team, setTeam] = useState<undefined | number>();

  const verify = (select_val: string | undefined) => {
    setBet_type(select_val);
    if (!select_val) {
      setTeam(undefined);
      return;
    }
    switch (select_val) {
      case '1': {
        setTeam(props.match?.home_team_id);
        break;
      }
      case '2': {
        setTeam(props.match?.away_team_id);
        break;
      }
      case '1X': {
        setTeam(props.match?.home_team_id);
        break;
      }
      case 'X2': {
        setTeam(props.match?.away_team_id);
        break;
      }
      default: {
        setTeam(props.match?.home_team_id);
        break;
      }
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (!bet_type) {
        throw new Error('Seleccione un tipo de apuesta!');
      }
      if (values.ammount <= 0) {
        throw new Error('Inserte una cantidad valida');
      }
      if (values.ammount > props.balance) {
        throw new Error('Saldo insuficiente');
      }
      setLoading(true);
      setTitle('Guardando apuesta');
      const response = await axios.post(
        '/bets/bet',
        {
          ...values,
          match: props.match?.match_id,
          team: team,
        },
        {
          headers: {authorization: props.token},
        }
      );
      props.reduxSetBalance(response.data.balance);
      values.bet_type = undefined;
      message.success('Operacion exitosa!');
    } catch (err) {
      message.error('No se pudo procesar la transaccion.');
    } finally {
      setLoading(false);
      setTitle('Submit');
    }
  };

  useEffect(() => {
    setBet_type(undefined);
    setTeam(undefined);
  }, [props.visible]);

  return (
    <Modal visible={props.visible} onCancel={props.onCancel} footer={null}>
      <Typography.Title level={2}>
        Saldo actual: ${props.balance}
      </Typography.Title>
      <Form layout={'vertical'} onFinish={onSubmit}>
        <Form.Item
          label={'Tipo de apuesta'}
          hasFeedback
          name={'bet_type'}
          rules={[
            {
              required: true,
              message: 'Seleccione un tipo de apuesta!',
            },
          ]}>
          <Select allowClear onChange={value => verify(value?.toString())}>
            <Select.Option value='1'>Casa gana</Select.Option>
            <Select.Option value='2'>Visitante gana</Select.Option>
            <Select.Option value='X'>Empate</Select.Option>
            <Select.Option value='1X'>Casa gana o empate</Select.Option>
            <Select.Option value='X2'>Empate o visitante gana</Select.Option>
            <Select.Option value='1 or 2'>
              Casa gana o visitante gana
            </Select.Option>
            <Select.Option value='over'>Goles por encima</Select.Option>
            <Select.Option value='under'>Goles por debajo</Select.Option>
            <Select.Option value='Correct score'>Puntuacion</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={'Prediccion'}
          name={'prediction'}
          hasFeedback
          tooltip={
            'En el caso de puntuacion el formato es puntosCasa:puntosVisitante. En el caso de under/over escriba el numero de goles'
          }
          rules={[
            {
              required:
                bet_type === 'Correct score'
                  ? true
                  : bet_type === 'under'
                  ? true
                  : bet_type === 'over'
                  ? true
                  : false,
              message: 'Introduzca la prediccion!',
            },
            {
              pattern:
                bet_type === 'Correct score'
                  ? scoreRegex
                  : bet_type === 'under'
                  ? goalsRegex
                  : bet_type === 'over'
                  ? goalsRegex
                  : /./g,
              message: 'Formato incorrecto!',
            },
          ]}>
          <Input type={'text'} />
        </Form.Item>
        <Form.Item
          name={'ammount'}
          label={'Cantidad a apostar'}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Introduzca la cantidad a apostar',
            },
            {
              min: 3,
              message: 'Un valor de al menos 3 digitos',
            },
          ]}>
          <Input type={'number'} />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={loading}
            htmlType={'submit'}
            icon={
              <LoadingOutlined
                hidden={!loading}
                spin={true}
                style={{
                  color: 'lime',
                }}
              />
            }>
            {title}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default connector(BettingForm);
