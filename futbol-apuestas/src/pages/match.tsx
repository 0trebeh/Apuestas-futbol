import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MenuComponent from '../components/pageHeader';
import {Card} from 'antd';

import type {RootState} from '../state-store/reducer.root';
import type {Session} from '../state-store/session/session.types';

const mapStateToProps = (state: RootState) => ({
  username: state.session.session.username,
  sessionActive: state.session.session.isSessionActive,
});
const mapDispatchToProps = {
  setData: (data: Session) => ({
    type: 'SAVE_SESSION_DATA',
    data: data,
  }),
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function Match(props: Props) {
  return (
    <div>
      <MenuComponent sessionActive={props.sessionActive} />
        <Card.Meta
            title={'Partidos'}
            description={
                'Partidos'
            }
        />
    </div>
  );
}

export default connector(Match);