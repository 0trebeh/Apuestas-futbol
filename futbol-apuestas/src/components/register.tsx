import React, {useState} from 'react';
import axios from 'axios';
import {Card, Input, Form, Button, Modal, notification} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {PhoneNumberUtil} from 'google-libphonenumber';

const phoneValidator = new PhoneNumberUtil();
type Props = {
  visible: boolean;
  onClose: () => void;
};

const RegisterPage = (props: Props) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [id, setId] = useState<string | undefined>();
  const [title, setTitle] = useState('Registrarse');

  const doRegister = async () => {
    setSaving(true);
    setTitle('Creando...');
    try {
      let form = new FormData();
      form.append('name', name);
      form.append('email', email);
      form.append('password', password);
      if (phone) {
        form.append('phone', phone);
      }
      if (lastName) {
        form.append('last_name', lastName);
      }
      if (address) {
        form.append('address', address);
      }
      if (id) {
        form.append('document', id);
      }
      await axios.post('/users/user', form);
      notification.success({
        message: 'Cuenta creada exitosamente!',
        placement: 'topRight',
      });
    } catch (err) {
      notification.error({
        message: 'Error creando la cuenta.',
        description: 'Es posible que el Email ya este registrado.',
        placement: 'topRight',
      });
    } finally {
      setSaving(false);
      setTitle('Registrarse');
    }
  };

  return (
    <Modal visible={props.visible} footer={null} onCancel={props.onClose}>
      <Card
        title={'Crea una cuenta'}
        style={{
          backgroundColor: '#dbd8e3',
          width: '100%',
        }}
        hoverable>
        <Form layout={'vertical'} onFinish={doRegister}>
          <Form.Item
            required={true}
            label={'Nombre'}
            name={'Nombre'}
            rules={[
              {
                required: true,
                message: 'Introduce un nombre!',
              },
            ]}>
            <Input onChange={e => setName(e.target.value)} />
          </Form.Item>
          <Form.Item label={'Apellido'} name={'Apellido'}>
            <Input onChange={e => setLastName(e.target.value)} />
          </Form.Item>
          <Form.Item
            required={true}
            label={'Correo'}
            name={'Correo'}
            hasFeedback
            rules={[
              {
                type: 'email',
                message: 'Direccion de correo no valida!',
              },
              {
                required: true,
                message: 'Introduce una direccion de correo!',
              },
            ]}>
            <Input onChange={e => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label={'Direccion'} name={'Direccion'}>
            <Input onChange={e => setAddress(e.target.value)} />
          </Form.Item>
          <Form.Item
            label={'Numero de telefono'}
            name={'Numero de telefono'}
            hasFeedback
            rules={[
              {
                validator: (_, value) => {
                  if (value.length === 0) {
                    return Promise.resolve();
                  }
                  if (Number.isNaN(Number.parseInt(value))) {
                    return Promise.reject('Solo numeros!');
                  } else {
                    try {
                      phoneValidator.isValidNumber(phoneValidator.parse(value));
                      return Promise.resolve();
                    } catch (err) {
                      return Promise.reject('Numero de telefono invalido!');
                    }
                  }
                },
              },
            ]}>
            <Input onChange={e => setPhone(e.target.value)} />
          </Form.Item>
          <Form.Item
            label={'DNI'}
            name={'DNI'}
            hasFeedback
            rules={[
              {
                validator: (_, value) => {
                  if (value.length === 0) {
                    return Promise.resolve();
                  }
                  if (Number.isNaN(Number.parseInt(value, 10))) {
                    return Promise.reject(new Error('Solo numeros!'));
                  }
                  if (value.length < 8) {
                    return Promise.reject(new Error('DNI invalido!'));
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            <Input onChange={e => setId(e.target.value)} />
          </Form.Item>
          <Form.Item
            required={true}
            label={'Contraseña'}
            name={'Contraseña'}
            rules={[
              {
                required: true,
                message: 'Introduce una contraseña!',
              },
              {
                min: 3,
                max: 30,
                message: 'Longitud debe estar entre 3 y 30 caracteres!',
              },
            ]}
            hasFeedback>
            <Input.Password onChange={e => setPassword(e.target.value)} />
          </Form.Item>
          <Form.Item
            required={true}
            label={'Confirma la contraseña'}
            name={'Confirmacion'}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Confirma la contraseña!',
              },
              {
                min: 3,
                max: 30,
                message: 'Longitud debe estar entre 3 y 30 caracteres!',
              },
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue('Contraseña') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Las contraseñas no son iguales!')
                  );
                },
              }),
            ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={saving}
              htmlType={'submit'}
              icon={
                <LoadingOutlined
                  hidden={!saving}
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
      </Card>
    </Modal>
  );
};

export default RegisterPage;
