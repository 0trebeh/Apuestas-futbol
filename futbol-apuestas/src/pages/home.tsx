import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import MenuComponent from '../components/pageHeader';
import {PageHeader} from 'antd';

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
        </div>
    )
}

export default connector(Home);