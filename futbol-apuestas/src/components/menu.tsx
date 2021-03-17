import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
    sessionActive: boolean
}

function MenuComponent(props: Props) {
    let history = useHistory();

    const [hidden, setHidden] = useState(false);

    return (
        <div
            style={{
                backgroundColor: '#1f4068',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                textAlign: 'center'
            }}
        >
            <span
                style={{
                    color: 'white',
                    fontSize: 35,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                }}
            >
                FAP
            </span>
            <br />
            <span
                style={{
                    color: 'white',
                    fontSize: 35,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                }}
            >
                Futbol APuestas
            </span>
            <i
                className="fas fa-bars fa-2x"
                style={{
                    color: 'white',
                    left: '5%',
                    position: 'absolute',
                    top: '5%'
                }}
                onClick={() => (
                    setHidden(!hidden)
                )}
            >
            </i>
            <div>
                <table
                    hidden={hidden}
                    style={{
                        backgroundColor: '#1f4068',
                        color: 'white',
                        width: '25%',
                        height: '60%',
                        opacity: 0.7,
                        position: 'absolute'
                    }}
                >
                    <tbody>
                        <tr>
                            <td
                                style={{
                                    padding: 10,
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    borderBottomStyle: 'solid'
                                }}
                            >
                                Apuestas
                            </td>
                            <i
                                style={{
                                    padding: 10,
                                }}
                                className="fas fa-dice fa-2x"
                            >
                            </i>
                        </tr>
                        <tr>
                            <td
                                style={{
                                    padding: 10,
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    borderBottomStyle: 'solid'
                                }}
                            >
                                Estadisticas
                            </td>
                            <i
                                style={{
                                    padding: 10,
                                }}
                                className="fas fa-chart-bar fa-2x"
                            >
                            </i>
                        </tr>
                        <tr>
                            <td
                                style={{
                                    padding: 10,
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    borderBottomStyle: 'solid'
                                }}
                            >
                                Predicciones
                            </td>
                            <i
                                style={{
                                    padding: 10,
                                }}
                                className="fas fa-bible fa-2x"
                            >
                            </i>
                        </tr>
                        {
                            props.sessionActive ? (
                                <tr>
                                    <td
                                        style={{
                                            padding: 10,
                                            fontWeight: 'bold',
                                            fontSize: 20,
                                            borderBottomStyle: 'solid'
                                        }}
                                    >
                                        Perfil
                                    </td>
                                    <i
                                        style={{
                                            padding: 10,
                                        }}
                                        className="fas fa-user-circle fa-2x"
                                    >
                                    </i>
                                </tr>
                            ) : (
                                <tr>
                                    <td
                                        style={{
                                            padding: 10,
                                            fontWeight: 'bold',
                                            fontSize: 20,
                                            borderBottomStyle: 'solid'
                                        }}
                                    >
                                        Iniciar sesion
                                        </td>
                                    <i
                                        style={{
                                            padding: 10,
                                        }}
                                        className="fas fa-sign-in-alt fa-2x"
                                    >
                                    </i>
                                </tr>
                            )
                        }
                        {
                            !props.sessionActive && (
                                <tr>
                                    <td
                                        style={{
                                            padding: 10,
                                            fontWeight: 'bold',
                                            fontSize: 20,
                                            borderBottomStyle: 'solid'
                                        }}
                                    >
                                        Registrarse
                                    </td>
                                    <i
                                        style={{
                                            padding: 10,
                                        }}
                                        className="fas fa-user-plus fa-2x"
                                    >
                                    </i>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MenuComponent;