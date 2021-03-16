import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import type { RootState } from '../state-store/reducer.root';
import type { Session } from '../state-store/session/session.types';

const mapStateToProps = (state: RootState) => ({
    username: state.session.session.username
})

const mapDispatchToProps = {
    setData: (data: Session) => ({
        type: 'SAVE_SESSION_DATA',
        data: data
    })
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux;

function Home(props: Props) {

    let history = useHistory();

    return (
        <div>
            <p>{props.username}</p>
            <button
                onClick={() => {
                    props.setData({username: '0asdasdasdasd', token: 'vertale'})
                }}
            >
                asdasdasdasd
            </button>
        </div>
    )
}

export default connector(Home);