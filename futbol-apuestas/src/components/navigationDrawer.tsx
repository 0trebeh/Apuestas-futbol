import React from 'react';
import {useHistory} from 'react-router-dom';
import {Drawer, Typography, Menu, notification} from 'antd';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';

import type {RootState} from '../state-store/reducer.root';

type menuOptions = {
  name: string;
  action: () => void;
  type: string;
};

const mapDispatchToProps = {
  reduxClearState: () => ({type: 'CLEAR_SESSION_DATA'}),
};
const mapStateToProps = (state: RootState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  menuVisible: boolean;
  setMenuVisible: () => void;
  setLoginVisible: () => void;
  setRegisterVisible: () => void;
  sessionActive: boolean;
};

const NavigationDrawer = (props: Props) => {
  const history = useHistory();

  const logout = async () => {
    notification.info({
      placement: 'topLeft',
      message: 'Cerrando sesion...',
    });
    try {
      await axios.get('/users/logout', {
        headers: {
          authorization: props.token,
        },
      });
      props.reduxClearState();
      notification.success({
        message: 'Sesion terminada.',
        placement: 'topRight',
      });
      history.push('/');
    } catch (err) {
      notification.error({
        message: 'Error cerrando sesion.',
        description: 'Intente de nuevo mas tarde.',
        placement: 'topRight',
      });
      console.error(err);
    }
  };

  const menuOptions: menuOptions[] = [
    {
      name: 'Pagina principal',
      action: () => history.push('/'),
      type: 'global',
    },
    {
      name: 'Estadisticas',
      action: () => history.push('/estadisticas'),
      type: 'session',
    },
    {
      name: 'Predicciones',
      action: () => history.push('/predicciones'),
      type: 'session',
    },
    {
      name: 'Partidos y Apuestas',
      action: () => history.push('/matches'),
      type: 'session',
    },
    {
      name: 'Notificaciones',
      action: () => history.push('/notifications'),
      type: 'session',
    },
    {
      name: 'Iniciar sesion',
      action: props.setLoginVisible,
      type: 'visit',
    },
    {
      name: 'Registrarse',
      action: props.setRegisterVisible,
      type: 'visit',
    },
    {
      name: 'Perfil',
      action: () => history.push('/profile'),
      type: 'session',
    },
    {
      name: 'Cerrar sesion',
      action: () => logout(),
      type: 'session',
    },
  ];

  return (
    <Drawer
      placement={'right'}
      closable={false}
      visible={props.menuVisible}
      onClose={props.setMenuVisible}>
      <Menu defaultSelectedKeys={['0']}>
        <Typography.Title>Menu</Typography.Title>
        {props.sessionActive
          ? menuOptions.map((option, index) => {
              if (option.type !== 'visit')
                return (
                  <Menu.Item key={index} onClick={option.action}>
                    {option.name}
                  </Menu.Item>
                );
              else return null;
            })
          : menuOptions.map((option, index) => {
              if (option.type !== 'session')
                return (
                  <Menu.Item key={index} onClick={option.action}>
                    {option.name}
                  </Menu.Item>
                );
              else return null;
            })}
      </Menu>
    </Drawer>
  );
};

export default connector(NavigationDrawer);
