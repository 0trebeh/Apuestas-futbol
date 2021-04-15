import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MenuComponent from '../components/pageHeader';
import {Card, Carousel, Image} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

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

function Home(props: Props) {
  return (
    <div>
      <MenuComponent sessionActive={props.sessionActive} title={'Futbol APuestas'}/>
      <Carousel
        autoplay={true}
        draggable={true}
        swipeToSlide={true}
        adaptiveHeight={true}
        dots={true}
        dotPosition={'bottom'}>
        <Card
          hoverable={true}
          cover={
            <Image
              placeholder={<LoadingOutlined spin={true} />}
              preview={false}
              src={
                'https://media.foxdeportes.com/photos/cache/1024x574/photos/2018/02/07/5a7ba71046f7c.jpeg'
              }
            />
          }>
          <Card.Meta
            title={'Partidos'}
            description={
              'Encuentra informacion sobre partidos, ligas, torneos, etc.'
            }
          />
        </Card>
        <Card
          hoverable={true}
          cover={
            <Image
              placeholder={<LoadingOutlined spin={true} />}
              preview={false}
              src={
                'http://www.mundoesotericoparanormal.com/wp-content/uploads/2015/10/loteria-vision-remota.jpg'
              }
            />
          }>
          <Card.Meta
            title={'Predicciones'}
            description={
              'Encuentra las mejores predicciones calculadas por nuestro clon de Albert Einstein'
            }
          />
        </Card>
        <Card
          hoverable={true}
          cover={
            <Image
              placeholder={<LoadingOutlined spin={true} />}
              preview={false}
              src={
                'https://www.rushbet.co/blog/wp-content/uploads/2020/12/shutterstock_1505491208-1.jpg'
              }
            />
          }>
          <Card.Meta
            title={'Apuestas'}
            description={'Apuesta por tus equipos y/o jugadores favoritos'}
          />
        </Card>
        <Card
          hoverable={true}
          cover={
            <Image
              placeholder={<LoadingOutlined spin={true} />}
              preview={false}
              src={
                'http://4.bp.blogspot.com/-XslnkJaFqNA/UdjF4FchoHI/AAAAAAAAOHU/7bkDnpZ78KA/s1600/lionel+messi+bicycle+kick+photo+moment+5.jpg'
              }
            />
          }>
          <Card.Meta
            title={'Estadisticas'}
            description={
              'Encuentra estadisticas generales y por partidos de equipos y jugadores'
            }
          />
        </Card>
      </Carousel>
    </div>
  );
}

export default connector(Home);
