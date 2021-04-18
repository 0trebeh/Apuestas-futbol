import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Form, Button, Modal, Input, message, Select} from 'antd';
import axios from 'axios';
import {LoadingOutlined} from '@ant-design/icons';
import type {RootState} from '../state-store/reducer.root';

const { Option } = Select;

const mapDispatchToProps = {
  reduxSetBalance: (balance: number) => ({
    type: 'SET_USER_BALANCE',
    balance: balance,
  }),
};
const mapStateToProps = (state: RootState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  visible: boolean;
  onCancel: () => void;
};

interface FormValues {
  bank: string;
  ref: string;
  acc_number: string;
  date: string;
  balance: string;
}

function BalanceForm(props: Props) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('Submit');
  const [form] = Form.useForm();

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      setTitle('');
      const response = await axios.post('/users/user/balance', values, {
        headers: {authorization: props.token},
      });
      props.reduxSetBalance(response.data.balance);
      message.success('Operacion exitosa!');
    } catch (err) {
      message.error(err.response.data.message);
    } finally {
      setLoading(false);
      setTitle('Submit');
    }
  };

  const onGenderChange = (value: any) => {
    switch (value) {
      case 'BOD':
        form.setFieldsValue({
          note: 'BOD',
        });
        return;

      case 'Banesco':
        form.setFieldsValue({
          note: 'Banesco',
        });
        return;

      case 'BA':
        form.setFieldsValue({
          note: 'Bank of America',
        });
        return;

      case 'Provincial':
        form.setFieldsValue({
          note: 'Provincial',
        });
    }
  };

  return (
    <Modal visible={props.visible} onCancel={props.onCancel} footer={null}>
      <Form layout={'vertical'} onFinish={onSubmit}>
        
        <Form.Item
          label={'Banco'}
          name={'bank'}
          hasFeedback>
            <Select
              placeholder="Select a option and change input text above"
              onChange={onGenderChange}
              allowClear
            >
              <Option value="BOD">BOD</Option>
              <Option value="Banesco">Banesco</Option>
              <Option value="Provincial">Provincial</Option>
              <Option value="BA">Bank of America</Option>
            </Select>
        </Form.Item>
        <Form.Item
          label={'Referencia'}
          name={'ref'}
          hasFeedback
          rules={[
            {required: true, message: 'Introduce la referencia'},
            {
              min: 8,
              max: 8,
              message: 'Referencia invalida',
            },
          ]}>
          <Input type={'number'} />
        </Form.Item>
        <Form.Item
          label={'Numero de cuenta'}
          name={'acc_number'}
          hasFeedback
          rules={[
            {required: true, message: 'Introduce el numero de cuenta'},
            {
              min: 15,
              max: 15,
              message: 'Numero de cuenta invalido',
            },
          ]}>
          <Input type={'number'} />
        </Form.Item>
        <Form.Item
          label={'Fecha'}
          name={'date'}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Introduce la fecha de pago',
            },
          ]}>
          <Input type={'date'} />
        </Form.Item>
        <Form.Item
          label={'Saldo a transferir'}
          hasFeedback
          name={'balance'}
          rules={[
            {
              required: true,
              message: 'Introduce un valor!',
            },
            {
              min: 4,
              message: 'Un valor de al menos 4 digitos',
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

export default connector(BalanceForm);
