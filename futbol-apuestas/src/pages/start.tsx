import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import MenuComponent from '../components/menu';

import type { RootState } from '../state-store/reducer.root';
import type { Session } from '../state-store/session/session.types';

const mapStateToProps = (state: RootState) => ({
    username: state.session.session.username,
    sessionActive: state.session.session.isSessionActive
})

const mapDispatchToProps = {
    setData: (data: Session) => ({
        type: 'SAVE_SESSION_DATA',
        data: data
    })
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    width: number
}

function Home(props: Props) {

    let history = useHistory();

    const [imgWidth, setImgWidth] = useState('100%');

    useEffect(() => {
        if (props.width > 769) { setImgWidth('40%') }
        else { setImgWidth('95%') }
    }, [props.width])

    return (
        <div>
            <MenuComponent sessionActive={props.sessionActive} />
            <div
                style={{
                    backgroundColor: 'red',
                    width: '99.5%',
                    borderStyle: 'solid',
                    borderColor: 'transparent'
                }}
            >
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: imgWidth }}>
                                <img
                                    alt={''}
                                    src={'https://static01.nyt.com/images/2018/08/24/sports/24spain-soccer-print/24spain-soccer-videoSixteenByNineJumbo1600.jpg'}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </td>
                            {
                                imgWidth === '40%' ? (
                                    <td>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontSize: 40,
                                                justifySelf: 'center',
                                                textAlign: 'start',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Partidos
                                        </p>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontSize: 20,
                                                justifySelf: 'center',
                                                textAlign: 'start',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Encuentra informacion en tiempo real sobre partidos, tornes, ligas, etc.
                                        </p>
                                    </td>
                                ) : (null)
                            }
                        </tr>
                        {
                            imgWidth === '40%' ? (null) :
                                (
                                    <tr>
                                        <td>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: 40,
                                                    justifySelf: 'center',
                                                    textAlign: 'start',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Partidos
                                        </p>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: 20,
                                                    justifySelf: 'center',
                                                    textAlign: 'start',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Encuentra informacion en tiempo real sobre partidos, tornes, ligas, etc.
                                            </p>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
            <div
                style={{
                    backgroundColor: 'blue',
                    width: '99.5%',
                    borderStyle: 'solid',
                    borderColor: 'transparent'
                }}
            >
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: imgWidth }}>
                                <img
                                    alt={''}
                                    src={'https://www.reelsofjoy.com/blog/wp-content/uploads/2020/10/Sports-gambler-celebrating.png'}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </td>
                            {
                                imgWidth === '40%' ? (
                                    <td>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontSize: 40,
                                                justifySelf: 'center',
                                                textAlign: 'start',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Apuestas
                                        </p>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontSize: 20,
                                                justifySelf: 'center',
                                                textAlign: 'start',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Prueba tu suerte y apuesta por tu equipo favorito.
                                        </p>
                                    </td>
                                ) : (null)
                            }
                        </tr>
                        {
                            imgWidth === '40%' ? (null) :
                                (
                                    <tr>
                                        <td>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: 40,
                                                    justifySelf: 'center',
                                                    textAlign: 'start',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Apuestas
                                        </p>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: 20,
                                                    justifySelf: 'center',
                                                    textAlign: 'start',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Prueba tu suerte y apuesta por tu equipo favorito.
                                        </p>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
            <div
                style={{
                    backgroundColor: 'green',
                    width: '99.5%',
                    borderStyle: 'solid',
                    borderColor: 'transparent'
                }}
            >
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: imgWidth }}>
                                <img
                                    alt={''}
                                    src={'https://i7.pngguru.com/preview/242/806/540/statistics-chart-data-table-table.jpg'}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </td>
                            {
                                imgWidth === '40%' ? (
                                    <td>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontSize: 40,
                                                justifySelf: 'center',
                                                textAlign: 'start',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Estadisticas
                                        </p>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontSize: 20,
                                                justifySelf: 'center',
                                                textAlign: 'start',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Echa un vistazo a estadisticas en tiempo real de tus jugadores y equipos favoritos.
                                        </p>
                                    </td>
                                ) : (null)
                            }
                        </tr>
                        {
                            imgWidth === '40%' ? (null) :
                                (
                                    <tr>
                                        <td>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: 40,
                                                    justifySelf: 'center',
                                                    textAlign: 'start',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Estadisticas
                                        </p>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: 20,
                                                    justifySelf: 'center',
                                                    textAlign: 'start',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Echa un vistazo a estadisticas en tiempo real de tus jugadores y equipos favoritos.
                                        </p>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
            <div
                style={{
                    backgroundColor: 'indigo',
                    width: '99.5%',
                    borderStyle: 'solid',
                    borderColor: 'transparent'
                }}
            >
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: imgWidth }}>
                                <img
                                    alt={''}
                                    src={'https://www.wineintelligence.com/wp-content/uploads/2017/12/Predictions.png'}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </td>
                            {
                                imgWidth === '40%' ? (
                                    <td>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontSize: 40,
                                                justifySelf: 'center',
                                                textAlign: 'start',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Predicciones
                                        </p>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontSize: 20,
                                                justifySelf: 'center',
                                                textAlign: 'start',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Gana dinero siempre con nuestras predicciones calculadas por nuestro clon de Albert Einstein
                                        </p>
                                    </td>
                                ) : (null)
                            }
                        </tr>
                        {
                            imgWidth === '40%' ? (null) :
                                (
                                    <tr>
                                        <td>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: 40,
                                                    justifySelf: 'center',
                                                    textAlign: 'start',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Predicciones
                                        </p>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontSize: 20,
                                                    justifySelf: 'center',
                                                    textAlign: 'start',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Gana dinero siempre con nuestras predicciones calculadas por nuestro clon de Albert Einstein
                                        </p>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default connector(Home);