/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import style from './Cell.scss';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Animated from 'components/Animated';
import Text from 'components/Text';
import Picture from 'components/Picture';
import { motion, useAnimation } from 'framer-motion';
import { useHistory } from 'react-router-dom';

const Cell = ({
  className,
  imgSrc,
  videoSrc,
  cellStyle,
  title,
  subTitle,
  retinaImgSrc,
  index,
}) => {
  const hoverRef = React.useRef();
  const videoRef = React.useRef();
  const [playingVideo, setPlayingVideo] = React.useState(false);
  const control = useAnimation();
  const history = useHistory();

  React.useEffect(() => {
    let data;
    hoverRef.current.addEventListener('mouseenter', () => {
      videoRef.current.currentTime = 0;
      setPlayingVideo(true);
      data = videoRef.current.play();
    });

    hoverRef.current.addEventListener('mouseleave', () => {
      setPlayingVideo(false);
      if (data !== undefined) {
        data.then(() => {
          videoRef.current.pause();
        });
      }
    });
  }, [hoverRef, videoRef]);

  const redirectToDetail = React.useCallback(() => {
    const position = hoverRef.current.getBoundingClientRect();
    history.push(`/pub/${index}`);

    control.start({
      transition: {
        delay: 0.4,
        duration: 0.7,
      },
      zIndex: 9999999,
      x: -Math.ceil(position.x),
      y: -Math.ceil(position.y),
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.6,
    });
  }, [control, history, index]);

  return (
    <motion.div
      animate={control}
      ref={hoverRef}
      className={classnames(style.root, className)}
      style={cellStyle}
      onClick={redirectToDetail}
    >
      <Picture
        className={style.cellImage}
        previewImg={imgSrc}
        retinaPreviewImg={retinaImgSrc}
      />
      <video
        ref={videoRef}
        className={classnames(style.cellVideo, {
          [style.hoverVideo]: playingVideo,
        })}
        poster={imgSrc}
        muted="muted"
        loop
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <Animated
        className={style.title}
        isVisible={playingVideo}
        duration={{
          in: 600,
          out: 250,
        }}
        delay={{
          in: 100,
          out: 100,
        }}
        animationIn="slideInUp"
      >
        <Text
          fontWeight="bold"
          fontType="BebasNeueBold"
          size="35"
          color="main-white"
        >
          {title}
        </Text>
      </Animated>
      <Animated
        className={style.subTitle}
        isVisible={playingVideo}
        duration={{
          in: 600,
          out: 250,
        }}
        delay={{
          in: 300,
          out: 100,
        }}
        animationIn="slideInUp"
      >
        <Text fontType="BebasNeueBold" size="17" color="main-white">
          {subTitle}
        </Text>
      </Animated>
    </motion.div>
  );
};

Cell.propTypes = {
  className: PropTypes.string,
  imgSrc: PropTypes.string.isRequired,
  videoSrc: PropTypes.string.isRequired,
  cellStyle: PropTypes.object,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  retinaImgSrc: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

Cell.defaultProps = {
  className: '',
  cellStyle: {},
  title: '',
  subTitle: '',
};

export default React.memo(Cell);
