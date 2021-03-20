import React, { useState } from 'react';
import { PageHeader } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Login from './login';
import Register from './register';
import NavDrawer from './navigationDrawer';

type Props = {
    sessionActive: boolean
}

function MenuComponent(props: Props) {

    const [menuVisible, setMenuVisible] = useState(false);
    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);

    return (
        <div>
            <PageHeader
                title={'FAP'}
                subTitle={'Futbol APuestas'}
                ghost={false}
                style={{
                    backgroundColor: '#dbd8e3'
                }}
                extra={[
                    <MenuOutlined
                        key={'menuIcon'}
                        onClick={() => (setMenuVisible(!menuVisible))}
                    />
                ]}
            >
            </PageHeader>
            <Login
                visible={loginVisible}
                onClose={() => (setLoginVisible(!loginVisible))}
            />
            <Register
                visible={registerVisible}
                onClose={() => (setRegisterVisible(!registerVisible))}
            />
            <NavDrawer
                menuVisible={menuVisible}
                setLoginVisible={() => (setLoginVisible(!loginVisible))}
                sessionActive={props.sessionActive}
                setMenuVisible={() => (setMenuVisible(!menuVisible))}
                setRegisterVisible={() => (setRegisterVisible(!registerVisible))}
            />
        </div>
    )
}

export default MenuComponent;