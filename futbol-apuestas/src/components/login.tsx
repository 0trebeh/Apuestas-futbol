import React, { useState } from 'react';
import axios from 'axios';
import { Card, Input, Form, Button, Modal, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect, ConnectedProps } from 'react-redux';

import type { Session } from '../state-store/session/session.types';

const mapDispatchToProps = {
    reduxSession: (userData: Session) => ({ type: 'SAVE_SESSION_DATA', data: userData })
}

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
    visible: boolean,
    onClose: () => void
}
const LoginPage = (props: Props) => {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState('Iniciar sesion');
    const [number, setNumber] = useState(0);

    const doLogin = async () => {
        setSaving(true);
        setTitle('Verificando...');
        try {
            let response = await axios.post('https://fap-api.herokuapp.com/users/login', {
                username: name,
                password: password
            });
            notification.success({
                message: 'Inicio de sesion exitoso!',
                placement: 'topRight'
            });
            props.reduxSession({
                isSessionActive: true,
                token: response.data.token,
                username: name
            });
        } catch (err) {
            notification.error({
                message: err.response.data.content,
                placement: 'topRight'
            });
            console.error(err);
        } finally {
            setSaving(false);
            setTitle('Iniciar sesion');
        }
    }

    const showFailedNotification = () => {
        if (number === 5) {
            setNumber(0);
            notification.error({
                message: "Coño e' tu madre, rellena el formulario!",
                placement: 'topRight'
            })
        }
        else {
            setNumber(number + 1);
        }
    }

    return (
        <Modal
            visible={props.visible}
            footer={null}
            onCancel={props.onClose}
        >
            <Card
                title={'Inicia sesion'}
                style={{
                    backgroundColor: '#dbd8e3',
                    width: '100%'
                }}
                hoverable
            >
                <Form
                    layout={'vertical'}
                    onFinish={doLogin}
                    onFinishFailed={showFailedNotification}
                >
                    <Form.Item
                        required={true}
                        label={'Nombre'}
                        name={'Nombre'}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Introduce un nombre!'
                            }
                        ]}
                    >
                        <Input onChange={(e) => (setName(e.target.value))} />
                    </Form.Item>
                    <Form.Item
                        required={true}
                        label={'Contraseña'}
                        name={'Contraseña'}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Introduce una contraseña!'
                            }
                        ]}
                    >
                        <Input.Password onChange={(e) => (setPassword(e.target.value))} />
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
                                        color: 'lime'
                                    }}
                                />
                            }
                        >
                            {title}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Modal>
    );
}

export default connect(null, mapDispatchToProps)(LoginPage);