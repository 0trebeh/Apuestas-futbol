import React, { useState } from 'react';
import axios from 'axios';
import { Card, Input, Form, Button, Modal, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

type Props = {
    visible: boolean,
    onClose: () => void
}

const RegisterPage = (props: Props) => {

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('Registrarse');

    const doRegister = async () => {
        setSaving(true);
        setTitle('Creando...');
        try {
            let response = await axios.post('/users/', {
                name: name,
                password: password,
                email: email
            });
            console.log(response);
            notification.success({
                message: 'Cuenta creada exitosamente!',
                placement: 'topRight'
            });
            console.log('Register');
        } catch (err) {
            notification.error({
                message: err.response.data.content,
                description: 'Es posible que el Email ya este registrado.',
                placement: 'topRight'
            });
            console.error(err);
        } finally {
            setSaving(false);
            setTitle('Registrarse');
        }
    }

    return (
        <Modal
            visible={props.visible}
            footer={null}
            onCancel={props.onClose}
        >
            <Card
                title={'Crea una cuenta'}
                style={{
                    backgroundColor: '#dbd8e3',
                    width: '100%'
                }}
                hoverable
            >
                <Form
                    layout={'vertical'}
                    onFinish={doRegister}
                >
                    <Form.Item
                        required={true}
                        label={'Nombre'}
                        name={'Nombre'}
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
                        label={'Correo'}
                        name={'Correo'}
                        hasFeedback
                        rules={[
                            {
                                type: 'email',
                                message: 'Direccion de correo no valida!'
                            },
                            {
                                required: true,
                                message: 'Introduce una direccion de correo!'
                            }
                        ]}
                    >
                        <Input onChange={(e) => (setEmail(e.target.value))} />
                    </Form.Item>
                    <Form.Item
                        required={true}
                        label={'Contraseña'}
                        name={'Contraseña'}
                        rules={[
                            {
                                required: true,
                                message: 'Introduce una contraseña!'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password onChange={(e) => (setPassword(e.target.value))} />
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
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('Contraseña') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Las contraseñas no son iguales!'));
                                },
                            }),
                        ]}
                    >
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

export default RegisterPage;