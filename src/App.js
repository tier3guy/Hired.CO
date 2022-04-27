/* Built-in imports */
import React, { useEffect, useRef, useState, useFullscreenStatus } from "react";

/* External Imports */
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  useConnection,
  usePubSub,
} from "@videosdk.live/react-sdk";

import { FullScreen, useFullScreenHandle } from "react-full-screen";

/* Internal Imports */
import { getToken } from "./api";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { JoiningScreen } from "./components/JoiningScreen";
import { CodeEditor } from "./components/CodeEditor";
import { DrawBoard } from "./components/DrawBoard";
import AlertCopy from './components/alertCopy';
import './App.css';

const primary = "#3E84F6";

const width = 400;
const height = (width * 2) / 3;
const borderRadius = 8;

const chunk = (arr) => {
  const newArr = [];
  while (arr.length) newArr.push(arr.splice(0, 3));
  return newArr;
};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const Title = ({ title, dark }) => {
  return <h2 style={{color : "var(--orange)"}}>{title}</h2>;
};


const ExternalVideo = () => {
  const [{ link, playing }, setVideoInfo] = useState({
    link: null,
    playing: false,
  });

  const onVideoStateChanged = (data) => {
    const { currentTime, link, status } = data;

    switch (status) {
      case "stopped":
        console.log("stopped in switch");
        externalPlayer.current.src = null;
        setVideoInfo({ link: null, playing: false });
        break;
      case "resumed":
        if (typeof currentTime === "number") {
          externalPlayer.current.currentTime = currentTime;
        }
        externalPlayer.current.play();
        setVideoInfo((s) => ({ ...s, playing: true }));
        break;
      case "paused":
        externalPlayer.current.pause();
        setVideoInfo((s) => ({ ...s, playing: false }));
        break;
      case "started":
        setVideoInfo({ link, playing: true });
        break;
      default:
        break;
    }
  };

  const onVideoSeeked = (data) => {
    const { currentTime } = data;
    if (typeof currentTime === "number") {
      externalPlayer.current.currentTime = currentTime;
    }
  };

  useMeeting({ onVideoStateChanged, onVideoSeeked });
  const externalPlayer = useRef();

  return !link ? null : (
    <div
      style={{
        borderRadius,
        padding: borderRadius,
        margin: borderRadius,
        backgroundColor: primary,
        display: "flex",
      }}
    >
      <Title title={"Externam Video"} />

      <video
        style={{ borderRadius, height, width, backgroundColor: "black" }}
        autoPlay
        ref={externalPlayer}
        src={link}
      />
    </div>
  );
};

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {
        messages?.map((message, i) => {
        const { senderName, message: text, timestamp } = message;

        return (
          <div
            style={{
              marginTop: "10px",
              backgroundColor: "var(--light-orange)",
              overflow: "hidden",
              padding: 8,
              color: "var(--dark-blue)",
              border: "1px solid var(--orange)"
            }}
            key={i}
          >
            <p style={{ margin: 0, padding: 0}}>
              {senderName}
            </p>
            <h3 style={{ margin: 0, padding: 0, marginTop: 4 }}>{text}</h3>
            <p
              style={{
                margin: 0,
                padding: 0,
                opacity: 0.6,
                marginTop: 4,
              }}
            >
              {formatAMPM(new Date(timestamp))}
            </p>
          </div>
          );
        })
      }
    </div>
  )
};


const MeetingChat = ({ tollbarHeight }) => {
  const { publish, messages } = usePubSub("CHAT", {});
  const [message, setMessage] = useState("");
  return (
    <div
      class="offcanvas offcanvas-end"
      tabindex="-1" id="chatBox" aria-labelledby="offcanvasRightLabel"
      style={{
        marginLeft: borderRadius,
        width: 400,
        color: "var(--dark-blue)",
        fontFamily: "var(--font-main)",
        backgroundColor: "var(--white)",
        overflowY: "scroll",
        height: "100vh",
        padding: "1.2em",
        zIndex : 100000,
      }}
    >
      <Title title={"Chat Box"} dark={"var(--orange)"} />

      <div style={{ display: "flex" }}>
        <input
          style={{
            borderRadius: "0",
          }}
          className = "input m-0 p-2 mr-2 w-75"
          value={message}
          onChange={(e) => {
            const v = e.target.value;
            setMessage(v);
          }}
        />
        <button
          style={{
            fontSize: "20px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "300"
          }}
          className={"button default btn shadow-none m-0 w-25"}
          onClick={() => {
            const m = message;

            if (m.length) {
              publish(m, { persist: true });
              setMessage("");
            }
          }}
        >
          Send
        </button>
      </div>
      <MessageList messages={messages} />
    </div>
  );
};

const ParticipantView = ({ participantId }) => {
  const webcamRef = useRef(null);
  const micRef = useRef(null);
  const screenShareRef = useRef(null);

  const onStreamEnabled = (stream) => {};
  const onStreamDisabled = (stream) => {};

  const {
    displayName,
    participant,
    webcamStream,
    micStream,
    screenShareStream,
    webcamOn,
    micOn,
    screenShareOn,
    isLocal,
    isActiveSpeaker,
    isMainParticipant,
    switchTo,
    pinState,
    setQuality,
    enableMic,
    disableMic,
    enableWebcam,
    disableWebcam,
    pin,
    unpin,
  } = useParticipant(participantId, {
    onStreamEnabled,
    onStreamDisabled,
  });

  useEffect(() => {
    if (webcamRef.current) {
      if (webcamOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);

        webcamRef.current.srcObject = mediaStream;
        webcamRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        webcamRef.current.srcObject = null;
      }
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  useEffect(() => {
    if (screenShareRef.current) {
      if (screenShareOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(screenShareStream.track);

        screenShareRef.current.srcObject = mediaStream;
        screenShareRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        screenShareRef.current.srcObject = null;
      }
    }
  }, [screenShareStream, screenShareOn]);

  return (
    <div
      style={{
        width,
        overflow: "hidden",
        margin: borderRadius,
        padding: borderRadius,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        position: "relative",
      }}
    >
      <audio ref={micRef} autoPlay muted={isLocal} />

      {
        screenShareOn ? 
        <div
          style={{
            position: "relative",
            borderRadius: borderRadius,
            overflow: "hidden",
            backgroundColor: "lightgreen",
            width: "100%",
            height: 400,
            borderRadius: 0
          }}
        >
          <div
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 0, border: "2px solid var(--orange)", }}
          >
            <video
              height={"100%"}
              width={"100%"}
              ref={screenShareRef}
              style={{
                backgroundColor: "black",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                objectFit: "contain",
              }}
              autoPlay
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            >
              <p
                className="font-main p-2 m-0"
                style={{
                  background: "var(--orange)",
                  color: screenShareOn ? "var(--white)" : "red",
                  fontSize: 16,
                  opacity: 1,
                }}
              >
                {`${displayName}'s screen`}
              </p>
            </div>
          </div>
        </div>
        :
        <div
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "pink",
          width: "100%",
          height: 400,
          border: "2px solid var(--orange)",
          boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
        }}
      >
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <video
            height={"100%"}
            width={"100%"}
            ref={webcamRef}
            style={{
              backgroundColor: "black",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              objectFit: "contain",
            }}
            autoPlay
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0
            }}
          >
            <p
              style={{
                color: webcamOn ? "var(--white)" : "red",
                fontSize: 20,
                opacity: 1,
                fontFamily: "var(--font-main)",
                background: "var(--orange)",
                padding: 12,
                borderRadius: "15px 0 0 15px"
              }}
            >
              {displayName}
            </p>
          </div>
        </div>
      </div>
      }

    </div>
  );
};

const ParticipantsView = () => {
  const { participants } = useMeeting();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        padding: borderRadius,
      }}
    >
      {chunk([...participants.keys()]).map((k) => (
        <div style={{ display: "flex" }}>
          {k.map((l) => (
            <ParticipantView key={l} participantId={l} />
          ))}
        </div>
      ))}
    </div>
  );
};

// Upper buttons
function MeetingView({ onNewMeetingIdToken, onMeetingLeave }) {
  const [participantViewVisible, setParticipantViewVisible] = useState(true);

  function onParticipantJoined(participant) {
    console.log(" onParticipantJoined", participant);
  }
  function onParticipantLeft(participant) {
    console.log(" onParticipantLeft", participant);
  }
  const onSpeakerChanged = (activeSpeakerId) => {
    console.log(" onSpeakerChanged", activeSpeakerId);
  };
  function onPresenterChanged(presenterId) {
    console.log(" onPresenterChanged", presenterId);
  }
  function onMainParticipantChanged(participant) {
    console.log(" onMainParticipantChanged", participant);
  }
  function onEntryRequested(participantId, name) {
    console.log(" onEntryRequested", participantId, name);
  }
  function onEntryResponded(participantId, name) {
    console.log(" onEntryResponded", participantId, name);
  }
  function onRecordingStarted() {
    console.log(" onRecordingStarted");
  }
  function onRecordingStopped() {
    console.log(" onRecordingStopped");
  }
  function onChatMessage(data) {
    console.log(" onChatMessage", data);
  }
  function onMeetingJoined() {
    console.log("onMeetingJoined");
  }
  function onMeetingLeft() {
    console.log("onMeetingLeft");
    onMeetingLeave();
  }
  const onLiveStreamStarted = (data) => {
    console.log("onLiveStreamStarted example", data);
  };
  const onLiveStreamStopped = (data) => {
    console.log("onLiveStreamStopped example", data);
  };
  const onVideoStateChanged = (data) => {
    console.log("onVideoStateChanged", data);
  };
  const onVideoSeeked = (data) => {
    console.log("onVideoSeeked", data);
  };
  const onWebcamRequested = (data) => {
    console.log("onWebcamRequested", data);
  };
  const onMicRequested = (data) => {
    console.log("onMicRequested", data);
  };
  const onPinStateChanged = (data) => {
    console.log("onPinStateChanged", data);
  };
  const onSwitchMeeting = (data) => {
    window.focus();
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to switch Meeting ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            onNewMeetingIdToken(data);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  const onConnectionOpen = (data) => {
    console.log("onConnectionOpen", data);
  };

  const {
    meetingId,
    meeting,
    localParticipant,
    mainParticipant,
    activeSpeakerId,
    participants,
    presenterId,
    localMicOn,
    localWebcamOn,
    localScreenShareOn,
    messages,
    isRecording,
    isLiveStreaming,
    pinnedParticipants,
    //
    join,
    leave,
    connectTo,
    end,
    //
    startRecording,
    stopRecording,
    //
    respondEntry,
    //
    muteMic,
    unmuteMic,
    toggleMic,

    //
    disableWebcam,
    enableWebcam,
    toggleWebcam,
    //
    disableScreenShare,
    enableScreenShare,
    toggleScreenShare,
    //
    getMics,
    getWebcams,
    changeWebcam,
    changeMic,

    startVideo,
    stopVideo,
    resumeVideo,
    pauseVideo,
    seekVideo,
    startLivestream,
    stopLivestream,
  } = useMeeting({ onParticipantJoined, onParticipantLeft, onSpeakerChanged, onPresenterChanged, onMainParticipantChanged, onEntryRequested, onEntryResponded, onRecordingStarted, onRecordingStopped, onChatMessage, onMeetingJoined, onMeetingLeft, onLiveStreamStarted, onLiveStreamStopped, onVideoStateChanged, onVideoSeeked, onWebcamRequested, onMicRequested, onPinStateChanged, onSwitchMeeting, onConnectionOpen });

  const handlestartVideo = () => {
    console.log("handlestartVideo");

    startVideo({
      link: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
    });
  };
  const handlestopVideo = () => {
    stopVideo();
  };
  const handleresumeVideo = () => {
    resumeVideo();
  };
  const handlepauseVideo = () => {
    pauseVideo({ currentTime: 2 });
  };
  const handlesseekVideo = () => {
    seekVideo({ currentTime: 5 });
  };
  const handleStartLiveStream = () => {
    startLivestream([
      {
        url: "rtmp://a.rtmp.youtube.com/live2",
        streamKey: "key",
      },
    ]);
  };
  const handleStopLiveStream = () => {
    stopLivestream();
  };
  const handleStartRecording = () => {
    startRecording();
  };
  const handleStopRecording = () => {
    stopRecording();
  };


  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(e.target.innerHTML);
  }
  
  const tollbarHeight = 120;

  return (
    <div className="main-meeting-container">

      <div style={{ height: tollbarHeight }} className="controllers">

        <button className={"button red btn-controller"} onClick={leave}>
          <i class="fa-solid fa-phone"></i>
        </button>
        
        <div className="ml-5 mr-5 d-flex justify-content-between align-items-center">
          <button className={"button blue btn-controller"} onClick={toggleMic}>
            { localMicOn ? <i class="fa-solid fa-microphone"></i> : <i class="fa-solid fa-microphone-slash"></i>} 
          </button>
          <button className={"button blue btn-controller"} onClick={toggleWebcam}>
            { localWebcamOn ? <i class="fa-solid fa-video"></i> : <i class="fa-solid fa-video-slash"></i> }
          </button>
          <button className={"button blue btn-controller"} onClick={toggleScreenShare}>
            <i class="fa-solid fa-arrow-up-from-bracket"></i>
          </button>
          <button className={"button blue btn-controller"} type="button" data-bs-toggle="offcanvas" data-bs-target="#codeEditor" aria-controls="offcanvasTop">
            <i class="fa-solid fa-code"></i>
          </button>
          <button className={"button blue btn-controller"} type="button" data-bs-toggle="offcanvas" data-bs-target="#drawborad-container" aria-controls="offcanvasTop">
            <i class="fa-solid fa-pencil"></i>
          </button>
        </div>

        <button className={"button blue btn-controller"} type="button" data-bs-toggle="offcanvas" data-bs-target="#chatBox" aria-controls="offcanvasRight">
          <i class="fa-solid fa-message"></i>
        </button>

        {/* 


        <button className={"button blue"} onClick={handlestartVideo}>
          startVideo
        </button>
        <button className={"button blue"} onClick={handlestopVideo}>
          stopVideo
        </button>
        <button className={"button blue"} onClick={handleresumeVideo}>
          resumeVideo
        </button>
        <button className={"button blue"} onClick={handlepauseVideo}>
          pauseVideo
        </button>
        <button className={"button blue"} onClick={handlesseekVideo}>
          seekVideo
        </button>
        <button className={"button blue"} onClick={handleStartLiveStream}>
          Start Live Stream
        </button>
        <button className={"button blue"} onClick={handleStopLiveStream}>
          Stop Live Stream
        </button>
        <button className={"button blue"} onClick={handleStartRecording}>
          start recording
        </button>
        <button className={"button blue"} onClick={handleStopRecording}>
          stop recording
        </button>

        */}

      </div>


      <h4 className="m-4 font-main font-blue">Meeting id is : <span 
      onClick={(e) => copyToClipboard(e) }
      data-toggle="modal" 
      data-target=".bd-example-modal-sm" 
      title="Click to Copy" 
      className="font-main font-orange" 
      id="meetIDCopy">{meetingId}</span></h4>
      <AlertCopy/>
      <div style={{ display: "flex", flex: 1 }}>
        <CodeEditor/>
        <DrawBoard/>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            flex: 1,
            overflowY: "hidden",
            height: '65vh',
          }}
        >
          <ExternalVideo />
          <ParticipantsView />
        </div>
        <MeetingChat tollbarHeight={tollbarHeight} />
      </div>
    </div>
  );
}

const App = () => {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [isMeetingStarted, setMeetingStarted] = useState(false);

  return isMeetingStarted ? (
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: micOn,
          webcamEnabled: webcamOn,
          name: participantName ? participantName : "TestUser",
        }}
        token={token}
        reinitialiseMeetingOnConfigChange={true}
        joinWithoutUserInteraction={true}
      >
        
        <MeetingView
          onNewMeetingIdToken={({ meetingId, token }) => {
            setMeetingId(meetingId);
            setToken(token);
          }}
          onMeetingLeave={() => {
            setToken("");
            setMeetingId("");
            setWebcamOn(false);
            setMicOn(false);
            setMeetingStarted(false);
          }}
        />
      </MeetingProvider>
  ) : (
    <JoiningScreen
      participantName={participantName}
      setParticipantName={setParticipantName}
      meetinId={meetingId}
      setMeetingId={setMeetingId}
      setToken={setToken}
      setMicOn={setMicOn}
      micOn={micOn}
      webcamOn={webcamOn}
      setWebcamOn={setWebcamOn}
      onClickStartMeeting={() => {
        setMeetingStarted(true);
      }}
      startMeeting={isMeetingStarted}
    />
  );
};

export default App;
