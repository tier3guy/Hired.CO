/* External Imports */
import {
  Box,
  Button,
  useTheme,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";

import {
  VideocamOff,
  MicOff,
  Mic,
  Videocam,
} from "@material-ui/icons";

import { red } from "@material-ui/core/colors";

/* Built-in Imports */
import React, { useEffect, useRef, useState } from "react";

/* Internal Imports */
import useResponsiveSize from "../utils/useResponsiveSize";
import { MeetingDetailsScreen } from "./MeetingDetailsScreen";
import { createMeeting, getToken, validateMeeting } from "../api";
import './CSS/joiningScreen.css';

const useStyles = makeStyles((theme) => ({

  toggleButton: {
    borderRadius: "100%",
    minWidth: "auto",
    width: "44px",
    height: "44px",
  },

}));

export function JoiningScreen({ participantName, setParticipantName, meetingId, setMeetingId, setToken, setWebcamOn, setMicOn, micOn, webcamOn, onClickStartMeeting,}) {
  
  const [readyToJoin, setReadyToJoin] = useState(false);
  const videoPlayerRef = useRef();
  const theme = useTheme();
  const styles = useStyles(theme);

  // Video track state
  const [videoTrack, setVideoTrack] = useState(null);

  const padding = useResponsiveSize({
    xl: 6,
    lg: 6,
    md: 6,
    sm: 4,
    xs: 1.5,
  });


  // Mic toggling function
  const _handleToggleMic = () => {
    setMicOn(!micOn);
  };

  // Camera toggling function
  const _handleToggleWebcam = () => {
    if (!webcamOn) {
      getVideo();
    } else {
      if (videoTrack) {
        videoTrack.stop();
        setVideoTrack(null);
      }
    }
    setWebcamOn(!webcamOn);
  };

  const getVideo = async () => {
    if (videoPlayerRef.current) {
      const videoConstraints = {
        video: {
          width: 1280,
          height: 720,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia( videoConstraints );
      const videoTracks = stream.getVideoTracks();

      const videoTrack = videoTracks.length ? videoTracks[0] : null;

      videoPlayerRef.current.srcObject = new MediaStream([videoTrack]);
      videoPlayerRef.current.play();

      setVideoTrack(videoTrack);
    }
  };

  // Camera Effect
  useEffect(() => {
    if (webcamOn && !videoTrack) {
      getVideo();
    }
  }, [webcamOn]);

  return (
    <div className="joiningSRN" >
      {
        readyToJoin ? (
          <div className="back_btn">
            <button onClick={() =>  setReadyToJoin(false) } className="btn shadow-none">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
          </div>
        ) : null
      }
      <Grid
        item
        xs={12}
        md={6}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}>
        {readyToJoin ? (
          <Box
            m={6}
            style={{
              display: "flex",
              flex: 1,
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: padding,
            }}>
            <div className="previewBox">

              <video autoplay playsInline muted ref={videoPlayerRef} controls={false} className="flip video-style" />

              {!webcamOn ? (
                <Box
                  position="absolute"
                  style={{
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    right: 0,
                    left: 0,
                  }}>
                  <Typography>Camera is Turned Off</Typography>
                </Box>
              ) : null}

              <Box
                position="absolute"
                bottom={theme.spacing(2)}
                left="0"
                right="0">
                <Grid
                  container
                  alignItems="center"
                  justify="center"
                  spacing={2}>
                  <Grid item>
                    <Tooltip
                      title={micOn ? "Turn off mic" : "Turn on mic"}
                      arrow
                      placement="top">
                      <Button
                        onClick={() => _handleToggleMic()}
                        variant="contained"
                        style={
                          micOn
                            ? {}
                            : {
                                backgroundColor: red[500],
                                color: "white",
                              }
                        }
                        className={styles.toggleButton}>
                        {micOn ? <Mic /> : <MicOff />}
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip
                      title={webcamOn ? "Turn off camera" : "Turn on camera"}
                      arrow
                      placement="top">
                      <Button
                        onClick={() => _handleToggleWebcam()}
                        variant="contained"
                        style={
                          webcamOn
                            ? {}
                            : {
                                backgroundColor: red[500],
                                color: "white",
                              }
                        }
                        className={styles.toggleButton}>
                        {webcamOn ? <Videocam /> : <VideocamOff />}
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Box>

            </div>

            <div className="name_container">
              <input className="input name__input font-main" onChange={ (e) => setParticipantName(e.target.value) }
                value={participantName}
                placeholder={"Please, enter your name before joining"}
              />
              <button
                onClick={(e) => {
                  if (videoTrack) {
                    videoTrack.stop();
                    setVideoTrack(null);
                  }
                  onClickStartMeeting();
                }}
                className="btn shadow-none btn-primary startbtn"
                id={"btnJoin"}>
                Start
              </button>
            </div>
          </Box>
        ) : (
          <MeetingDetailsScreen
            onClickJoin={async (id) => {
              const token = await getToken();
              const valid = await validateMeeting({ meetingId: id, token });
              if (valid) {
                setReadyToJoin(true);
                setToken(token);
                setMeetingId(id);
                setWebcamOn(true);
                setMicOn(true);
              } else alert("Invalid Meeting Id");
            }}
            onClickCreateMeeting={async () => {
              const token = await getToken();
              const _meetingId = await createMeeting({ token });
              setToken(token);
              setMeetingId(_meetingId);
              setReadyToJoin(true);
              setWebcamOn(true);
              setMicOn(true);
            }}
          />
        )}
      </Grid>
    </div>
  );
}
