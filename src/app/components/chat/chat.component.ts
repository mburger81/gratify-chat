import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonTextarea, Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';


// custom imports
import { ChatService } from '../../shared/services/chat/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonTextarea) ionTextarea: IonTextarea;


  messages: Observable<any[]>;
  newMsg = '';

  private onScreenKeyboard = false;
  private keyboardSubscription: Subject<void>;


  constructor(private chatService: ChatService, private platform: Platform) {
    this.keyboardSubscription =
          this.platform
                .keyboardDidShow
                  .subscribe(
                    (ev) => {
                      this.onScreenKeyboard = true;

                      if (!this.keyboardSubscription.closed) {
                        this.keyboardSubscription.unsubscribe();
                      }
                    }
                  ) as Subject<void>;
  }
  ngOnInit() {
    this.messages = this.chatService.getChatMessages();
  }
  ngAfterViewInit() {
    // sthis.content.scrollToBottom(300).then(() => {});
  }
  ngOnDestroy() {
    if (!this.keyboardSubscription.closed) {
      this.keyboardSubscription.unsubscribe();
    }
  }


  keydown(event: KeyboardEvent) {
    if (this.onScreenKeyboard) {
      return;
    }

    if (event.key === 'Enter') {
      if (event.ctrlKey || event.metaKey) {
        this.newMsg = this.newMsg.concat('\n');
      } else {
        event.preventDefault();
        this.sendMessage();
      }
    }
  }

  sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom(300).then(() => {});
      this.ionTextarea.setFocus().then(() => {});
    });
  }
}
