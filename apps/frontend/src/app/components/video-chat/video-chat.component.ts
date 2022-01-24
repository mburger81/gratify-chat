import { Component, ViewChild } from '@angular/core';
import { addDoc, Firestore, doc, collection, setDoc, updateDoc, onSnapshot, getDoc } from '@angular/fire/firestore';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss']
})
export class VideoChatComponent {
  @ViewChild('webcamVideo', {static: false}) webcamVideo;
  @ViewChild('remoteVideo') remoteVideo;
  @ViewChild('webcamButton') webcamButton;
  @ViewChild('callButton') callButton;
  @ViewChild('callInput', {static: false}) callInput;
  @ViewChild('answerButton') answerButton;
  @ViewChild('hangupButton') hangupButton;

  private servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'], // free stun server
      },
    ],
    iceCandidatePoolSize: 10,
  };

  // global states
  private pc = new RTCPeerConnection(this.servers);
  private localStream = null;
  private remoteStream = null


  constructor(
    private firestore: Firestore
  ) { }


  async start() {
    // setting local stream to the video from our camera
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    // initalizing the remote server to the mediastream
    this.remoteStream = new MediaStream();


    // Pushing tracks from local stream to peerConnection
    this.localStream.getTracks().forEach(track => {
        this.pc.addTrack(track, this.localStream);
    })

    this.pc.ontrack = event => {
        event.streams[0].getTracks().forEach((track) => {
            this.remoteStream.addTrack(track)
        });
    };

    // displaying the video data from the stream to the webpage
    this.webcamVideo.nativeElement.srcObject = this.localStream;
    this.remoteVideo.nativeElement.srcObject = this.remoteStream;

    // enabling and disabling interface based on the current condtion
    this.callButton.disabled = false;
    this.answerButton.disabled = false;
    this.webcamButton.disabled = true;
  }

  async call() {
    // referencing firebase collections
    const callDoc = await doc(collection(this.firestore, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidiates = collection(callDoc, 'answerCandidates');

    // setting the input value to the calldoc id
    this.callInput.nativeElement.value = callDoc.id;

    // get candidiates for caller and save to db
    this.pc.onicecandidate = event => {
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    }

    // create offer
    const offerDescription = await this.pc.createOffer();
    await this.pc.setLocalDescription(offerDescription);

    // config for offer
    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type
    }

    await setDoc(callDoc, {offer});


    // listening to changes in firestore and update the streams accordingly
    onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();

        if (!this.pc.currentRemoteDescription && data.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            this.pc.setRemoteDescription(answerDescription);
        }

        // if answered add candidates to peer connection
        onSnapshot(answerCandidiates, (snapshot) => {
            snapshot.docChanges().forEach(change => {

                if (change.type === 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    this.pc.addIceCandidate(candidate);
                }
            })
        })
    })

    this.hangupButton.disabled = false;
  }

  async answer() {
    const callId = this.callInput.nativeElement.value;

    // getting the data for this particular call
    const callDoc = doc(collection(this.firestore, 'calls'), callId);

    const answerCandidates = collection(callDoc, 'answerCandidates');
    const offerCandidates = collection(callDoc, 'offerCandidates');

    // here we listen to the changes and add it to the answerCandidates
    this.pc.onicecandidate = event => {
        event.candidate && addDoc(answerCandidates, event.candidate.toJSON());

    }

    const callData = (await getDoc(callDoc)).data();

    // setting the remote video with offerDescription
    const offerDescription = callData.offer;
    await this.pc.setRemoteDescription(new RTCSessionDescription(offerDescription));


    // setting the local video as the answer
    const answerDescription = await this.pc.createAnswer();
    await this.pc.setLocalDescription(new RTCSessionDescription(answerDescription));

    // answer config
    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp
    }

    await updateDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach(change => {

            if (change.type === 'added') {
                const data = change.doc.data();
                this.pc.addIceCandidate(new RTCIceCandidate(data));

            }
        })
    })
  }
}
