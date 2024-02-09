import { Color, FontFamily, LogoMark } from 'constants';
import { RNFFmpegConfig, LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const _generatePath = (baseUri) => {
  const timeStamp = Math.floor(Math.random() * 999999898989898) + 1;
  const path = baseUri.slice(0, baseUri.lastIndexOf('/') + 1);
  return `${path}${timeStamp}.mp4`;
};

const _getResponsiveSize = (actualSize, containerDim, videDim) => {
  let rSize = (actualSize * 100) / containerDim.height;
  console.log(
    '--------- actualSize',
    actualSize,
    ' Container Dim',
    containerDim,
    ' Video Dim: ',
    videDim,
    ' rSize: ',
    rSize,
  );
  return (rSize / 100) * (videDim.height + 8);
};

const parseMillisecondsIntoReadableTime = (milliseconds) => {
  //Get hours from milliseconds
  var hours = milliseconds / (1000*60*60);
  var absoluteHours = Math.floor(hours);
  var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

  //Get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteMinutes = Math.floor(minutes);
  var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteMinutes) * 60;
  var absoluteSeconds = Math.floor(seconds);
  var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


  return h + ':' + m + ':' + s;
}

export const _generateThumbnail = (videoUri, frameTime, response) => {
  const timeStamp = Math.floor(Math.random() * 999999898989898) + 1;
  const path = videoUri.slice(0, videoUri.lastIndexOf('/') + 1);
  const frameTimestamp = parseMillisecondsIntoReadableTime(frameTime);
  RNFFmpeg.executeAsync(
    `-ss ${frameTimestamp} -i ${videoUri} -vf "scale=80:80:force_original_aspect_ratio=decrease" -vframes 1 ${path}${timeStamp}.jpg`,
    (completedExecution) => {
      if (completedExecution.returnCode === 0) {
        response([completedExecution.returnCode, `${path}${timeStamp}.jpg`]);
      } else {
        response([completedExecution.returnCode, '']);
      }
    },
  ).then((executionId) => {
    console.log(" FFFMPG ", executionId)
    //ExecutionStarted
  });
};

export const _stampMark = (downloadUri, response) => {
  const timeStamp = Math.floor(Math.random() * 999999898989898) + 1;
  const path = downloadUri.slice(0, downloadUri.lastIndexOf('/') + 1);
  const waterMark = LogoMark.WaterMark;
  RNFFmpeg.executeAsync(
    `-i ${downloadUri} -i ${waterMark} -filter_complex "overlay=10:main_h-overlay_h-10" -codec:a copy ${path}${timeStamp}.mp4`,
    (completedExecution) => {
      if (completedExecution.returnCode === 0) {
        response([completedExecution.returnCode, `${path}${timeStamp}.mp4`]);
      } else {
        response([completedExecution.returnCode, '']);
      }
    },
  ).then((executionId) => {
    //ExecutionStarted
  });
};

export const _formatVideo = (videoUri, response) => {
  let formatedVideo = _generatePath(videoUri);
  RNFFmpeg.executeAsync(`-i ${videoUri} -c:v mpeg4 ${formatedVideo}`, async (session) => {
    const returnCode = await session.returnCode;
    if (returnCode === 0) {
      console.log('FFmpeg process completed successfully', `${formatedVideo}`);
      response({ video: formatedVideo, returnCode: returnCode });
    } else {
      response({ video: '', returnCode: returnCode });
      console.log(`FFmpeg process failed with rc=${returnCode}.`);
    }
  }).then((executionId) => {
    console.log(`Async FFmpeg process started with executionId ${executionId}.`);
  });
};


export const addFilter = (
  videoUri,
  selectedEmoji,
  textOver,
  containerDim,
  videoDim,
  oldColor,
  hasAudio,
  response,
) => {
  let outPutVideo = _generatePath(videoUri);
  const audioStream = hasAudio ? ' -map 0:a ' : '';
  const path = videoUri.slice(0, videoUri.lastIndexOf('/') + 1);
  const fontPath = path + 'Roboto.ttf';
  if (Platform.OS == 'android') {
    RNFS.copyFileAssets('fonts/Roboto.ttf', fontPath)
      .then((binary) => {})
      .catch(console.error);
  }
  var imgInputs = '';
  for (var i = 0; i < selectedEmoji.length; i++) {
    imgInputs = imgInputs + ' -i ' + selectedEmoji[i].uri;
  }
  var scaleFilters = [];
  for (let i = 0; i < selectedEmoji.length; i++) {
    let imageSize = _getResponsiveSize(selectedEmoji[i].height, containerDim, videoDim);
    scaleFilters.push(`[${i + 1}:v]scale=${imageSize}:${imageSize}[ovr${i + 1}]`);
  }
  var overlayFilters = '';
  for (let i = 0; i < selectedEmoji.length; i++) {
    if (i == 0) {
      overlayFilters = `[0:v][ovr${1}]overlay=${selectedEmoji[i].cords.left}:${
        selectedEmoji[i].cords.top
      }[out${i + 1}]`;
    } else {
      overlayFilters += `; [out${i}][ovr${i + 1}]overlay=${selectedEmoji[i].cords.left}:${
        selectedEmoji[i].cords.top
      }[out${i + 1}]`;
    }
  }

  var scaleFilters = scaleFilters.join('; ') + '; ' + overlayFilters;
  if (textOver.length < 1 && selectedEmoji.length < 1) {
    response({ video: videoUri, returnCode: 0 });
    return;
  } else if (textOver.length > 0 && selectedEmoji.length < 1) {
    var drawTextChain = `-y -i ${videoUri} -vf `;
    for (let i = 0; i < textOver.length; i++) {
      let rFontSize = _getResponsiveSize(textOver[i].fontsize, containerDim, videoDim);
      console.log(" Lines: ", textOver[i].lines)
      var lineHeight = 0;
      for(let j = 0; j < textOver[i].destructuredText.length; j++){
        drawTextChain += `drawtext="text=${textOver[i].destructuredText[j].text}: x=${textOver[i].cords.left}: y=${
        textOver[i].cords.top + lineHeight
          }: fontsize=${rFontSize}: fontcolor="${textOver[i].fontColor}": fontfile='${
            Platform.OS == 'ios' ? RNFS.MainBundlePath + '/Roboto-Regular.ttf' : fontPath
          }'",`;
          lineHeight += rFontSize;
      }
    }

    var ffmpegCommand = drawTextChain.substring(0, drawTextChain.length - 1) + ' -codec:a copy ';
    //onlyText
  } else if (textOver.length < 1 && selectedEmoji.length > 0) {
    var ffmpegCommand = `-i ${videoUri} ${imgInputs} -filter_complex "${scaleFilters}" -map "[out${selectedEmoji.length}]"${audioStream}`;
    //OnlyEmoji
  } else if (textOver.length > 0 && selectedEmoji.length > 0) {
    var drawTextChain = '';
    for (let i = 0; i < textOver.length; i++) {
      let rFontSize = _getResponsiveSize(textOver[i].fontsize, containerDim, videoDim);
      var lineHeight = 0;
      for(let j = 0; j < textOver[i].destructuredText.length; j++){
        drawTextChain += `drawtext="text=${textOver[i].destructuredText[j].text}: x=${textOver[i].cords.left}: y=${
        textOver[i].cords.top + lineHeight
          }: fontsize=${rFontSize}: fontcolor="${textOver[i].fontColor}": fontfile='${
            Platform.OS == 'ios' ? RNFS.MainBundlePath + '/Roboto-Regular.ttf' : fontPath
          }'",`;
          lineHeight += rFontSize;
      }
    }

    var ffmpegCommand = `-i ${videoUri} ${imgInputs} -filter_complex "${scaleFilters}",[out${
      selectedEmoji.length
    }]${drawTextChain.substring(0, drawTextChain.length - 1)}[out${
      selectedEmoji.length + 1
    }] -map "[out${selectedEmoji.length + 1}]"${audioStream}`;
    //BothFound
  }
  RNFFmpeg.executeAsync(`${ffmpegCommand} ${outPutVideo}`, async (session) => {
    const returnCode = await session.returnCode;
    if (returnCode === 0) {
      response({ video: outPutVideo, returnCode: returnCode });
    } else {
      response({ video: '', returnCode: returnCode });
    }
  }).then((executionId) => {
    //ProcessStarted
  });
};

export const removeAudio = (videoUrl, response) => {
  const outPutVideo = _generatePath(videoUrl);
  const videoPath = decodeURIComponent(videoUrl);
  RNFFmpeg.executeAsyncWithArguments(
    ['-i', videoPath, '-c', 'copy', '-an', `${outPutVideo}`],
    (completedExecution) => {
      if (completedExecution.returnCode === 0) {
        response({ video: outPutVideo, returnCode: completedExecution.returnCode });
      } else {
        response({ video: '', returnCode: completedExecution.returnCode });
      }
    },
  );
};

export const _appendAudio = (videoPath, songObj, duration, response) => {
  const outPutVideo = _generatePath(videoPath);
  const songPath = decodeURIComponent(Platform.OS == 'android' ? songObj.fileCopyUri : songObj.uri);
  const vidDuration = duration.toString();
  try {
    RNFFmpeg.executeAsyncWithArguments(
      [
        '-i',
        videoPath,
        '-i',
        songPath,
        '-c:v',
        'copy',
        '-c:a',
        'aac',
        '-map',
        '0:v:0',
        '-map',
        '1:a:0',
        '-ss',
        '0',
        '-t',
        vidDuration,
        `${outPutVideo}`,
      ],
      (completedExecution) => {
        if (completedExecution.returnCode === 0) {
          response({ video: outPutVideo, returnCode: completedExecution.returnCode });
        } else {
          response({ video: outPutVideo, returnCode: completedExecution.returnCode });
        }
      },
    );
  } catch (error) {}
};

export const _trimVideo = (uri, sliderRange, response) => {
  let totalD = Math.floor(sliderRange[1] - sliderRange[0]);
  const outPutVideo = _generatePath(uri);
  const videoPath = decodeURIComponent(uri);
  RNFFmpeg.executeAsyncWithArguments(
    [
      '-ss',
      sliderRange[0].toString(),
      '-i',
      videoPath,
      '-vcodec',
      'copy',
      '-acodec',
      'copy',
      '-t',
      totalD.toString(),
      `${outPutVideo}`,
    ],
    (completedExecution) => {
      if (completedExecution.returnCode === 0) {
        response({ video: outPutVideo, returnCode: completedExecution.returnCode });
      } else {
        response({ video: '', returnCode: completedExecution.returnCode });
      }
    },
  );
};
