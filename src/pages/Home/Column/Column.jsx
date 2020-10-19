/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import Text from 'components/Text';
import style from './Column.scss';
import PropTypes from 'prop-types';
import Animated from 'components/Animated';
import Picture from 'components/Picture';
import classnames from 'classnames';

const Column = ({ index, isLoading, title, images, video }) => {
  const [playingVideo, setPlayingVideo] = React.useState(false);
  const ref = React.useRef();
  const rootRef = React.useRef();

  React.useEffect(() => {
    let data = null;
    rootRef.current.addEventListener('mouseover', () => {
      ref.current.currentTime = 0;
      setPlayingVideo(true);
      data = ref.current.play();
    });

    rootRef.current.addEventListener('mouseout', () => {
      setPlayingVideo(false);
      if (data !== undefined) {
        data.then(() => {
          ref.current.pause();
        });
      }
    });
  }, [rootRef, ref]);

  return (
    <div className={style.root} ref={rootRef}>
      <Picture
        className={style.columnImage}
        previewImg={images.preview}
        retinaPreviewImg={images.preview_x2}
      />
      <video
        ref={ref}
        className={classnames(style.columnVideo, {
          [style.visibleColumnVideo]: playingVideo,
        })}
        poster={images.original}
        muted="muted"
        loop
      >
        <source src={video} type="video/mp4" />
      </video>
      <Animated
        className={style.columnTextWrapper}
        isVisible={isLoading}
        duration={{
          in: 600,
          out: 200,
        }}
        delay={{
          in: index * 50 + 400,
          out: 300,
        }}
        animationIn="fadeInUpSmall"
      >
        <Text
          fontWeight="bold"
          fontType="BebasNeueBold"
          className={style.columnText}
          size="42"
          color="main-white"
        >
          {title}
        </Text>
      </Animated>
    </div>
  );
};

Column.propTypes = {
  index: PropTypes.number,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  images: PropTypes.any,
  video: PropTypes.string,
};

Column.defaultProps = {
  index: 0,
  isLoading: true,
  title: '',
  images: {},
  video: '',
};

export default React.memo(Column);
