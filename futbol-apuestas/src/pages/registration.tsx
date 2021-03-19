import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { connect, ConnectedProps } from 'react-redux';

const RegisterPage = () => {

    let history = useHistory();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState('Crear cuenta');

    const postProfile = async () => {
        setSaving(true);
        setTitle('Creando...');
        try {
            let response = await axios.post('/api/users/', {
                name: name,
                email: email,
                password: password
            });
            if (response.status === 200) {
                console.log('CREADA');
            }
            else {
                console.error(JSON.stringify(response));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
            setTitle('Crear cuenta');
        }
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '125vh',
                    width: '100vw',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#30475e',
                        borderRadius: '5%'
                    }}
                >
                    <i
                        style={{
                            paddingLeft: 12,
                            color: 'white',
                            position: 'absolute'
                        }}
                        className="fas fa-arrow-left fa-2x"
                        onClick={() => (
                            history.goBack()
                        )}
                    >
                    </i>
                    <p
                        style={{
                            color: 'white',
                            fontSize: 25,
                            fontWeight: 'bold',
                            paddingLeft: 30,
                            paddingRight: 30,
                        }}
                    >
                        Crea una nueva cuenta
                    </p>
                    <p
                        style={{
                            color: 'white',
                            fontSize: 15,
                            fontWeight: 'bold',
                            paddingLeft: 30,
                            paddingRight: 30,
                            borderBottomStyle: 'solid',
                            borderColor: '#222831',
                            textAlign: 'center'
                        }}
                    >
                        Unete al <span style={{ color: 'red' }}>FAP</span>eo
                    </p>
                    <p
                        style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: 'bold',
                            paddingLeft: 30,
                        }}
                    >
                        Nombre
                    </p>
                    <div
                        style={{
                            alignSelf: 'center',
                            paddingLeft: 25,
                            paddingBottom: 10
                        }}
                    >
                        <input
                            placeholder={'Nombre'}
                            type={'text'}
                            style={{
                                fontSize: 15
                            }}
                            onChange={(e) => (
                                setName(e.target.value)
                            )}
                        />
                    </div>
                    <p
                        style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: 'bold',
                            paddingLeft: 30,
                        }}
                    >
                        Correo
                    </p>
                    <div
                        style={{
                            alignSelf: 'center',
                            paddingLeft: 25,
                            paddingBottom: 10,
                        }}
                    >
                        <input
                            placeholder={'Correo'}
                            type={'email'}
                            style={{
                                fontSize: 15
                            }}
                            onChange={(e) => (
                                setEmail(e.target.value)
                            )}
                        />
                    </div>
                    <p
                        style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: 'bold',
                            paddingLeft: 30,
                        }}
                    >
                        Contraseña
                    </p>
                    <div
                        style={{
                            alignSelf: 'center',
                            paddingLeft: 25,
                            paddingBottom: 20,
                        }}
                    >
                        <input
                            placeholder={'Contraseña'}
                            type={'password'}
                            style={{
                                fontSize: 15
                            }}
                            onChange={(e) => (
                                setPassword(e.target.value)
                            )}
                        />
                    </div>
                    <div
                        style={{
                            width: '100%',
                            paddingBottom: 20,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <input
                            type={'button'}
                            disabled={saving}
                            value={title}
                            onClick={postProfile}
                            style={{
                                fontSize: 15,
                                width: '80%',
                                padding: 5
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
